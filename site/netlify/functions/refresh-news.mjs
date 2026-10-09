import { purgeCache } from "@netlify/functions";
import { listLiveNewsPaths, warmCache } from "../../scripts/warm-cache.mjs";

/**
 * Shortly after midnight in New Zealand (13:00 UTC is 1am or 2am there).
 * Purges every page that lists news, then renders the ones that are live.
 */
export default async () => {
  await purgeCache({ tags: ["news"] });
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const paths = await listLiveNewsPaths();
  await warmCache({ paths, baseUrl: process.env.URL });
  return new Response(`Refreshed ${paths.length} news pages`);
};

export const config = {
  schedule: "0 13 * * *",
};
