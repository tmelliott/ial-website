// nginx ingress reads the upstream response headers into a 4KB buffer
// (proxy-buffer-size). Logout already sends about 2.5KB of that on the
// cookie-clearing 302. strapi-plugin-oidc then puts the whole ID token in
// Location as id_token_hint, the buffer overflows, and the ingress returns
// 502 while the browser is still on /strapi-plugin-oidc/logout.
//
// Authentik selects the application from the end-session path, so the hint
// can be omitted. Leave every other parameter, including
// post_logout_redirect_uri, in place.
export const MAX_LOGOUT_LOCATION_LENGTH = 700;

export function locationWithoutOversizedIdToken(location: string): string {
  if (location.length <= MAX_LOGOUT_LOCATION_LENGTH) return location;

  let url: URL;
  try {
    url = new URL(location);
  } catch {
    return location;
  }
  if (!url.searchParams.has('id_token_hint')) return location;

  url.searchParams.delete('id_token_hint');
  return url.toString();
}
