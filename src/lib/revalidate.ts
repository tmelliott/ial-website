import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "./payload-cache";

/**
 * Helper functions for revalidating specific content types
 * These can be called directly from Payload hooks since they run in the same Next.js process
 */
export const revalidate = {
  project: (slug: string) => {
    revalidateTag(CACHE_TAGS.projects);
    revalidateTag(CACHE_TAGS.project(slug));
    revalidateTag(CACHE_TAGS.home);
  },
  news: (slug: string) => {
    revalidateTag(CACHE_TAGS.news);
    revalidateTag(CACHE_TAGS.newsItem(slug));
    revalidateTag(CACHE_TAGS.home);
  },
  team: (slug: string) => {
    revalidateTag(CACHE_TAGS.team);
    revalidateTag(CACHE_TAGS.teamMember(slug));
    revalidateTag(CACHE_TAGS.home);
  },
  app: (slug: string) => {
    revalidateTag(CACHE_TAGS.apps);
    revalidateTag(CACHE_TAGS.app(slug));
    revalidateTag(CACHE_TAGS.home);
  },
  keyword: (slug: string) => {
    revalidateTag(CACHE_TAGS.keywords);
    revalidateTag(CACHE_TAGS.keyword(slug));
  },
  global: (slug: keyof typeof CACHE_TAGS.globals) => {
    revalidateTag(CACHE_TAGS.globals[slug]);
    revalidateTag(CACHE_TAGS.home);
  },
};
