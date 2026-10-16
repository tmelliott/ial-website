const WINDOW_MS = 15 * 60 * 1000;
const PER_ADDRESS = 5;
const GLOBAL = 30;

function isIp(value: string): boolean {
  return value.length >= 3 && value.length <= 45 && /^[0-9a-fA-F:.]+$/.test(value);
}

export function clientIp(headers: { forwardedFor: string | null; realIp: string | null }): string {
  const real = headers.realIp?.trim() ?? "";
  if (isIp(real)) return real;
  const parts = (headers.forwardedFor ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const last = parts.at(-1) ?? "";
  return isIp(last) ? last : "";
}

export function createContactLimiter(perAddress = PER_ADDRESS, global = GLOBAL) {
  const buckets = new Map<string, number[]>();
  const prune = (times: number[], now: number) => times.filter((time) => now - time < WINDOW_MS);

  return function allow(ip: string, now = Date.now()): boolean {
    const key = ip || "unknown";
    const own = prune(buckets.get(key) ?? [], now);
    const all = prune(buckets.get("*") ?? [], now);
    if (own.length >= perAddress || all.length >= global) {
      buckets.set(key, own);
      buckets.set("*", all);
      return false;
    }
    own.push(now);
    all.push(now);
    buckets.set(key, own);
    buckets.set("*", all);
    return true;
  };
}

export const allowContactSubmission = createContactLimiter();
