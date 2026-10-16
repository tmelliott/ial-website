import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const root = new URL(".", import.meta.url);

describe("compose stack", () => {
  it("keeps postgres unprofiled and splits dev and built apps", async () => {
    const stack = await readFile(new URL("./compose.stack.yml", root), "utf8");
    assert.match(stack, /image: postgres:16/);
    assert.match(stack, /5434:5432/);
    assert.match(stack, /POSTGRES_DB: strapi/);
    assert.match(stack, /pg_isready/);
    assert.equal(stack.includes("profiles:") > 0, true);

    const postgres = stack.slice(stack.indexOf("  postgres:"), stack.indexOf("  strapi"));
    assert.equal(postgres.includes("profiles:"), false);

    assert.match(stack, /profiles: \["dev"\]/);
    assert.match(stack, /profiles: \["built"\]/);
    assert.match(stack, /npm", "run", "develop"/);
    assert.match(stack, /rm -f \.astro\/dev\.json && exec npm run dev -- --host 0\.0\.0\.0 --port 4321/);
    assert.match(stack, /STRAPI_INTERNAL_URL: http:\/\/strapi/);
    assert.match(stack, /STRAPI_URL: http:\/\/localhost:1337/);
    for (const name of [
      "CLIENT_URL",
      "PREVIEW_SECRET",
      "STRAPI_API_TOKEN",
      "PURGE_SECRET",
      "SITE_PURGE_URL",
      "GMAIL_EMAIL_HOST",
      "GMAIL_EMAIL_PORT",
      "GMAIL_EMAIL_ADDRESS",
      "GMAIL_EMAIL_PASSWORD",
    ]) {
      assert.equal(stack.includes(name), true, name);
    }

    const built = stack.slice(stack.indexOf("profiles: [\"built\"]"));
    assert.equal(built.includes("./admin:/"), false);
    assert.equal(built.includes("./site:/"), false);
    assert.equal((stack.match(/^\s+site(-dev)?:/gm) ?? []).length, 2);
  });

  it("builds the Strapi and Astro images for start, not develop", async () => {
    const admin = await readFile(new URL("./admin/Dockerfile", root), "utf8");
    const site = await readFile(new URL("./site/Dockerfile", root), "utf8");
    assert.match(admin, /npm run build/);
    assert.match(admin, /CMD \["npm", "run", "start"\]/);
    assert.equal(admin.includes('CMD ["npm", "run", "develop"]'), false);
    assert.match(site, /npm run build/);
    assert.match(site, /node", "\.\/dist\/server\/entry\.mjs"/);
    assert.match(site, /HOST=0\.0\.0\.0/);
    assert.match(site, /PORT=4321/);
  });
});
