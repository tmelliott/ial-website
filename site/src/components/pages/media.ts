export type KeywordRef = {
  id?: number;
  title: string;
  slug: string;
};

export type MediaImage = {
  id?: number;
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  sizes?: {
    thumbnail?: { url?: string | null } | null;
    card?: { url?: string | null } | null;
    tablet?: { url?: string | null } | null;
    square?: { url?: string | null } | null;
  } | null;
};

export function isImage(value: unknown): value is MediaImage {
  return typeof value === "object" && value !== null && "url" in value;
}

export function focalPosition(image: MediaImage | null | undefined): string | undefined {
  if (
    image?.focalX !== null &&
    image?.focalX !== undefined &&
    image?.focalY !== null &&
    image?.focalY !== undefined
  ) {
    return `${image.focalX}% ${image.focalY}%`;
  }
  return undefined;
}

export function sizedImageUrl(
  image: unknown,
  variant?: "square" | "card",
): string | undefined {
  if (!isImage(image)) return undefined;
  const sized = variant ? image.sizes?.[variant]?.url : undefined;
  return sized ?? image.url ?? undefined;
}

export function keywordRefs(
  value: (number | KeywordRef)[] | null | undefined,
): KeywordRef[] {
  return (value ?? []).filter(
    (keyword): keyword is KeywordRef =>
      typeof keyword === "object" && keyword !== null && "slug" in keyword,
  );
}
