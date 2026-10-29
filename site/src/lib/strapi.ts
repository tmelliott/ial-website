import { STRAPI_API_TOKEN, STRAPI_INTERNAL_URL, STRAPI_URL } from "astro:env/server";
import { contentTags, includeListTag, listTag, singleTag } from "./cacheTags";
import { tagRequest } from "./requestCache";

const BLOCK_TYPES = new Set(["paragraph", "heading", "list", "quote", "code", "image"]);

const COLLECTION_PATH: Record<string, string> = {
  news: "/api/news",
  projects: "/api/projects",
  team: "/api/team",
  apps: "/api/apps",
  keywords: "/api/keywords",
};

const GLOBAL_PATH: Record<string, string> = {
  general: "/api/general",
  homeHero: "/api/home-hero",
  homeProjects: "/api/home-projects",
  homeTeam: "/api/home-team",
  homeCollaborators: "/api/home-collaborators",
  homeApps: "/api/home-apps",
  homeNews: "/api/home-news",
  about: "/api/about",
  projectsPage: "/api/projects-page",
  newsPage: "/api/news-page",
  appsPage: "/api/apps-page",
};

const FIELD_KIND: Record<string, string> = {
  projects: "project",
  news: "news",
  apps: "app",
  team: "team-member",
  featuredProjects: "project",
  featuredApps: "app",
  keywords: "keyword",
  workstreams: "keyword",
  teamMember: "team-member",
};

const JOINS: Record<string, string[]> = {
  keyword: ["projects", "news", "apps", "team"],
  "team-member": ["projects", "news"],
};

const POPULATE: Record<string, unknown> = {
  "/api/projects": {
    banner: true,
    files: true,
    keywords: true,
    linkGroups: { populate: { groupLinks: true } },
    team: { populate: { photo: true, name: true } },
    team2: { populate: { teamMember: { populate: { photo: true, name: true } } } },
  },
  "/api/news": {
    gallery: true,
    keywords: true,
    link: true,
    team: { populate: { photo: true, name: true } },
  },
  "/api/team": {
    photo: true,
    name: true,
    socialMedia: true,
    keywords: true,
    projects: { populate: { banner: true, keywords: true } },
    news: { populate: { gallery: true, keywords: true } },
  },
  "/api/apps": {
    banner: true,
    logo: true,
    keywords: true,
  },
  "/api/keywords": {
    linkGroups: { populate: { groupLinks: true } },
    projects: { populate: { banner: true, keywords: true } },
    news: { populate: { gallery: true, keywords: true } },
    apps: { populate: { banner: true, logo: true, keywords: true } },
    team: { populate: { photo: true, name: true } },
  },
  "/api/general": {
    logo: true,
    mainMenu: { populate: { submenu: true } },
    footerMenu: true,
    socialLinks: true,
    metadata: { populate: { image: true } },
  },
  "/api/home-hero": {
    titleGroup: true,
    heroGroup: { populate: { heroItems: true } },
  },
  "/api/home-projects": {
    cards: true,
    featuredApps: { populate: { banner: true, logo: true, keywords: true } },
    featuredProjects: { populate: { banner: true, keywords: true } },
  },
  "/api/home-team": { image: true },
  "/api/home-collaborators": {
    feature: true,
    collaborators: { populate: { image: true } },
    places: true,
  },
  "/api/home-apps": { apps: { populate: { logo: true } } },
  "/api/home-news": { card: true },
  "/api/about": {
    purpose: true,
    team: true,
    pillars: { populate: { image: true } },
    metadata: { populate: { image: true } },
  },
  "/api/projects-page": {
    workstreams: true,
    metadata: { populate: { image: true } },
  },
  "/api/news-page": { metadata: { populate: { image: true } } },
  "/api/apps-page": { metadata: { populate: { image: true } } },
};

type Query = Record<string, string>;

const DISPLAY_WIDTHS = [160, 320, 480, 640, 960, 1280, 1920];
const DEFAULT_STRAPI_ORIGIN = "http://localhost:1337";

function trimOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.replace(/\/$/, "");
}

/** Browser image URLs. */
function publicOrigin(): string {
  return trimOrigin(STRAPI_URL) ?? DEFAULT_STRAPI_ORIGIN;
}

/** Server-side Strapi fetches. Inside Compose this is the Strapi service; locally it matches the public URL. */
function internalOrigin(): string {
  return trimOrigin(STRAPI_INTERNAL_URL) ?? publicOrigin();
}

function absolute(url: unknown): string | null | undefined {
  if (typeof url !== "string" || !url) return url as null | undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${publicOrigin()}${url}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMedia(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && typeof value.url === "string" && ("mime" in value || "formats" in value || "hash" in value);
}

function isBlockList(value: unknown): value is Record<string, unknown>[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => isRecord(item) && typeof item.type === "string" && BLOCK_TYPES.has(item.type))
  );
}

function inlineToLexical(children: unknown): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  if (!Array.isArray(children)) return out;
  for (const child of children) {
    if (!isRecord(child)) continue;
    if (child.type === "link") {
      out.push({
        type: "link",
        fields: { linkType: "custom", url: child.url, newTab: false },
        children: inlineToLexical(child.children),
        direction: "ltr",
        format: "",
        indent: 0,
        version: 3,
      });
      continue;
    }
    if (child.type !== "text") continue;
    const parts = String(child.text ?? "").split("\n");
    parts.forEach((part, index) => {
      if (index > 0) out.push({ type: "linebreak", version: 1 });
      let format = 0;
      if (child.bold) format |= 1;
      if (child.italic) format |= 2;
      if (child.strikethrough) format |= 4;
      if (child.underline) format |= 8;
      if (child.code) format |= 16;
      out.push({
        type: "text",
        text: part,
        format,
        version: 1,
        mode: "normal",
        style: "",
        detail: 0,
      });
    });
  }
  return out;
}

function blocksToLexical(blocks: Record<string, unknown>[]) {
  const children: Record<string, unknown>[] = [];
  for (const block of blocks) {
    if (block.type === "code" && block.language === "hr") {
      children.push({ type: "horizontalrule", version: 1 });
      continue;
    }
    if (block.type === "heading") {
      children.push({
        type: "heading",
        tag: `h${block.level || 2}`,
        children: inlineToLexical(block.children),
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      });
      continue;
    }
    if (block.type === "list") {
      const ordered = block.format === "ordered";
      children.push({
        type: "list",
        listType: ordered ? "number" : "bullet",
        tag: ordered ? "ol" : "ul",
        start: 1,
        children: (Array.isArray(block.children) ? block.children : []).map((item) => ({
          type: "listitem",
          children: inlineToLexical(isRecord(item) ? item.children : []),
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
          value: 1,
        })),
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      });
      continue;
    }
    if (block.type === "paragraph" || block.type === "quote") {
      children.push({
        type: block.type === "quote" ? "quote" : "paragraph",
        children: inlineToLexical(block.children),
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      });
    }
  }
  return {
    root: { type: "root", children, direction: "ltr", format: "", indent: 0, version: 1 },
  };
}

function normalizeMedia(file: Record<string, unknown>) {
  const formats = isRecord(file.formats) ? file.formats : {};
  const widths = DISPLAY_WIDTHS.flatMap((width) => {
    const format = formats[`w${width}`];
    if (!isRecord(format) || typeof format.url !== "string") return [];
    const url = absolute(format.url);
    if (!url) return [];
    return [{ url, width: typeof format.width === "number" ? format.width : width }];
  });
  const focal = isRecord(file.focalPoint) ? file.focalPoint : null;
  return {
    id: file.id,
    url: absolute(file.url),
    alt: file.alternativeText ?? file.alt ?? null,
    description: file.caption ?? file.description ?? null,
    name: typeof file.name === "string" ? file.name : null,
    ext: typeof file.ext === "string" ? file.ext : null,
    size: typeof file.size === "number" ? file.size : null,
    mime: typeof file.mime === "string" ? file.mime : null,
    width: file.width ?? null,
    height: file.height ?? null,
    focalX: focal && typeof focal.x === "number" ? focal.x : null,
    focalY: focal && typeof focal.y === "number" ? focal.y : null,
    blurDataURL: typeof file.blurDataURL === "string" ? file.blurDataURL : null,
    widths,
  };
}

function normalizeValue(value: unknown, hint?: string): unknown {
  if (Array.isArray(value)) {
    if (isBlockList(value)) return blocksToLexical(value);
    return value.map((item) => normalizeValue(item));
  }
  if (isMedia(value)) return normalizeMedia(value);
  if (!isRecord(value)) return value;

  const result: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "team2" && Array.isArray(child)) {
      result.team2 = child.map((block) => {
        const source = isRecord(block) ? block : {};
        return {
          blockType: "Contributor",
          contributorType: source.contributorType,
          teamMember: source.teamMember ? normalizeValue(source.teamMember, "team-member") : null,
          name: source.name ?? null,
          url: source.url ?? null,
          role: source.role ?? null,
        };
      });
      continue;
    }
    const childHint = FIELD_KIND[key];
    if (Array.isArray(child) && !isBlockList(child)) {
      result[key] = child.map((item) => normalizeValue(item, childHint));
      continue;
    }
    result[key] = normalizeValue(child, childHint);
  }

  const joins = hint ? JOINS[hint] : undefined;
  if (joins) {
    for (const field of joins) {
      if (Array.isArray(result[field])) result[field] = { docs: result[field] };
    }
  }
  if (hint === "news" && isRecord(result.link)) {
    result.link = result.link.label ? [result.link] : [];
  }
  return result;
}

function appendPopulate(query: Query, populate: unknown, prefix = "populate") {
  if (populate === true) {
    query[prefix] = "true";
    return;
  }
  if (!isRecord(populate)) return;
  for (const [key, value] of Object.entries(populate)) {
    if (value === true) {
      query[`${prefix}[${key}]`] = "true";
    } else if (isRecord(value) && isRecord(value.populate)) {
      appendPopulate(query, value.populate, `${prefix}[${key}][populate]`);
    }
  }
}

function translate(params: Query): { query: Query; emailRequired: boolean; limit: number | null } {
  const query: Query = {};
  const limit = params.limit && params.limit !== "0" ? Number(params.limit) : null;
  query["pagination[pageSize]"] = String(limit ?? 100);
  query["pagination[page]"] = "1";
  query.status = params.status === "draft" ? "draft" : "published";
  if (params.sort) {
    const descending = params.sort.startsWith("-");
    const field = descending ? params.sort.slice(1) : params.sort;
    query.sort = `${field}:${descending ? "desc" : "asc"}`;
  }

  const groups = new Map<string, string[]>();
  let emailRequired = false;
  for (const [key, value] of Object.entries(params)) {
    const equals = key.match(/^where\[(.+)\]\[equals\]$/);
    if (equals && equals[1] !== "_status") {
      query[`filters[${equals[1]}][$eq]`] = value;
      continue;
    }
    const notEquals = key.match(/^where\[(.+)\]\[not_equals\]$/);
    if (notEquals) {
      if (notEquals[1] === "email" && value === "") {
        emailRequired = true;
        continue;
      }
      query[`filters[${notEquals[1]}][$ne]`] = value;
      continue;
    }
    const member = key.match(/^where\[(.+)\]\[in\]\[(\d+)\]$/);
    if (member) {
      const bucket = groups.get(member[1]) ?? [];
      bucket[Number(member[2])] = value;
      groups.set(member[1], bucket);
      continue;
    }
    const before = key.match(/^where\[(.+)\]\[less_than\]$/);
    if (before) query[`filters[${before[1]}][$lt]`] = value;
  }
  for (const [field, values] of groups) {
    values.filter((item) => item != null).forEach((item, index) => {
      query[`filters[${field}][$in][${index}]`] = item;
    });
  }
  return { query, emailRequired, limit };
}

async function strapiGet(pathname: string, query: Query): Promise<{ data: unknown; total: number }> {
  const url = new URL(pathname, `${internalOrigin()}/`);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  appendPopulate(query, POPULATE[pathname]);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);

  const headers: Record<string, string> = {};
  if (STRAPI_API_TOKEN) headers.authorization = `Bearer ${STRAPI_API_TOKEN}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Strapi request failed (${response.status}): ${url.pathname}${url.search}`);
  }
  const body = (await response.json()) as {
    data?: unknown;
    meta?: { pagination?: { total?: number } };
  };
  return { data: body.data ?? null, total: body.meta?.pagination?.total ?? 0 };
}

function kindFor(pathname: string): string | undefined {
  if (pathname === "/api/projects") return "project";
  if (pathname === "/api/news") return "news";
  if (pathname === "/api/team") return "team-member";
  if (pathname === "/api/apps") return "app";
  if (pathname === "/api/keywords") return "keyword";
  return undefined;
}

export async function findCollection<T>(collection: string, params: Query = {}): Promise<T[]> {
  const pathname = COLLECTION_PATH[collection];
  if (!pathname) throw new Error(`Unknown collection ${collection}`);
  const { query, emailRequired, limit } = translate(params);
  if (emailRequired || params["where[date][less_than]"]) {
    query["pagination[pageSize]"] = "100";
  }

  let rows: unknown[] = [];
  let page = 1;
  let pageCount = 1;
  do {
    query["pagination[page]"] = String(page);
    const result = await strapiGet(pathname, query);
    const batch = Array.isArray(result.data) ? result.data : [];
    rows.push(...batch);
    pageCount = Math.ceil(result.total / Number(query["pagination[pageSize]"] || 100)) || 1;
    page += 1;
    if (limit && !emailRequired && !params["where[date][less_than]"]) break;
  } while (page <= pageCount);

  if (params.status === "draft" && rows.length === 0) {
    return findCollection<T>(collection, { ...params, status: "published" });
  }

  let docs = rows.map((row) => normalizeValue(row, kindFor(pathname))) as T[];
  if (emailRequired) {
    docs = docs.filter((doc) => {
      const email = (doc as { email?: string | null }).email;
      return typeof email === "string" && email.length > 0;
    });
  }
  if (limit) docs = docs.slice(0, limit);
  const tags = docs.flatMap((doc) => contentTags(doc, kindFor(pathname)));
  if (includeListTag(params, docs.length)) {
    const list = listTag(collection);
    if (list) tags.push(list);
  }
  tagRequest(tags);
  return docs;
}

export async function findGlobal<T>(slug: string, _params: Query = {}): Promise<T> {
  const pathname = GLOBAL_PATH[slug];
  if (!pathname) throw new Error(`Unknown single type ${slug}`);
  const result = await strapiGet(pathname, { status: "published" });
  const doc = result.data ? (normalizeValue(result.data) as T) : ({} as T);
  tagRequest([...singleTag(slug), ...contentTags(doc)]);
  return doc;
}

export async function payloadJson<T>(path: string, params: Query = {}): Promise<T> {
  if (path === "/api/projects") {
    const result = await strapiGet("/api/projects", {
      "pagination[pageSize]": "1",
      "pagination[page]": "1",
      status: "published",
    });
    return { totalDocs: result.total } as T;
  }
  const docs = await findCollection(path.replace("/api/", ""), params);
  return { docs } as T;
}

export function previewStatus(url: URL, secret: string | undefined): "draft" | "published" | null {
  if (!secret || url.searchParams.get("preview") !== secret) return null;
  return url.searchParams.get("status") === "draft" ? "draft" : "published";
}
