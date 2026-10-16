import sharp from "sharp";

/** Display widths. Keys are format names, not the old square/card crops. */
export const uploadBreakpoints = {
  w160: 160,
  w320: 320,
  w480: 480,
  w640: 640,
  w960: 960,
  w1280: 1280,
  w1920: 1920,
} as const;

export type ImageVariant = {
  key: keyof typeof uploadBreakpoints;
  width: number;
  height: number;
  buffer: Buffer;
};

export type ImageVariantResult = {
  widths: ImageVariant[];
  blurDataURL: string | null;
};

function isSvg(mime: string): boolean {
  return mime.toLowerCase().includes("svg");
}

/**
 * Width files that fit inside the source, plus a ~16px blur.
 * Height stays proportional. The input buffer is not modified.
 */
export async function imageVariants(buffer: Buffer, mime: string): Promise<ImageVariantResult> {
  if (isSvg(mime)) return { widths: [], blurDataURL: null };

  const meta = await sharp(buffer, { animated: false }).metadata();
  const sourceWidth = meta.width ?? 0;
  const sourceHeight = meta.height ?? 0;
  if (!sourceWidth || !sourceHeight) return { widths: [], blurDataURL: null };

  const widths: ImageVariant[] = [];
  for (const [key, width] of Object.entries(uploadBreakpoints) as [
    keyof typeof uploadBreakpoints,
    number,
  ][]) {
    if (width > sourceWidth) continue;
    const { data, info } = await sharp(buffer, { animated: false })
      .resize({ width, withoutEnlargement: true })
      .toBuffer({ resolveWithObject: true });
    widths.push({
      key,
      width: info.width,
      height: info.height,
      buffer: data,
    });
  }

  const blur = await sharp(buffer, { animated: false })
    .resize({ width: 16, withoutEnlargement: true })
    .webp()
    .toBuffer();

  return {
    widths,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}
