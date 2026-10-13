import { readFile } from "node:fs/promises";
import path from "node:path";
import { imageVariants, uploadBreakpoints } from "./imageVariants";

const STALE_FORMATS = ["card", "tablet", "square"];
const WIDTH_KEYS = Object.keys(uploadBreakpoints);

export type StoredFormat = {
  url?: string;
  width?: number;
  height?: number;
  hash?: string;
  name?: string;
  ext?: string;
  mime?: string;
  size?: number;
  sizeInBytes?: number;
  path?: string | null;
};

export type UploadRecord = {
  id?: number;
  mime?: string | null;
  ext?: string | null;
  url?: string | null;
  hash?: string | null;
  name?: string | null;
  width?: number | null;
  height?: number | null;
  blurDataURL?: string | null;
  formats?: Record<string, StoredFormat | null> | null;
};

export type RewritePlan =
  | { action: "skip"; reason: "svg" | "current" }
  | { action: "rewrite"; remove: string[]; keep: string[]; original: string | null };

type UploadProvider = {
  upload: (file: Record<string, unknown>) => Promise<void>;
  delete: (file: StoredFormat) => Promise<void>;
};

export type RewriteStrapi = {
  db: {
    query: (uid: string) => {
      findMany: () => Promise<UploadRecord[]>;
      update: (args: { where: { id: number }; data: Record<string, unknown> }) => Promise<unknown>;
    };
  };
  dirs: { static: { public: string } };
  plugin: (name: string) => { provider: UploadProvider };
  log: { info: (message: string) => void; error: (message: string) => void };
};

function isSvg(file: UploadRecord): boolean {
  const mime = (file.mime ?? "").toLowerCase();
  const ext = (file.ext ?? "").toLowerCase();
  return mime.includes("svg") || ext === ".svg";
}

function hasBlur(file: UploadRecord): boolean {
  return typeof file.blurDataURL === "string" && file.blurDataURL.startsWith("data:image");
}

function expectedWidthKeys(sourceWidth: number | null | undefined): string[] {
  if (typeof sourceWidth !== "number" || sourceWidth <= 0) return WIDTH_KEYS;
  return WIDTH_KEYS.filter((key) => uploadBreakpoints[key as keyof typeof uploadBreakpoints] <= sourceWidth);
}

function hasAllWidths(file: UploadRecord): boolean {
  const formats = file.formats ?? {};
  return expectedWidthKeys(file.width).every((key) => {
    const format = formats[key];
    return Boolean(format && typeof format.url === "string");
  });
}

/** Pure decision for one stored upload. Does not read the database. */
export function planUploadRewrite(file: UploadRecord): RewritePlan {
  if (isSvg(file)) return { action: "skip", reason: "svg" };

  const formats = file.formats ?? {};
  const keys = Object.keys(formats);
  const current = hasAllWidths(file) && hasBlur(file) && !keys.some((key) => STALE_FORMATS.includes(key));
  if (current) return { action: "skip", reason: "current" };

  const remove = keys.filter((key) => STALE_FORMATS.includes(key));
  const keep = keys.filter((key) => key === "thumbnail" || WIDTH_KEYS.includes(key));
  return {
    action: "rewrite",
    remove,
    keep,
    original: file.url ?? null,
  };
}

function kbytes(bytes: number): number {
  return Math.round((bytes / 1000) * 100) / 100;
}

function publicFile(root: string, url: string): string {
  const relative = url.replace(/^\/+/, "");
  return path.join(root, relative);
}

async function rewriteOne(strapi: RewriteStrapi, file: UploadRecord): Promise<void> {
  const plan = planUploadRewrite(file);
  if (plan.action === "skip" || file.id == null || !file.url || !file.hash || !file.ext) return;

  const buffer = await readFile(publicFile(strapi.dirs.static.public, file.url));
  const variants = await imageVariants(buffer, file.mime ?? "application/octet-stream");
  const provider = strapi.plugin("upload").provider;
  const formats: Record<string, StoredFormat | null> = {};

  for (const key of plan.keep) {
    const existing = file.formats?.[key];
    if (existing) formats[key] = existing;
  }

  for (const variant of variants.widths) {
    const next: Record<string, unknown> = {
      name: `${variant.key}_${file.name ?? "file"}`,
      hash: `${variant.key}_${file.hash}`,
      ext: file.ext,
      mime: file.mime,
      buffer: variant.buffer,
      width: variant.width,
      height: variant.height,
      size: kbytes(variant.buffer.length),
      sizeInBytes: variant.buffer.length,
      path: null,
    };
    await provider.upload(next);
    formats[variant.key] = {
      name: String(next.name),
      hash: String(next.hash),
      ext: file.ext,
      mime: file.mime ?? undefined,
      url: String(next.url),
      width: variant.width,
      height: variant.height,
      size: Number(next.size),
      sizeInBytes: variant.buffer.length,
      path: null,
    };
  }

  for (const key of plan.remove) {
    const stale = file.formats?.[key];
    if (!stale) continue;
    await provider.delete(stale);
  }

  await strapi.db.query("plugin::upload.file").update({
    where: { id: file.id },
    data: {
      formats,
      blurDataURL: variants.blurDataURL,
    },
  });
}

/** Loads every upload, then applies {@link planUploadRewrite}. */
export async function rewriteUploads(strapi: RewriteStrapi): Promise<void> {
  const files = await strapi.db.query("plugin::upload.file").findMany();
  for (const file of files) {
    const plan = planUploadRewrite(file);
    if (plan.action === "skip") {
      strapi.log.info(`skip ${file.url ?? file.id} (${plan.reason})`);
      continue;
    }
    try {
      await rewriteOne(strapi, file);
      strapi.log.info(`rewrote ${file.url ?? file.id}`);
    } catch (error) {
      strapi.log.error(`rewrite failed for ${file.url ?? file.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
