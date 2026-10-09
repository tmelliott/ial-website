import type { LexicalData } from "../../lib/payload";

export type Keyword = {
  id: number;
  title: string;
  slug: string;
};

export type TeamPerson = {
  id: number;
  slug: string;
  fullname: string;
  name: {
    first: string;
    last: string;
  };
  photo?: unknown;
};

export type NewsLink = {
  id?: string | null;
  label: string;
  url: string;
};

export type NewsItem = {
  id: number;
  title: string;
  slug: string;
  date: string;
  newstype?: string | null;
  content?: LexicalData | null;
  gallery?: unknown[] | null;
  keywords?: (number | Keyword)[] | null;
  team?: (number | TeamPerson)[] | null;
  link?: NewsLink[] | null;
};
