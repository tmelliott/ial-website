import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { planUploadRewrite } from "./rewriteUploads";
import { uploadBreakpoints } from "./imageVariants";

const widthFormats = Object.fromEntries(
  Object.entries(uploadBreakpoints).map(([key, width]) => [
    key,
    { url: `/uploads/${key}_photo.jpg`, width, height: width / 2, hash: `${key}_photo`, ext: ".jpg" },
  ]),
);

describe("planUploadRewrite", () => {
  it("replaces card, tablet, and square and keeps the original and admin thumbnail", () => {
    const plan = planUploadRewrite({
      mime: "image/jpeg",
      ext: ".jpg",
      url: "/uploads/photo.jpg",
      hash: "photo",
      blurDataURL: null,
      formats: {
        thumbnail: { url: "/uploads/thumbnail_photo.jpg", hash: "thumbnail_photo", ext: ".jpg", width: 245 },
        card: { url: "/uploads/card_photo.jpg", hash: "card_photo", ext: ".jpg", width: 768 },
        tablet: { url: "/uploads/tablet_photo.jpg", hash: "tablet_photo", ext: ".jpg", width: 1024 },
        square: { url: "/uploads/square_photo.jpg", hash: "square_photo", ext: ".jpg", width: 1024 },
      },
    });

    assert.equal(plan.action, "rewrite");
    if (plan.action !== "rewrite") return;
    assert.deepEqual([...plan.remove].sort(), ["card", "square", "tablet"]);
    assert.deepEqual(plan.keep, ["thumbnail"]);
    assert.equal(plan.original, "/uploads/photo.jpg");
    assert.equal(plan.remove.includes("thumbnail"), false);
  });

  it("skips SVG files", () => {
    const plan = planUploadRewrite({
      mime: "image/svg+xml",
      ext: ".svg",
      url: "/uploads/mark.svg",
      formats: {
        card: { url: "/uploads/card_mark.png", width: 768 },
      },
    });
    assert.deepEqual(plan, { action: "skip", reason: "svg" });
  });

  it("leaves a file that already has the seven widths and a blur alone", () => {
    const plan = planUploadRewrite({
      mime: "image/jpeg",
      ext: ".jpg",
      url: "/uploads/photo.jpg",
      blurDataURL: "data:image/webp;base64,aaaa",
      formats: {
        thumbnail: { url: "/uploads/thumbnail_photo.jpg", width: 245 },
        ...widthFormats,
      },
    });
    assert.deepEqual(plan, { action: "skip", reason: "current" });
  });

  it("leaves a narrower image alone when every width that fits is stored", () => {
    const plan = planUploadRewrite({
      mime: "image/jpeg",
      ext: ".jpg",
      url: "/uploads/small.jpg",
      width: 500,
      blurDataURL: "data:image/webp;base64,aaaa",
      formats: {
        thumbnail: { url: "/uploads/thumbnail_small.jpg", width: 245 },
        w160: { url: "/uploads/w160_small.jpg", width: 160 },
        w320: { url: "/uploads/w320_small.jpg", width: 320 },
        w480: { url: "/uploads/w480_small.jpg", width: 480 },
      },
    });
    assert.deepEqual(plan, { action: "skip", reason: "current" });
  });

  it("rewrites when the widths exist but the blur is missing", () => {
    const plan = planUploadRewrite({
      mime: "image/png",
      ext: ".png",
      url: "/uploads/photo.png",
      blurDataURL: null,
      formats: widthFormats,
    });
    assert.equal(plan.action, "rewrite");
    if (plan.action !== "rewrite") return;
    assert.equal(plan.original, "/uploads/photo.png");
    assert.equal(plan.remove.includes("thumbnail"), false);
  });
});
