// @ts-check
import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [react()],

  env: {
    schema: {
      PAYLOAD_URL: envField.string({
        context: "server",
        access: "public",
        url: true,
        default: "https://admin.inzight.co.nz",
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