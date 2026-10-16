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
