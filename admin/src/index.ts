import type { Core } from '@strapi/strapi';

import { bootstrapTrial } from './seed';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await bootstrapTrial(strapi);
  },
};
