const KIND_TAG: Record<string, string> = {
  project: "project",
  news: "news",
  "team-member": "team",
  keyword: "keyword",
  app: "app",
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

const LIST_TAG: Record<string, string> = {
  projects: "list:projects",
  news: "list:news",
  team: "list:team",
  keywords: "list:keywords",
  apps: "list:apps",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMediaFile(value: Record<string, unknown>): boolean {
  return typeof value.url === "string" && ("mime" in value || "widths" in value || "formats" in value || "blurDataURL" in value);
}

function walk(value: unknown, hint: string | undefined, tags: Set<string>) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, hint, tags);
    return;
  }
  if (!isRecord(value) || isMediaFile(value)) return;

  const prefix = hint ? KIND_TAG[hint] : undefined;
  if (prefix && typeof value.documentId === "string" && value.documentId) {
    tags.add(`${prefix}:${value.documentId}`);
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === "docs") {
      walk(child, hint, tags);
      continue;
    }
    const childHint = FIELD_KIND[key];
    if (childHint) walk(child, childHint, tags);
  }
}

/** Document tags for a value and the relations the Strapi client already walks. */
export function contentTags(value: unknown, hint?: string): string[] {
  const tags = new Set<string>();
  walk(value, hint, tags);
  return [...tags];
}

export function listTag(collection: string): string | undefined {
  return LIST_TAG[collection];
}

/** Index queries have no slug lookup and no id list. */
export function isIndexQuery(params: Record<string, string | undefined>): boolean {
  return !Object.keys(params).some(
    (key) => key === "where[slug][equals]" || key.startsWith("where[id][in]"),
  );
}

/** Index results and empty lookups share the list tag, so creating a document can drop a cached 404. */
export function includeListTag(params: Record<string, string | undefined>, count: number): boolean {
  return count === 0 || isIndexQuery(params);
}

export function singleTag(slug: string): string[] {
  return [slug];
}

export const YEAR_SECONDS = 60 * 60 * 24 * 365;
