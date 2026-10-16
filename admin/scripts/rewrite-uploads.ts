import { createStrapi } from "@strapi/strapi";
import { rewriteUploads } from "../src/lib/rewriteUploads";

const app = await createStrapi().load();
try {
  await rewriteUploads(app as unknown as Parameters<typeof rewriteUploads>[0]);
} finally {
  await app.destroy();
}
