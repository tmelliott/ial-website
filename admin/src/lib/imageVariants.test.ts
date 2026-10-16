import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sharp from "sharp";
import { imageVariants, uploadBreakpoints } from "./imageVariants";

const FORBIDDEN_KEYS = ["thumbnail", "card", "tablet", "square"];

async function fixture(width: number, height: number): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 20, g: 80, b: 160 },
    },
  })
    .jpeg()
    .toBuffer();
}

describe("uploadBreakpoints", () => {
  it("uses the seven display widths and not the old crop names", () => {
    const keys = Object.keys(uploadBreakpoints);
    assert.deepEqual(
      Object.values(uploadBreakpoints),
      [160, 320, 480, 640, 960, 1280, 1920],
    );
    for (const key of keys) {
      assert.equal(FORBIDDEN_KEYS.includes(key), false, key);
    }
  });
});

describe("imageVariants", () => {
  it("emits every width that fits a wide image, in proportion, without cropping", async () => {
    const source = await fixture(2000, 1000);
    const original = Buffer.from(source);
    const result = await imageVariants(source, "image/jpeg");

    assert.deepEqual(
      result.widths.map((variant) => variant.width),
      [160, 320, 480, 640, 960, 1280, 1920],
    );

    const at160 = result.widths.find((variant) => variant.width === 160);
    assert.ok(at160);
    const meta = await sharp(at160.buffer).metadata();
    assert.equal(meta.width, 160);
    assert.equal(meta.height, 80);
    assert.notEqual(meta.width, meta.height);
    assert.equal(Buffer.compare(source, original), 0);
  });

  it("omits widths that do not fit inside a tall image and keeps the aspect ratio", async () => {
    const source = await fixture(800, 2000);
    const result = await imageVariants(source, "image/jpeg");

    assert.deepEqual(
      result.widths.map((variant) => variant.width),
      [160, 320, 480, 640],
    );

    const at160 = result.widths.find((variant) => variant.width === 160);
    assert.ok(at160);
    const meta = await sharp(at160.buffer).metadata();
    assert.equal(meta.width, 160);
    assert.equal(meta.height, 400);
    assert.notEqual(meta.width, meta.height);
  });

  it("returns no widths and no blur for SVG", async () => {
    const svg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"></svg>',
    );
    const result = await imageVariants(svg, "image/svg+xml");
    assert.deepEqual(result.widths, []);
    assert.equal(result.blurDataURL, null);
  });

  it("stores a data-url blur about 16 pixels wide", async () => {
    const source = await fixture(2000, 1000);
    const result = await imageVariants(source, "image/jpeg");
    assert.match(result.blurDataURL ?? "", /^data:image\//);
    const encoded = result.blurDataURL?.split(",")[1] ?? "";
    const blur = await sharp(Buffer.from(encoded, "base64")).metadata();
    assert.equal(typeof blur.width, "number");
    assert.ok(blur.width !== undefined && blur.width >= 14 && blur.width <= 18);
  });
});
