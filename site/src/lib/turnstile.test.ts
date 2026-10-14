import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { turnstileSecret, turnstileSiteKey, verifyTurnstile } from "./turnstile.ts";

const previous = {
  site: process.env.TURNSTILE_SITE_KEY,
  secret: process.env.TURNSTILE_SECRET_KEY,
  nodeEnv: process.env.NODE_ENV,
};

afterEach(() => {
  restore("TURNSTILE_SITE_KEY", previous.site);
  restore("TURNSTILE_SECRET_KEY", previous.secret);
  restore("NODE_ENV", previous.nodeEnv);
});

function restore(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

describe("turnstile", () => {
  it("uses the Cloudflare test keys outside production", () => {
    delete process.env.TURNSTILE_SITE_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;
    process.env.NODE_ENV = "development";
    assert.equal(turnstileSiteKey(), "1x00000000000000000000AA");
    assert.equal(turnstileSecret(), "1x0000000000000000000000000000000AA");
  });

  it("stays closed in production when the keys are missing", () => {
    delete process.env.TURNSTILE_SITE_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;
    process.env.NODE_ENV = "production";
    assert.equal(turnstileSiteKey(), "");
    assert.equal(turnstileSecret(), "");
  });

  it("accepts a token only when siteverify says success", async () => {
    process.env.NODE_ENV = "production";
    process.env.TURNSTILE_SECRET_KEY = "real-secret";
    const calls: { url: string; body: string }[] = [];
    const ok = await verifyTurnstile("token", "203.0.113.5", async (url, init) => {
      calls.push({ url: String(url), body: String(init?.body) });
      return new Response(JSON.stringify({ success: true }));
    });
    assert.equal(ok, true);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /siteverify$/);
    assert.match(calls[0].body, /secret=real-secret/);
    assert.match(calls[0].body, /response=token/);
    assert.match(calls[0].body, /remoteip=203.0.113.5/);

    const rejected = await verifyTurnstile("token", "", async () => {
      return new Response(JSON.stringify({ success: false }));
    });
    assert.equal(rejected, false);
    assert.equal(await verifyTurnstile("", "", async () => new Response("")), false);
  });
});
