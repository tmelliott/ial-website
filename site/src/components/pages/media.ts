export type KeywordRef = {
  id?: number;
  title: string;
  slug: string;
};

export type MediaImage = {
  id?: number;
  url?: string | null;
  alt?: string | null;
  mime?: string | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  blurDataURL?: string | null;
  widths?: { url: string; width: number }[] | null;
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

export function keywordRefs(
  value: (number | KeywordRef)[] | null | undefined,
): KeywordRef[] {
  return (value ?? []).filter(
    (keyword): keyword is KeywordRef =>
      typeof keyword === "object" && keyword !== null && "slug" in keyword,
  );
}
