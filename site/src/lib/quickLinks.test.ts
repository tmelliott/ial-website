import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isExternalLink, liveQuickLinks, quickLinkSubtitle } from "./quickLinks.ts";

describe("quick links", () => {
  it("keeps a link through its expiry date and drops it the day after", () => {
    const links = [
      { title: "Polling Guide", url: "/projects/polls", tag: "Election 2026", expires: "2026-10-13" },
      { title: "Old guide", url: "/projects/old", expires: "2026-10-12" },
      { title: "iNZight", url: "https://inzight.nz" },
    ];
    const live = liveQuickLinks(links, "2026-10-13");
    assert.deepEqual(
      live.map((link) => link.title),
      ["Polling Guide", "iNZight"],
    );
  });

  it("uses a subtitle, otherwise the external hostname", () => {
    assert.equal(quickLinkSubtitle({ url: "https://www.inzight.nz/start", subtitle: "Free software" }), "Free software");
    assert.equal(quickLinkSubtitle({ url: "https://www.inzight.nz/start" }), "inzight.nz");
    assert.equal(quickLinkSubtitle({ url: "/projects/polls" }), null);
    assert.equal(isExternalLink("https://inzight.nz"), true);
    assert.equal(isExternalLink("/apps"), false);
  });
});
