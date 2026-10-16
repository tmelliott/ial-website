import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { imageFit, responsiveImage } from "./cdnImage.ts";

const stored = {
  url: "http://localhost:1337/uploads/photo.jpg",
  mime: "image/jpeg",
  widths: [160, 320, 480, 640, 960, 1280, 1920].map((width) => ({
    width,
    url: `http://localhost:1337/uploads/w${width}_photo.jpg`,
  })),
};

function srcsetWidths(srcset: string | undefined): number[] {
  if (!srcset) return [];
  return srcset.split(", ").map((part) => Number(part.trim().split(" ").at(-1)?.replace("w", "")));
}

describe("imageFit", () => {
  it("keeps sizes strings and uses the shared width set", () => {
    assert.deepEqual(imageFit.banner.widths, [960, 1920]);
    assert.deepEqual(imageFit.card.widths, [640, 1280]);
    assert.deepEqual(imageFit.portrait.widths, [480, 960]);
    assert.deepEqual(imageFit.logo.widths, [160, 320]);
    assert.deepEqual(imageFit.brand.widths, [320, 640]);
    assert.deepEqual(imageFit.team.widths, [640, 1280]);
    assert.deepEqual(imageFit.overlay.widths, [480, 960]);
    assert.deepEqual(imageFit.avatar.widths, [160, 320]);
    assert.equal(imageFit.card.sizes, "(min-width: 768px) 560px, 100vw");
    assert.equal(imageFit.avatar.sizes, "48px");
  });
});

describe("responsiveImage", () => {
  it("uses the stored width files for the slot and falls back to the original", () => {
    const image = responsiveImage(stored, "card");
    assert.equal(image.src, stored.url);
    assert.equal(
      image.srcset,
      "http://localhost:1337/uploads/w640_photo.jpg 640w, http://localhost:1337/uploads/w1280_photo.jpg 1280w",
    );
    assert.equal(image.sizes, imageFit.card.sizes);
    assert.equal(JSON.stringify(image).includes("/.netlify/images"), false);
  });

  it("omits stored widths the slot asks for but the file does not have", () => {
    const image = responsiveImage(
      {
        ...stored,
        widths: stored.widths.filter((item) => item.width !== 1280),
      },
      "card",
    );
    assert.equal(image.src, stored.url);
    assert.deepEqual(srcsetWidths(image.srcset), [640]);
  });

  it("returns a single src for SVG", () => {
    const image = responsiveImage(
      {
        url: "http://localhost:1337/uploads/logo.svg",
        mime: "image/svg+xml",
        widths: stored.widths,
      },
      "logo",
    );
    assert.deepEqual(image, { src: "http://localhost:1337/uploads/logo.svg" });
    assert.equal(JSON.stringify(image).includes("/.netlify/images"), false);
  });

  it("returns a single src when a slot has no matching width files", () => {
    const image = responsiveImage(
      { url: stored.url, mime: "image/jpeg", widths: [{ width: 160, url: "http://localhost:1337/uploads/w160_photo.jpg" }] },
      "banner",
    );
    assert.equal(image.src, stored.url);
    assert.equal(image.srcset, undefined);
  });
});
