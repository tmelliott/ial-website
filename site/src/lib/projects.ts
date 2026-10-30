import type { LexicalData, Media } from "./payload";

export type DatedProject = {
  priority?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
};

export type ProjectKeyword = {
  id: number;
  title: string;
  slug: string;
};

export type ProjectImage = {
  id?: number;
  url?: string | null;
  alt?: string | null;
  description?: string | null;
  sizes?: {
    square?: { url?: string | null } | null;
    card?: { url?: string | null } | null;
    thumbnail?: { url?: string | null } | null;
    tablet?: { url?: string | null } | null;
  } | null;
};

export type ProjectPerson = {
  id: number;
  slug: string;
  name: { first: string; last: string };
  photo?: number | ProjectImage | null;
};

export type ProjectContributor = {
  blockType: string;
  id?: string | null;
  contributorType?: "teamMember" | "nameAndUrl" | null;
  teamMember?: number | ProjectPerson | null;
  name?: string | null;
  url?: string | null;
  role?: string | null;
};

export type ProjectLink = {
  id?: string | null;
  link: string;
  description?: string | null;
};

export type ProjectLinkGroup = {
  id?: string | null;
  label?: string | null;
  featured?: boolean | null;
  groupLinks?: ProjectLink[] | null;
};

export type ProjectDoc = DatedProject & {
  id: number;
  title: string;
  slug: string;
  content?: LexicalData | null;
  banner?: number | ProjectImage | null;
  files?: (number | Media)[] | null;
  keywords?: (number | ProjectKeyword)[] | null;
  team?: (number | ProjectPerson)[] | null;
  team2?: ProjectContributor[] | null;
  linkGroups?: ProjectLinkGroup[] | null;
};

export const PROJECTS_PER_PAGE = 7;

export function sortProjects<T extends DatedProject>(projects: T[]): T[] {
  return [...projects].sort((a, b) => {
    if ((a.priority ?? 0) !== (b.priority ?? 0)) {
      return (b.priority ?? 0) - (a.priority ?? 0);
    }

    const aHasNoDates = !a.startDate && !a.endDate;
    const bHasNoDates = !b.startDate && !b.endDate;
    if (aHasNoDates !== bHasNoDates) return aHasNoDates ? 1 : -1;
    if (aHasNoDates && bHasNoDates) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    const aHasStartNoEnd = Boolean(a.startDate && !a.endDate);
    const bHasStartNoEnd = Boolean(b.startDate && !b.endDate);
    if (aHasStartNoEnd !== bHasStartNoEnd) return aHasStartNoEnd ? -1 : 1;

    if (a.endDate && b.endDate && a.endDate !== b.endDate) {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    }
    if (a.startDate && b.startDate && a.startDate !== b.startDate) {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function projectPageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PROJECTS_PER_PAGE));
}

export function projectKeywords(
  keywords: (number | ProjectKeyword)[] | null | undefined,
): ProjectKeyword[] {
  const seen = new Set<string>();
  const links: ProjectKeyword[] = [];
  for (const keyword of keywords ?? []) {
    if (typeof keyword === "number" || !keyword.slug || !keyword.title) continue;
    if (seen.has(keyword.slug)) continue;
    seen.add(keyword.slug);
    links.push({ id: keyword.id, title: keyword.title, slug: keyword.slug });
  }
  return links;
}

/** Keywords that appear on at least one project, in title order. */
export function keywordsWithProjects(
  projects: { keywords?: (number | ProjectKeyword)[] | null }[],
): ProjectKeyword[] {
  const seen = new Set<string>();
  const collected: ProjectKeyword[] = [];
  for (const project of projects) {
    for (const keyword of projectKeywords(project.keywords)) {
      if (seen.has(keyword.slug)) continue;
      seen.add(keyword.slug);
      collected.push(keyword);
    }
  }
  return collected.sort((a, b) => a.title.localeCompare(b.title, "en"));
}

export function findProjectKeyword(
  projects: { keywords?: (number | ProjectKeyword)[] | null }[],
  slug: string | null,
): ProjectKeyword | null {
  if (!slug) return null;
  for (const project of projects) {
    const match = projectKeywords(project.keywords).find((keyword) => keyword.slug === slug);
    if (match) return match;
  }
  return null;
}

export function filterProjectsByKeyword<
  T extends { keywords?: (number | ProjectKeyword)[] | null },
>(projects: T[], keyword: string | null): T[] {
  if (!keyword) return projects;
  return projects.filter((project) =>
    projectKeywords(project.keywords).some((item) => item.slug === keyword),
  );
}

export function visibleProjectPage(page: number, total: number): number {
  const pages = projectPageCount(total);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(Math.floor(page), pages);
}

export function projectsForPage<T>(projects: T[], page: number): T[] {
  const current = visibleProjectPage(page, projects.length);
  const start = (current - 1) * PROJECTS_PER_PAGE;
  return projects.slice(start, start + PROJECTS_PER_PAGE);
}

export function projectsListHref(keyword: string | null, page: number): string {
  const params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/projects?${query}` : "/projects";
}

export function readProjectsListQuery(search: string | URLSearchParams): {
  keyword: string | null;
  page: number;
} {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const rawKeyword = params.get("keyword")?.trim() ?? "";
  const rawPage = params.get("page");
  return {
    keyword: rawKeyword.length > 0 ? rawKeyword : null,
    page: rawPage && /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : 1,
  };
}

export function projectListSummary(
  total: number,
  page: number,
  keywordTitle?: string | null,
): string {
  if (total === 0) {
    return keywordTitle ? `No projects tagged ${keywordTitle}` : "No projects yet";
  }
  const current = visibleProjectPage(page, total);
  const start = (current - 1) * PROJECTS_PER_PAGE + 1;
  const end = Math.min(total, current * PROJECTS_PER_PAGE);
  const range =
    total === 1
      ? "Showing 1 project"
      : start === end
        ? `Showing project ${start} of ${total}`
        : `Showing ${start}–${end} of ${total} projects`;
  return keywordTitle ? `${range} tagged ${keywordTitle}` : range;
}

/** Label for a project file. Prefers the editor title, then the stored filename. */
export function projectFileLabel(file: Media): string {
  const title = file.alt?.trim();
  if (title) return title;
  const name = file.name?.trim();
  if (name) return name;
  return "Download";
}

/** "PDF · 240 KB" from the extension and Strapi's kilobyte size. */
export function projectFileMeta(file: Media): string | null {
  const parts: string[] = [];
  const ext = file.ext?.replace(/^\./, "").trim();
  if (ext) parts.push(ext.toUpperCase());
  if (typeof file.size === "number" && file.size > 0) {
    parts.push(file.size < 1024 ? `${Math.max(1, Math.round(file.size))} KB` : `${(file.size / 1024).toFixed(1)} MB`);
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}
