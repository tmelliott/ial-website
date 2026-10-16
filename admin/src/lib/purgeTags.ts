type ContentSpec = {
  tag: string;
  list?: string;
  draftAndPublish?: boolean;
};

const CONTENT: Record<string, ContentSpec> = {
  "api::project.project": { tag: "project", list: "list:projects" },
  "api::news-item.news-item": { tag: "news", list: "list:news", draftAndPublish: true },
  "api::team-member.team-member": { tag: "team", list: "list:team" },
  "api::keyword.keyword": { tag: "keyword", list: "list:keywords" },
  "api::app.app": { tag: "app", list: "list:apps" },
  "api::general.general": { tag: "general" },
  "api::home-hero.home-hero": { tag: "homeHero" },
  "api::home-projects.home-projects": { tag: "homeProjects" },
  "api::home-team.home-team": { tag: "homeTeam" },
  "api::home-collaborators.home-collaborators": { tag: "homeCollaborators" },
  "api::home-apps.home-apps": { tag: "homeApps" },
  "api::home-news.home-news": { tag: "homeNews" },
  "api::about.about": { tag: "about" },
  "api::projects-page.projects-page": { tag: "projectsPage" },
  "api::news-page.news-page": { tag: "newsPage" },
  "api::apps-page.apps-page": { tag: "appsPage" },
};

const MUTATIONS = new Set(["create", "update", "delete", "publish", "unpublish"]);

export type PurgeEvent = {
  uid: string;
  action: string;
  documentId?: string | null;
  status?: string;
  hadPublished?: boolean;
};

function withList(documentTag: string, list?: string): string[] {
  return list ? [documentTag, list] : [documentTag];
}

/** Cache tags to purge after a Strapi document mutation. */
export function purgeTags(event: PurgeEvent): string[] {
  const spec = CONTENT[event.uid];
  if (!spec || !MUTATIONS.has(event.action)) return [];
  if (!spec.list) return [spec.tag];

  const documentId = event.documentId ?? "";
  if (!documentId) return [];
  const documentTag = `${spec.tag}:${documentId}`;
  const draft = spec.draftAndPublish === true;

  if (event.action === "create") {
    if (draft && event.status !== "published") return [];
    return withList(documentTag, spec.list);
  }

  if (event.action === "update") {
    if (draft && event.status !== "published") return [];
    if (draft && event.status === "published" && !event.hadPublished) {
      return withList(documentTag, spec.list);
    }
    return [documentTag];
  }

  if (event.action === "publish") {
    if (event.hadPublished) return [documentTag];
    return withList(documentTag, spec.list);
  }

  if (event.action === "unpublish") return withList(documentTag, spec.list);

  if (draft && !event.hadPublished) return [documentTag];
  return withList(documentTag, spec.list);
}

export async function postPurge(
  tags: string[],
  deps: {
    url?: string;
    secret?: string;
    fetch: (url: string, init?: RequestInit) => Promise<Response>;
  },
): Promise<void> {
  if (!deps.url || !deps.secret || tags.length === 0) return;
  const response = await deps.fetch(deps.url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${deps.secret}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ tags }),
  });
  if (!response.ok) {
    throw new Error(`Purge failed (${response.status})`);
  }
}
