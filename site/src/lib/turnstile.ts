const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const CONTACT_ACTION = "contact";
const PRODUCTION_HOSTNAME = "site.inzight.co.nz";

// Cloudflare's published dummy keys. The widget always passes and siteverify
// accepts the token. They are not a secret. Production reads the real keys
// from the server environment and stays closed when they are missing.
const TEST_SITE_KEY = "1x00000000000000000000AA";
const TEST_SECRET = "1x0000000000000000000000000000000AA";

function configured(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function expectedTurnstileHostnames(): Set<string> {
  const fromEnv = configured("TURNSTILE_HOSTNAMES")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean);
  const names =
    fromEnv.length > 0 ? fromEnv : process.env.NODE_ENV === "production" ? [PRODUCTION_HOSTNAME] : [];
  const allowed =
    process.env.NODE_ENV === "production"
      ? names.filter((hostname) => hostname !== "localhost" && hostname !== "127.0.0.1")
      : names;
  return new Set(allowed);
}

export function turnstileSiteKey(): string {
  const key = configured("TURNSTILE_SITE_KEY");
  if (key) return key;
  if (process.env.NODE_ENV === "production") return "";
  return TEST_SITE_KEY;
}

export function turnstileSecret(): string {
  const secret = configured("TURNSTILE_SECRET_KEY");
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") return "";
  return TEST_SECRET;
}

export async function verifyTurnstile(
  token: string,
  remoteIp: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const secret = turnstileSecret();
  const hostnames = expectedTurnstileHostnames();
  if (!secret || !token || token.length > 2048) return false;
  if (secret !== TEST_SECRET && hostnames.size === 0) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);
  let response: Response;
  try {
    response = await fetchImpl(SITEVERIFY, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return false;
  }
  if (!response.ok) return false;
  const data = (await response.json()) as { success?: boolean; action?: string; hostname?: string };
  if (data.success !== true) return false;
  // The published test secret reports action "test" and hostname "localhost".
  if (secret === TEST_SECRET) return true;
  return data.action === CONTACT_ACTION && typeof data.hostname === "string" && hostnames.has(data.hostname);
}
