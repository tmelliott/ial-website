import type { LexicalData } from "../../lib/payload";

export type MediaImage = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    square?: { url?: string | null } | null;
    card?: { url?: string | null } | null;
  } | null;
};

export type KeywordLink = {
  id?: number | string | null;
  title: string;
  slug: string;
};

export type CarouselApp = {
  id: number | string;
  slug: string;
  title: string;
  link: string;
  contentHtml: string;
  banner?: number | MediaImage | null;
  bannerBlur?: string;
  logo?: number | MediaImage | null;
  keywords?: (number | KeywordLink)[] | null;
};

export type ProjectDoc = {
  id: number | string;
  title: string;
  slug: string;
  content?: LexicalData | null;
  banner?: number | MediaImage | null;
  keywords?: (number | KeywordLink)[] | null;
};

export function isMediaImage(value: unknown): value is MediaImage {
  return typeof value === "object" && value !== null;
}
