import { PAYLOAD_URL } from "astro:env/server";

export type Media = {
  id: number;
  url?: string | null;
  alt?: string | null;
  description?: string | null;
};

export type LexicalData = {
  root: {
    type: string;
    children: unknown[];
  };
};

export type MenuLink = {
  id?: string | null;
  label: string;
  location: string;
  tereo?: string | null;
  submenu?: { id?: string | null; label: string; location: string }[] | null;
};

export type GeneralGlobal = {
  logo?: number | Media | null;
  mainMenu?: MenuLink[] | null;
  footerMenu?: { id?: string | null; label: string; location: string }[] | null;
  socialLinks?: { id?: string | null; url: string }[] | null;
  metadata?: {
    title?: string | null;
    description?: string | null;
  };
};

export function isMedia(value: unknown): value is Media {
  return typeof value === "object" && value !== null && "url" in value;
}

export function mediaUrl(value: unknown): string | undefined {
  if (!isMedia(value) || !value.url) return undefined;
  return value.url;
}

function endpoint(path: string, params: Record<string, string> = {}): URL {
  const url = new URL(path, `${PAYLOAD_URL.replace(/\/$/, "")}/`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function payloadJson<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = endpoint(path, params);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Payload request failed (${response.status}): ${url.pathname}${url.search}`,
    );
  }
  return response.json() as Promise<T>;
}

export async function findCollection<T>(
  collection: string,
  params: Record<string, string> = {},
): Promise<T[]> {
  const data = await payloadJson<{ docs: T[] }>(`/api/${collection}`, params);
  return data.docs;
}

export async function findGlobal<T>(
  slug: string,
  params: Record<string, string> = {},
): Promise<T> {
  return payloadJson<T>(`/api/globals/${slug}`, params);
}

export async function getGeneral(): Promise<GeneralGlobal> {
  return findGlobal<GeneralGlobal>("general", { depth: "1" });
}

const longDate = new Intl.DateTimeFormat("en-NZ", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatLongDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return longDate.format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatShortDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}/${year.slice(2)}`;
}
