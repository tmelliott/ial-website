export type QuickLink = {
  title: string;
  url: string;
  subtitle?: string | null;
  tag?: string | null;
  expires?: string | null;
};

export function isExternalLink(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** A link with no expiry stays. An expiry date is inclusive in Pacific/Auckland. */
export function isQuickLinkLive(expires: string | null | undefined, today: string): boolean {
  if (!expires) return true;
  const day = expires.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return true;
  return day >= today;
}

export function liveQuickLinks<T extends QuickLink>(links: T[] | null | undefined, today: string): T[] {
  return (links ?? []).filter((link) => link.title && link.url && isQuickLinkLive(link.expires, today));
}

/** Sub-line under a tile. External links fall back to their hostname. */
export function quickLinkSubtitle(link: Pick<QuickLink, "url" | "subtitle">): string | null {
  const custom = link.subtitle?.trim();
  if (custom) return custom;
  if (!isExternalLink(link.url)) return null;
  try {
    return new URL(link.url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
