/**
 * Two widths per slot, chosen from the files Strapi stored.
 * `sizes` is the slot's CSS width so the browser can pick between them.
 */
export const imageFit = {
  /** Project and news banners. Widest just below the desktop grid. */
  banner: {
    widths: [960, 1920],
    sizes: "(min-width: 1024px) 660px, 100vw",
  },
  /** Cards in the page grid, including full-width app cards. */
  card: {
    widths: [640, 1280],
    sizes: "(min-width: 768px) 560px, 100vw",
  },
  /** Team grid portraits. */
  portrait: {
    widths: [480, 960],
    sizes: "(min-width: 1024px) 280px, 50vw",
  },
  /** Home "our team" photo, half the content width on desktop. */
  team: {
    widths: [640, 1280],
    sizes: "(min-width: 1024px) 540px, 100vw",
  },
  /** Collaborator marks. The tile is about 160px wide. */
  logo: {
    widths: [160, 320],
    sizes: "160px",
  },
  /** Logo sitting on top of a card image. */
  overlay: {
    widths: [480, 960],
    sizes: "380px",
  },
  /** Round avatars at 48px. */
  avatar: {
    widths: [160, 320],
    sizes: "48px",
  },
  /** Header and footer wordmark. */
  brand: {
    widths: [320, 640],
    sizes: "300px",
  },
} as const;

export type ImageFit = keyof typeof imageFit;

export type StoredWidth = {
  url: string;
  width: number;
};

export type StoredImage = {
  url?: string | null;
  mime?: string | null;
  widths?: StoredWidth[] | null;
};

export type ResponsiveImage = {
  src: string;
  srcset?: string;
  sizes?: string;
};

function isSvg(src: string, mime?: string | null): boolean {
  if (mime?.toLowerCase().includes("svg")) return true;
  const path = src.split("?")[0]?.toLowerCase() ?? "";
  return path.endsWith(".svg");
}

/** Srcset entries are the stored width files for the slot. The original is the fallback src. */
export function responsiveImage(
  image: string | StoredImage | null | undefined,
  fit: ImageFit = "card",
): ResponsiveImage {
  const src = typeof image === "string" ? image : (image?.url ?? "");
  if (!src) return { src: "" };

  const mime = typeof image === "string" ? null : image?.mime;
  if (isSvg(src, mime)) return { src };

  const slot = imageFit[fit];
  const widths = typeof image === "string" ? [] : (image?.widths ?? []);
  const srcset = slot.widths.flatMap((width) => {
    const file = widths.find((item) => item.width === width && item.url);
    return file ? [`${file.url} ${width}w`] : [];
  });
  if (srcset.length === 0) return { src };

  return {
    src,
    srcset: srcset.join(", "),
    sizes: slot.sizes,
  };
}
