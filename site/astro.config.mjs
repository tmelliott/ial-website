// @ts-check
import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, envField, memoryCache } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  session: false,
  integrations: [react()],

  cache: {
    provider: memoryCache(),
  },

  env: {
    schema: {
      STRAPI_URL: envField.string({
        context: "server",
        access: "public",
        url: true,
        default: "http://localhost:1337",
      }),
      STRAPI_INTERNAL_URL: envField.string({
        context: "server",
        access: "public",
        url: true,
        default: "http://localhost:1337",
      }),
      STRAPI_API_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      PREVIEW_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      PURGE_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },

  redirects: {
    "/keywords/horizon-europe": "/horizon-europe",
    "/projects/political-polling-guide":
      "/projects/understanding-public-opinion-polls-in-new-zealand",
    "/projects/matau": "/apps#matau",
    "/projects/page/1": "/projects",
  },

  vite: {
    plugins: [tailwindcss()],
  },
});