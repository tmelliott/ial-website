import { AsyncLocalStorage } from "node:async_hooks";

export type RequestCache = {
  enabled: boolean;
  set: (value: { tags?: string[]; maxAge?: number } | false) => void;
};

const storage = new AsyncLocalStorage<RequestCache>();

export function runWithRequestCache<T>(cache: RequestCache, fn: () => T): T {
  return storage.run(cache, fn);
}

/** Tags only. Omitting maxAge leaves an earlier maxAge in place. */
export function tagRequest(tags: string[]): void {
  const cache = storage.getStore();
  if (!cache?.enabled) return;
  const unique = [...new Set(tags.filter((tag) => tag.length > 0))];
  if (unique.length === 0) return;
  cache.set({ tags: unique });
}

export function setRequestMaxAge(maxAge: number): void {
  const cache = storage.getStore();
  if (!cache?.enabled) return;
  cache.set({ maxAge });
}
