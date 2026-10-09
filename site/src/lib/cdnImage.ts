/**
 * Two widths per slot: the file a 1x screen needs, and the 2x file.
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
    widths: [800, 1600],
    sizes: "(min-width: 1024px) 540px, 100vw",
  },
  /** Collaborator marks in the scrolling row. */
  logo: {
    widths: [240, 480],
    sizes: "208px",
  },
  /** Logo sitting on top of a card image. */
  overlay: {
    widths: [400, 800],
    sizes: "380px",
  },
  /** Round avatars at 48px. */
  avatar: {
    widths: [96, 192],
    sizes: "48px",
  },
  /** Header and footer wordmark. */
  brand: {
    widths: [320, 640],
    sizes: "300px",
  },
} as const;

export type ImageFit = keyof typeof imageFit;

export type ResponsiveImage = {
  src: string;
  srcset?: string;
  sizes?: string;
};

const REMOTE_HOST = "admin.inzight.co.nz";

function canTransform(src: string): boolean {
  const path = src.split("?")[0]?.toLowerCase() ?? "";
  if (path.endsWith(".svg")) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === REMOTE_HOST;
  } catch {
    return false;
  }
}

function cdnUrl(src: string, width: number): string {
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}`;
}

/** Production HTML uses the image CDN. `astro dev` keeps the original URL. */
export function responsiveImage(src: string, fit: ImageFit = "card"): ResponsiveImage {
  const slot = imageFit[fit];
  if (!src || !import.meta.env.PROD || !canTransform(src)) return { src };

  return {
    src: cdnUrl(src, slot.widths[0]),
    srcset: slot.widths.map((width) => `${cdnUrl(src, width)} ${width}w`).join(", "),
    sizes: slot.sizes,
  };
}
