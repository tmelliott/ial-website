import { getPlaiceholder } from "plaiceholder";

const placeholderCache = new Map<string, string | undefined>();

export default async function getPlaceholder(src: string | null | undefined) {
  if (!src) return undefined;

  if (placeholderCache.has(src)) {
    return placeholderCache.get(src);
  }

  let result: string | undefined;
  try {
    const response = await fetch(src, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      placeholderCache.set(src, undefined);
      return undefined;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const { base64 } = await getPlaiceholder(buffer, { size: 5 });
    result = base64;
  } catch {
    result = undefined;
  }

  placeholderCache.set(src, result);
  return result;
}
