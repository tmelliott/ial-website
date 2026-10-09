import { findCollection } from "../../lib/payload";

export function populated<T>(docs: (number | T)[] | null | undefined): T[] {
  return (docs ?? []).filter(
    (doc): doc is T => doc != null && typeof doc !== "number",
  );
}

export async function hydrateById<T extends { id: number }>(
  collection: string,
  docs: T[],
  needsHydration: (doc: T) => boolean,
  depth = "1",
): Promise<T[]> {
  if (!docs.some(needsHydration)) return docs;
  const params: Record<string, string> = {
    depth,
    limit: String(docs.length),
  };
  docs.forEach((doc, index) => {
    params[`where[id][in][${index}]`] = String(doc.id);
  });
  const hydrated = await findCollection<T>(collection, params);
  const byId = new Map(hydrated.map((doc) => [doc.id, doc]));
  return docs.map((doc) => byId.get(doc.id) ?? doc);
}
