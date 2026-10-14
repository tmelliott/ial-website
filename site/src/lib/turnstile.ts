const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Cloudflare's published dummy keys. The widget always passes and siteverify
// accepts the token. They are not a secret. Production must set real keys.
const TEST_SITE_KEY = "1x00000000000000000000AA";
const TEST_SECRET = "1x0000000000000000000000000000000AA";

function configured(name: string): string {
  return process.env[name]?.trim() ?? "";
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
  if (!secret || !token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);
  let response: Response;
  try {
    response = await fetchImpl(SITEVERIFY, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch {
    return false;
  }
  if (!response.ok) return false;
  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}
