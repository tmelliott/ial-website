import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { CACHE_TAGS } from "./payload-cache";
import type { Config } from "@payload-types";

/**
 * Cached Payload queries with proper cache tags
 * Use these helpers in your pages to ensure proper cache invalidation
 */

export async function getCachedProjectBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "projects",
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
      });
      return result.docs[0];
    },
    [`project-${slug}`],
    {
      tags: [CACHE_TAGS.projects, CACHE_TAGS.project(slug)],
    }
  )();
}

export async function getCachedProjects(options?: {
  limit?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where?: any;
  sort?: string;
}) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      return payload.find({
        collection: "projects",
        ...options,
      });
    },
    [`projects-${JSON.stringify(options)}`],
    {
      tags: [CACHE_TAGS.projects],
    }
  )();
}

export async function getCachedNewsBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "news",
        where: {
          slug: {
            equals: slug,
          },
          _status: {
            equals: "published",
          },
        },
        limit: 1,
      });
      return result.docs[0];
    },
    [`news-${slug}`],
    {
      tags: [CACHE_TAGS.news, CACHE_TAGS.newsItem(slug)],
    }
  )();
}

export async function getCachedNews(options?: {
  limit?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where?: any;
  sort?: string;
}) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      return payload.find({
        collection: "news",
        where: {
          _status: {
            equals: "published",
          },
          ...options?.where,
        },
        ...options,
      });
    },
    [`news-${JSON.stringify(options)}`],
    {
      tags: [CACHE_TAGS.news],
    }
  )();
}

export async function getCachedTeamMemberBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "team",
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
      });
      return result.docs[0];
    },
    [`team-${slug}`],
    {
      tags: [CACHE_TAGS.team, CACHE_TAGS.teamMember(slug)],
    }
  )();
}

export async function getCachedTeamMembers(options?: {
  limit?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where?: any;
  sort?: string;
}) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      return payload.find({
        collection: "team",
        ...options,
      });
    },
    [`team-${JSON.stringify(options)}`],
    {
      tags: [CACHE_TAGS.team],
    }
  )();
}

export async function getCachedGlobal(slug: keyof Config["globals"]) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      return payload.findGlobal({ slug });
    },
    [`global-${slug}`],
    {
      tags: [
        CACHE_TAGS.globals[slug as keyof typeof CACHE_TAGS.globals] ||
          `global-${slug}`,
      ],
    }
  )();
}

export async function getCachedKeywordBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "keywords",
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
      });
      return result.docs[0];
    },
    [`keyword-${slug}`],
    {
      tags: [CACHE_TAGS.keywords, CACHE_TAGS.keyword(slug)],
    }
  )();
}
