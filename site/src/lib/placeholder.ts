type PlaceholderImage = {
  blurDataURL?: string | null;
  url?: string | null;
};

/** The blur is stored on the upload. Nothing is downloaded at render time. */
export function getPlaceholder(
  image: PlaceholderImage | string | null | undefined,
): string | undefined {
  if (!image || typeof image === "string") return undefined;
  const blur = image.blurDataURL;
  return typeof blur === "string" && blur.length > 0 ? blur : undefined;
}
