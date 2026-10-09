import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPlaiceholder } from "plaiceholder";

const cache = new Map<string, string | undefined>();

/** Matches the `thumbnail` size in the images collection: 400×300. */
const THUMBNAIL_SUFFIX = "-400x300";

/**
 * Payload names resized files `{base}-{width}x{height}.ext`.
 * A 5px blur does not need the display file, so use the thumbnail.
 */
function thumbnailUrl(src: string): string | undefined {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:" || !url.pathname.includes("/api/images/file/")) {
    return undefined;
  }

  const file = url.pathname.split("/").pop();
  if (!file) return undefined;
  const dot = file.lastIndexOf(".");
  if (dot <= 0) return undefined;

  const ext = file.slice(dot);
  const base = file.slice(0, dot).replace(/-\d+x\d+$/, "");
  const thumb = `${base}${THUMBNAIL_SUFFIX}${ext}`;
  if (thumb === file) return src;

  url.pathname = url.pathname.slice(0, -file.length) + thumb;
  return url.toString();
}

async function imageBuffer(src: string): Promise<Buffer | undefined> {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    const response = await fetch(src, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return undefined;
    return Buffer.from(await response.arrayBuffer());
  }

  if (src.startsWith("/")) {
    return readFile(path.join(process.cwd(), "public", decodeURIComponent(src)));
  }

  return undefined;
}

/** Same 5px base64 placeholder the Next site generates with plaiceholder. */
export async function getPlaceholder(
  src: string | null | undefined,
): Promise<string | undefined> {
  if (!src) return undefined;
  if (cache.has(src)) return cache.get(src);

  const thumb = thumbnailUrl(src);
  if (thumb && cache.has(thumb)) {
    const cached = cache.get(thumb);
    cache.set(src, cached);
    return cached;
  }

  try {
    const source = thumb ?? src;
    const buffer = (await imageBuffer(source)) ?? (source === src ? undefined : await imageBuffer(src));
    if (!buffer) {
      cache.set(src, undefined);
      return undefined;
    }
    const { base64 } = await getPlaiceholder(buffer, { size: 5 });
    cache.set(src, base64);
    if (thumb) cache.set(thumb, base64);
    return base64;
  } catch {
    cache.set(src, undefined);
    return undefined;
  }
}
