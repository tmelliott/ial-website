import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPlaiceholder } from "plaiceholder";

const cache = new Map<string, string | undefined>();

async function imageBuffer(src: string): Promise<Buffer | undefined> {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    const response = await fetch(src, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return undefined;
    return Buffer.from(await response.arrayBuffer());
  }

  if (src.startsWith("/")) {
    return readFile(path.join(process.cwd(), "public", decodeURIComponent(src)));
  }

  return undefined;
}

/** Same 5px base64 placeholder the Next site generates with plaiceholder. */
export async function getPlaceholder(
  src: string | null | undefined,
): Promise<string | undefined> {
  if (!src) return undefined;
  if (cache.has(src)) return cache.get(src);

  try {
    const buffer = await imageBuffer(src);
    if (!buffer) {
      cache.set(src, undefined);
      return undefined;
    }
    const { base64 } = await getPlaiceholder(buffer, { size: 5 });
    cache.set(src, base64);
    return base64;
  } catch {
    cache.set(src, undefined);
    return undefined;
  }
}
