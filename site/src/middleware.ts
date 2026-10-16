import { defineMiddleware } from "astro:middleware";
import { apexRedirectLocation } from "./lib/apexRedirect";
import { YEAR_SECONDS } from "./lib/cacheTags";
import { runWithRequestCache } from "./lib/requestCache";

export const onRequest = defineMiddleware((context, next) => {
  const location = apexRedirectLocation(
    context.request.headers.get("host"),
    context.url.pathname,
    context.url.search,
  );
  if (location) return Response.redirect(location, 301);

  return runWithRequestCache(context.cache, () => {
    if (context.cache.enabled) context.cache.set({ maxAge: YEAR_SECONDS });
    return next();
  });
});
