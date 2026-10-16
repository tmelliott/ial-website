const WWW_HOST = "www.inzight.co.nz";
const APEX_ORIGIN = "https://inzight.co.nz";

/** Host from the request Host header, without port. */
export function requestHostname(hostHeader: string | null): string {
  return (hostHeader ?? "").split(":")[0].trim().toLowerCase();
}

/**
 * Permanent redirect target for www → apex. Keeps path and query.
 * Returns null when the host is not www.
 */
export function apexRedirectLocation(
  hostHeader: string | null,
  pathname: string,
  search: string,
): string | null {
  if (requestHostname(hostHeader) !== WWW_HOST) return null;
  return `${APEX_ORIGIN}${pathname}${search}`;
}
