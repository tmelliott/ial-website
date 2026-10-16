import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AstroCache } from "../../node_modules/astro/dist/core/cache/runtime/cache.js";
import { contentTags, isIndexQuery, listTag, singleTag } from "./cacheTags.ts";
import { runWithRequestCache, tagRequest } from "./requestCache.ts";

describe("content tags", () => {
  it("tags a document id and adds the list tag only for an index query", () => {
    const project = { documentId: "proj1", title: "One" };
    assert.deepEqual(contentTags(project, "project"), ["project:proj1"]);
    assert.equal(isIndexQuery({}), true);
    assert.equal(isIndexQuery({ limit: "10", sort: "-date" }), true);
    assert.equal(listTag("projects"), "list:projects");
    assert.equal(listTag("news"), "list:news");
    assert.equal(listTag("team"), "list:team");
    assert.equal(listTag("keywords"), "list:keywords");
    assert.equal(listTag("apps"), "list:apps");
  });

  it("does not add a list tag for slug or id lookups", () => {
    assert.equal(isIndexQuery({ "where[slug][equals]": "ada" }), false);
    assert.equal(isIndexQuery({ "where[id][in][0]": "4", "where[id][in][1]": "9" }), false);
    assert.equal(isIndexQuery({ "where[slug][not_equals]": "ada" }), true);
  });

  it("tags nested relations and skips media files", () => {
    const tags = contentTags(
      {
        documentId: "kw1",
        projects: {
          docs: [{ documentId: "proj9", banner: { url: "/a.jpg", mime: "image/jpeg", documentId: "file1" } }],
        },
        news: { docs: [{ documentId: "news2" }] },
      },
      "keyword",
    );
    assert.deepEqual(tags.sort(), ["keyword:kw1", "news:news2", "project:proj9"]);
  });

  it("uses the single slug and never a list tag", () => {
    assert.deepEqual(singleTag("general"), ["general"]);
    assert.deepEqual(singleTag("homeHero"), ["homeHero"]);
    assert.equal(singleTag("about").some((tag) => tag.startsWith("list:")), false);
  });
});

describe("cache.set merge", () => {
  it("keeps an earlier maxAge when a later set only adds tags", () => {
    const cache = new AstroCache(null);
    cache.set({ maxAge: 31_536_000 });
    cache.set({ tags: ["project:proj1"] });
    assert.equal(cache.options.maxAge, 31_536_000);
    assert.deepEqual(cache.tags, ["project:proj1"]);

    const seen: unknown[] = [];
    const requestCache = {
      enabled: true,
      set(value: { tags?: string[]; maxAge?: number } | false) {
        seen.push(value);
        cache.set(value);
      },
    };
    runWithRequestCache(requestCache, () => {
      tagRequest(["news:story"]);
    });
    assert.deepEqual(seen, [{ tags: ["news:story"] }]);
    assert.equal(cache.options.maxAge, 31_536_000);
    assert.deepEqual(cache.tags.sort(), ["news:story", "project:proj1"]);
  });
});
