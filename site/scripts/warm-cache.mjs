/**
 * Request every public page once so the CDN stores it.
 * Run after a deploy is live. A request made during the build is discarded
 * when that deploy is published.
 */
import { pathToFileURL } from "node:url";
import { liveNewsParams } from "../src/lib/newsDate.mjs";

const PROJECTS_PER_PAGE = 7;
const CONCURRENCY = 4;

const STATIC_PATHS = [
  "/",
  "/about",
  "/apps",
  "/contact",
  "/contact/thank-you",
  "/horizon-europe",
  "/news",
  "/privacy",
  "/projects",
];

function origin(value) {
  return value.replace(/\/$/, "");
}

async function slugs(payloadUrl, collection, params = {}) {
  const url = new URL(`/api/${collection}`, `${origin(payloadUrl)}/`);
  url.searchParams.set("depth", "0");
  url.searchParams.set("limit", "0");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Payload request failed (${response.status}): ${url.pathname}`);
  }
  const data = await response.json();
  return data.docs.map((doc) => doc.slug).filter((slug) => typeof slug === "string" && slug);
}

export async function listPaths(payloadUrl) {
  const [projects, news, team, keywords] = await Promise.all([
    slugs(payloadUrl, "projects"),
    slugs(payloadUrl, "news", liveNewsParams()),
    slugs(payloadUrl, "team"),
    slugs(payloadUrl, "keywords"),
  ]);

  const paths = [...STATIC_PATHS];
  for (const slug of projects) paths.push(`/projects/${slug}`);
  const pageCount = Math.max(1, Math.ceil(projects.length / PROJECTS_PER_PAGE));
  for (let page = 2; page <= pageCount; page += 1) {
    paths.push(`/projects/page/${page}`);
  }
  for (const slug of news) paths.push(`/news/${slug}`);
  for (const slug of team) paths.push(`/team/${slug}`);
  for (const slug of keywords) {
    if (slug !== "horizon-europe") paths.push(`/keywords/${slug}`);
  }
  return paths;
}

async function warmOne(baseUrl, path) {
  const url = new URL(path, `${origin(baseUrl)}/`);
  const started = Date.now();
  const response = await fetch(url, { redirect: "follow" });
  const cacheStatus = response.headers.get("cache-status") ?? "";
  await response.arrayBuffer();
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const ok = response.ok;
  console.log(`${ok ? "ok" : "fail"} ${response.status} ${seconds}s ${path} ${cacheStatus}`);
  return ok;
}

export async function listLiveNewsPaths(payloadUrl) {
  const payload = payloadUrl || process.env.PAYLOAD_URL || "https://admin.inzight.co.nz";
  const [news, team, keywords] = await Promise.all([
    slugs(payload, "news", liveNewsParams()),
    slugs(payload, "team"),
    slugs(payload, "keywords"),
  ]);
  return [
    "/",
    "/news",
    "/horizon-europe",
    ...news.map((slug) => `/news/${slug}`),
    ...team.map((slug) => `/team/${slug}`),
    ...keywords
      .filter((slug) => slug !== "horizon-europe")
      .map((slug) => `/keywords/${slug}`),
  ];
}

export async function warmCache({ baseUrl, payloadUrl, paths } = {}) {
  const site = baseUrl || process.env.DEPLOY_PRIME_URL || process.env.URL;
  if (!site) {
    console.log("Skipping cache warm: no deploy URL");
    return;
  }
  const payload = payloadUrl || process.env.PAYLOAD_URL || "https://admin.inzight.co.nz";
  const pagePaths = paths ?? (await listPaths(payload));
  console.log(`Warming ${pagePaths.length} pages on ${origin(site)}`);

  let cursor = 0;
  let failed = 0;
  async function worker() {
    while (cursor < pagePaths.length) {
      const path = pagePaths[cursor];
      cursor += 1;
      try {
        const ok = await warmOne(site, path);
        if (!ok) failed += 1;
      } catch (error) {
        failed += 1;
        console.log(`fail ${path} ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, pagePaths.length) }, () => worker()),
  );
  console.log(failed === 0 ? "Cache warm finished" : `Cache warm finished with ${failed} failures`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await warmCache({ baseUrl: process.env.BASE_URL });
}
