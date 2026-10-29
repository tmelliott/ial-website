import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { postPurge, purgeTags } from "./purgeTags";

const TAG = /^[a-zA-Z][a-zA-Z0-9:-]{0,63}$/;

function tags(event: Parameters<typeof purgeTags>[0]): string[] {
  const result = purgeTags(event);
  for (const tag of result) assert.match(tag, TAG);
  return result;
}

describe("purgeTags", () => {
  it("purges only the document tag when a public project is updated", () => {
    assert.deepEqual(
      tags({
        uid: "api::project.project",
        action: "update",
        documentId: "p1",
        status: "published",
        hadPublished: true,
      }),
      ["project:p1"],
    );
  });

  it("purges the document and list tags when a public type is created", () => {
    assert.deepEqual(
      tags({ uid: "api::team-member.team-member", action: "create", documentId: "t1" }).sort(),
      ["list:team", "team:t1"],
    );
    assert.deepEqual(
      tags({ uid: "api::keyword.keyword", action: "create", documentId: "k1" }).sort(),
      ["keyword:k1", "list:keywords"],
    );
    assert.deepEqual(
      tags({ uid: "api::app.app", action: "create", documentId: "a1", status: "published" }).sort(),
      ["app:a1", "list:apps"],
    );
  });

  it("does not purge a draft create or draft update", () => {
    for (const uid of ["api::news-item.news-item", "api::app.app", "api::project.project"]) {
      assert.deepEqual(tags({ uid, action: "create", documentId: "d1", status: "draft" }), []);
      assert.deepEqual(tags({ uid, action: "update", documentId: "d1", status: "draft" }), []);
    }
  });

  it("purges only the document when a news title is republished", () => {
    assert.deepEqual(
      tags({
        uid: "api::news-item.news-item",
        action: "publish",
        documentId: "n1",
        hadPublished: true,
      }),
      ["news:n1"],
    );
  });

  it("purges the document and list:news on the first publish", () => {
    assert.deepEqual(
      tags({
        uid: "api::news-item.news-item",
        action: "publish",
        documentId: "n1",
        hadPublished: false,
      }).sort(),
      ["list:news", "news:n1"],
    );
  });

  it("purges the document and list tag on unpublish and on deleting a public document", () => {
    assert.deepEqual(
      tags({ uid: "api::news-item.news-item", action: "unpublish", documentId: "n1" }).sort(),
      ["list:news", "news:n1"],
    );
    assert.deepEqual(
      tags({
        uid: "api::project.project",
        action: "delete",
        documentId: "p1",
        hadPublished: true,
      }).sort(),
      ["list:projects", "project:p1"],
    );
    assert.deepEqual(
      tags({
        uid: "api::news-item.news-item",
        action: "delete",
        documentId: "n1",
        hadPublished: true,
      }).sort(),
      ["list:news", "news:n1"],
    );
  });

  it("does not add the list tag when deleting a never-published draft", () => {
    for (const [uid, documentTag] of [
      ["api::news-item.news-item", "news:n1"],
      ["api::app.app", "app:a1"],
      ["api::project.project", "project:p1"],
    ] as const) {
      const result = tags({
        uid,
        action: "delete",
        documentId: documentTag.split(":")[1],
        hadPublished: false,
        status: "draft",
      });
      assert.equal(result.some((tag) => tag.startsWith("list:")), false);
      assert.deepEqual(result, [documentTag]);
    }
  });

  it("purges a single by its slug and never adds a list tag", () => {
    for (const [uid, slug] of [
      ["api::general.general", "general"],
      ["api::home-hero.home-hero", "homeHero"],
      ["api::home-projects.home-projects", "homeProjects"],
      ["api::home-team.home-team", "homeTeam"],
      ["api::home-collaborators.home-collaborators", "homeCollaborators"],
      ["api::home-apps.home-apps", "homeApps"],
      ["api::home-news.home-news", "homeNews"],
      ["api::about.about", "about"],
      ["api::projects-page.projects-page", "projectsPage"],
      ["api::news-page.news-page", "newsPage"],
      ["api::apps-page.apps-page", "appsPage"],
    ] as const) {
      assert.deepEqual(tags({ uid, action: "update", documentId: "single" }), [slug]);
    }
  });
});

describe("postPurge", () => {
  it("posts the tags body the site purge route accepts", async () => {
    let body = "";
    let authorization = "";
    await postPurge(["news:n1", "list:news"], {
      url: "http://site/api/purge",
      secret: "s3cret",
      fetch: async (_url, init) => {
        body = String(init?.body ?? "");
        authorization = new Headers(init?.headers).get("authorization") ?? "";
        return new Response(null, { status: 200 });
      },
    });
    assert.equal(authorization, "Bearer s3cret");
    assert.deepEqual(JSON.parse(body), { tags: ["news:n1", "list:news"] });
  });
});
