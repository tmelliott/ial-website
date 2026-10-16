import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPlaceholder } from "./placeholder.ts";

describe("getPlaceholder", () => {
  it("returns the stored blur and does not fetch", async () => {
    const blur = "data:image/webp;base64,aaaa";
    let fetched = false;
    const original = globalThis.fetch;
    globalThis.fetch = (async () => {
      fetched = true;
      throw new Error("fetch should not run");
    }) as typeof fetch;

    try {
      assert.equal(await getPlaceholder({ blurDataURL: blur, url: "https://example.test/photo.jpg" }), blur);
      assert.equal(await getPlaceholder(null), undefined);
      assert.equal(await getPlaceholder(undefined), undefined);
      assert.equal(await getPlaceholder({ url: "https://example.test/photo.jpg" }), undefined);
      assert.equal(await getPlaceholder(""), undefined);
      assert.equal(fetched, false);
    } finally {
      globalThis.fetch = original;
    }
  });
});
