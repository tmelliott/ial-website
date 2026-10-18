const BEACON_SRC = "https://static.cloudflareinsights.com/beacon.min.js";

// Public site token from the Cloudflare Web Analytics snippet. It is embedded
// in every production page, so it is not a secret.
export const WEB_ANALYTICS_TOKEN = "0d8965ed31f042a886cb77a92c5efafa";

// Cloudflare site tokens are opaque ids. Reject anything else so the beacon
// attribute cannot carry markup or extra JSON fields.
const TOKEN = /^[A-Za-z0-9_-]{16,128}$/;

export type CloudflareBeacon = {
  src: string;
  payload: string;
};

export function cloudflareBeacon(token: string | undefined): CloudflareBeacon | null {
  const value = token?.trim() ?? "";
  if (!TOKEN.test(value)) return null;
  return {
    src: BEACON_SRC,
    payload: JSON.stringify({ token: value }),
  };
}

export function productionBeacon(prod: boolean): CloudflareBeacon | null {
  if (!prod) return null;
  return cloudflareBeacon(WEB_ANALYTICS_TOKEN);
}
