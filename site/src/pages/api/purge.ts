import { timingSafeEqual } from "node:crypto";
import { PURGE_SECRET } from "astro:env/server";
import type { APIRoute } from "astro";

const TAG = /^[a-zA-Z][a-zA-Z0-9:-]{0,63}$/;

function authorized(header: string | null, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header ?? "");
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export const POST: APIRoute = async ({ request, cache }) => {
  cache.set(false);

  if (!PURGE_SECRET) {
    return Response.json({ error: "Purge secret is not configured" }, { status: 500 });
  }
  if (!authorized(request.headers.get("authorization"), PURGE_SECRET)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let tags: unknown;
  try {
    const body = await request.json();
    tags = body?.tags;
  } catch {
    return Response.json({ error: "Expected a JSON body" }, { status: 400 });
  }

  if (
    !Array.isArray(tags) ||
    tags.length === 0 ||
    tags.length > 50 ||
    tags.some((tag) => typeof tag !== "string" || !TAG.test(tag))
  ) {
    return Response.json({ error: "Expected a list of cache tags" }, { status: 400 });
  }

  if (cache.enabled) await cache.invalidate({ tags });
  return Response.json({ purged: true, tags });
};
