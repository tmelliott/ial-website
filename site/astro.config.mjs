// @ts-check
import netlify from "@astrojs/netlify";
import { cacheNetlify } from "@astrojs/netlify/cache";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

const YEAR = 60 * 60 * 24 * 365;

/** @param {string[]} tags */
function cached(tags) {
  return { maxAge: YEAR, tags: ["global:general", ...tags] };
}

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify({
    devFeatures: {
      environmentVariables: false,
      images: true,
      edgeFunctions: false,
    },
  }),
  // The site has no Astro sessions. Leaving this unset makes the Netlify
  // adapter store a session driver in Netlify Blobs.
  session: false,
  integrations: [react()],

  cache: {
    provider: cacheNetlify(),
  },

  // Tags live here so they are on the response even when a layout fetches
  // Payload while the page is already rendering. Content edits purge a tag
  // instead of rebuilding the site.
  routeRules: {
    "/": cached([
      "home",
      "homeHero",
      "homeProjects",
      "homeTeam",
      "homeCollaborators",
      "homeApps",
      "homeNews",
      "news",
    ]),
    "/about": cached(["about", "team", "homeCollaborators"]),
    "/apps": cached(["apps"]),
    "/contact": cached(["team"]),
    "/contact/thank-you": cached([]),
    "/horizon-europe": cached(["keywords"]),
    "/news": cached(["news"]),
    "/news/[slug]": cached(["news"]),
    "/privacy": cached([]),
    "/projects": cached(["projects"]),
    "/projects/[slug]": cached(["projects"]),
    "/projects/page/[page]": cached(["projects"]),
    "/keywords/[slug]": cached(["keywords"]),
    "/team/[slug]": cached(["team"]),
    "/404": cached([]),
  },

  env: {
    schema: {
      PAYLOAD_URL: envField.string({
        context: "server",
        access: "public",
        url: true,
        default: "https://admin.inzight.co.nz",
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