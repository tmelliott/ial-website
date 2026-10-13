import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { socialExcerpt, socialMetaTags, type SocialMetaInput, type SocialMetaTag } from "./socialMeta.ts";

const origin = "https://inzight.example";

const base: SocialMetaInput = {
  title: "Page title",
  description: "Page description",
  pathname: "/about",
  origin,
};

function tags(overrides: Partial<SocialMetaInput> = {}): SocialMetaTag[] {
  return socialMetaTags({ ...base, ...overrides });
}

function content(list: SocialMetaTag[], key: string): string | undefined {
  return list.find((tag) => tag.property === key || tag.name === key)?.content;
}

describe("socialMetaTags", () => {
  it("includes the required Open Graph and Twitter tags", () => {
    const list = tags();
    for (const key of [
      "og:title",
      "og:description",
      "og:type",
      "og:url",
      "og:site_name",
      "twitter:card",
      "twitter:title",
      "twitter:description",
    ]) {
      assert.equal(typeof content(list, key), "string", key);
    }
    assert.equal(content(list, "og:title"), "Page title");
    assert.equal(content(list, "og:description"), "Page description");
    assert.equal(content(list, "twitter:title"), "Page title");
    assert.equal(content(list, "twitter:description"), "Page description");
    assert.equal(content(list, "og:site_name"), "iNZight Analytics Ltd");
    assert.equal(content(list, "og:url"), "https://inzight.example/about");
  });

  it("defaults og:type to website and accepts article", () => {
    assert.equal(content(tags(), "og:type"), "website");
    assert.equal(content(tags({ type: "website" }), "og:type"), "website");
    assert.equal(content(tags({ type: "article" }), "og:type"), "article");
  });

  it("drops the query string from og:url", () => {
    const list = tags({ pathname: "/news/story?utm=1#section" });
    assert.equal(content(list, "og:url"), "https://inzight.example/news/story");
    const rooted = socialMetaTags({
      title: "Home",
      description: "Home description",
      pathname: "/",
      origin: "https://inzight.example/",
    });
    assert.equal(content(rooted, "og:url"), "https://inzight.example/");
  });

  it("omits image tags for relative and http URLs and uses a summary card", () => {
    for (const image of ["/media/photo.jpg", "http://cdn.example/photo.jpg", "", null, undefined]) {
      const list = tags({ image });
      assert.equal(content(list, "og:image"), undefined);
      assert.equal(content(list, "og:image:alt"), undefined);
      assert.equal(content(list, "twitter:image"), undefined);
      assert.equal(content(list, "twitter:card"), "summary");
    }
  });

  it("keeps an https image and defaults og:image:alt to the title", () => {
    const image = "https://blob.example/photo.jpg";
    const list = tags({ image });
    assert.equal(content(list, "og:image"), image);
    assert.equal(content(list, "twitter:image"), image);
    assert.equal(content(list, "og:image:alt"), "Page title");
    assert.equal(content(list, "twitter:card"), "summary_large_image");
  });

  it("uses a provided image alt", () => {
    const list = tags({
      image: "https://blob.example/photo.jpg",
      imageAlt: "Story title",
    });
    assert.equal(content(list, "og:image:alt"), "Story title");
  });

  it("falls through an invalid page image to the general image, then the logo", () => {
    const general = "https://blob.example/general.jpg";
    const logo = "https://blob.example/logo.jpg";
    const fromGeneral = tags({
      image: "http://cdn.example/page.jpg",
      fallbackImage: general,
      logo,
    });
    assert.equal(content(fromGeneral, "og:image"), general);

    const fromLogo = tags({
      image: "/relative.jpg",
      fallbackImage: "http://cdn.example/general.jpg",
      logo,
    });
    assert.equal(content(fromLogo, "og:image"), logo);
    assert.equal(content(fromLogo, "twitter:card"), "summary_large_image");

    const none = tags({
      image: "not-a-url",
      fallbackImage: 12 as unknown as string,
      logo: "http://blob.example/logo.jpg",
    });
    assert.equal(content(none, "og:image"), undefined);
    assert.equal(content(none, "twitter:card"), "summary");
  });

  it("prefers a specific https image over the general image and logo", () => {
    const list = tags({
      image: "https://blob.example/page.jpg",
      fallbackImage: "https://blob.example/general.jpg",
      logo: "https://blob.example/logo.jpg",
    });
    assert.equal(content(list, "og:image"), "https://blob.example/page.jpg");
  });

  it("strips HTML from descriptions without truncating stored copy", () => {
    const plain = `${"Word ".repeat(40)}end`;
    assert.ok(plain.length > 160);
    const stored = tags({ description: plain });
    assert.equal(content(stored, "og:description"), plain);
    assert.equal(content(stored, "twitter:description"), plain);

    const marked = tags({ description: "<p>Learn <em>more</em></p> about us" });
    assert.equal(content(marked, "og:description"), "Learn more about us");
  });

  it("leaves title text unchanged, including special characters", () => {
    const title = `iNZight & "Analytics" <Ltd>`;
    const list = tags({ title });
    assert.equal(content(list, "og:title"), title);
    assert.equal(content(list, "twitter:title"), title);
  });
});

describe("socialExcerpt", () => {
  it("cuts rich-text excerpts at 160 characters", () => {
    const source = "a".repeat(161);
    assert.equal(socialExcerpt(source).length, 160);
    assert.equal(socialExcerpt(source), "a".repeat(160));
    assert.equal(socialExcerpt("short"), "short");
    assert.equal(socialExcerpt(""), "");
  });

  it("strips HTML tags before cutting", () => {
    const source = `<p>${"b".repeat(200)}</p>`;
    assert.equal(socialExcerpt(source), "b".repeat(160));
    assert.equal(socialExcerpt("<p>Hello <strong>there</strong></p>"), "Hello there");
  });

  it("returns an empty string for null, undefined, and non-strings", () => {
    assert.equal(socialExcerpt(null), "");
    assert.equal(socialExcerpt(undefined), "");
    assert.equal(socialExcerpt(0), "");
  });
});
