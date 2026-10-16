import { defineMiddleware } from "astro:middleware";
import { YEAR_SECONDS } from "./lib/cacheTags";
import { runWithRequestCache } from "./lib/requestCache";

export const onRequest = defineMiddleware((context, next) => {
  return runWithRequestCache(context.cache, () => {
    if (context.cache.enabled) context.cache.set({ maxAge: YEAR_SECONDS });
    return next();
  });
});
