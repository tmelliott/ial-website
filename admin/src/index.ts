import type { Core } from '@strapi/strapi';

import { postPurge, purgeTags } from './lib/purgeTags';
import { bootstrapTrial } from './seed';

async function publishedVersionExists(
  strapi: Core.Strapi,
  uid: string,
  documentId: string | undefined,
): Promise<boolean> {
  if (!documentId) return false;
  const existing = await strapi.db.query(uid).findOne({
    where: { documentId, publishedAt: { $notNull: true } },
  });
  return Boolean(existing);
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.documents.use(async (context, next) => {
      const params = context.params as { documentId?: unknown; status?: unknown };
      const documentId = typeof params.documentId === 'string' ? params.documentId : undefined;
      const hadPublished =
        context.uid === 'api::news-item.news-item'
          ? await publishedVersionExists(strapi, context.uid, documentId)
          : false;
      const result = await next();
      const createdId =
        result && typeof result === 'object' && 'documentId' in result && typeof result.documentId === 'string'
          ? result.documentId
          : undefined;
      try {
        const tags = purgeTags({
          uid: context.uid,
          action: context.action,
          documentId: documentId ?? createdId,
          status: typeof params.status === 'string' ? params.status : undefined,
          hadPublished,
        });
        if (tags.length > 0) {
          await postPurge(tags, {
            fetch,
            url: process.env.SITE_PURGE_URL,
            secret: process.env.PURGE_SECRET,
          });
        }
      } catch (error) {
        strapi.log.error(error);
      }
      return result;
    });

    await bootstrapTrial(strapi);
  },
};
