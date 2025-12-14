import { unstable_cache } from "next/cache";
import { Payload } from "payload";
import config from "@payload-config";

/**
 * Cache tags for different content types
 */
export const CACHE_TAGS = {
  projects: "projects",
  project: (slug: string) => `project-${slug}`,
  projectId: (id: number) => `project-id-${id}`,
  news: "news",
  newsItem: (slug: string) => `news-${slug}`,
  newsId: (id: number) => `news-id-${id}`,
  team: "team",
  teamMember: (slug: string) => `team-${slug}`,
  teamId: (id: number) => `team-id-${id}`,
  apps: "apps",
  app: (slug: string) => `app-${slug}`,
  appId: (id: number) => `app-id-${id}`,
  keywords: "keywords",
  keyword: (slug: string) => `keyword-${slug}`,
  keywordId: (id: number) => `keyword-id-${id}`,
  globals: {
    general: "global-general",
    homeHero: "global-homeHero",
    homeProjects: "global-homeProjects",
    homeTeam: "global-homeTeam",
    homeCollaborators: "global-homeCollaborators",
    homeApps: "global-homeApps",
    homeNews: "global-homeNews",
    about: "global-about",
    projectsPage: "global-projectsPage",
    newsPage: "global-newsPage",
    appsPage: "global-appsPage",
  },
  home: "home",
} as const;

/**
 * Helper to create a cached Payload query function
 */
export function createCachedQuery<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  tags: string[],
  revalidate?: number
): T {
  return unstable_cache(
    fn,
    keyParts,
    {
      tags,
      ...(revalidate && { revalidate }),
    }
  ) as T;
}

/**
 * Get Payload instance (cached)
 */
export async function getCachedPayload(): Promise<Payload> {
  const { getPayload } = await import("payload");
  return getPayload({ config });
}
