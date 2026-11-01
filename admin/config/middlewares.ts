import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  // Outermost, so it sees the final logout Location after the OIDC plugin runs.
  'global::oidc-logout-redirect',
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
