import { revalidatePath } from "next/cache";

const PURGE_DEBOUNCE_MS = 20_000;

let purgeTimer: ReturnType<typeof setTimeout> | undefined;
const pendingTags = new Set<string>();

type StatusDoc = {
  _status?: string | null;
};

type RefreshArgs = {
  doc?: StatusDoc;
  previousDoc?: StatusDoc;
  collection?: { slug?: string };
  global?: { slug?: string };
};

/**
 * Tags match the public site's route rules. Purging a tag drops every cached
 * page that displays that content; the next visit renders it again.
 */
const TAGS_BY_SLUG: Record<string, string[]> = {
  projects: ["projects"],
  news: ["news"],
  team: ["team"],
  keywords: ["keywords", "projects"],
  apps: ["apps"],
  general: ["global:general"],
  homeHero: ["homeHero"],
  homeProjects: ["homeProjects"],
  homeTeam: ["homeTeam"],
  homeCollaborators: ["homeCollaborators"],
  homeApps: ["homeApps"],
  homeNews: ["homeNews"],
  about: ["about"],
  projectsPage: ["projects"],
  newsPage: ["news"],
  appsPage: ["apps"],
};

/**
 * Bust the local Next cache, and on the admin pod schedule one purge of the
 * public Netlify cache. Draft saves are ignored until a document is published
 * or unpublished.
 *
 * Requires SITE_PURGE_URL (the public site's /api/purge) and PURGE_SECRET.
 */
export default function refreshSite(args?: RefreshArgs) {
  const status = args?.doc?._status;
  const previous = args?.previousDoc?._status;
  if (status === "draft" && previous !== "published") return;

  try {
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("revalidatePath failed", error);
  }

  const slug = args?.collection?.slug ?? args?.global?.slug;
  if (!slug) return;
  schedulePurge(TAGS_BY_SLUG[slug] ?? []);
}

function schedulePurge(tags: string[]) {
  const purgeUrl = process.env.SITE_PURGE_URL;
  const secret = process.env.PURGE_SECRET;
  if (process.env.ADMIN_ONLY !== "true" || !purgeUrl || !secret || tags.length === 0) {
    return;
  }

  for (const tag of tags) pendingTags.add(tag);
  if (purgeTimer) clearTimeout(purgeTimer);
  purgeTimer = setTimeout(() => {
    purgeTimer = undefined;
    const body = JSON.stringify({ tags: [...pendingTags] });
    pendingTags.clear();
    void fetch(purgeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body,
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`Site purge failed: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Site purge failed", error);
      });
  }, PURGE_DEBOUNCE_MS);
}
