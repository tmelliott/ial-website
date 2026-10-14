import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { expectedTurnstileHostnames, turnstileSecret, turnstileSiteKey, verifyTurnstile } from "./turnstile.ts";

const previous = {
  site: process.env.TURNSTILE_SITE_KEY,
  secret: process.env.TURNSTILE_SECRET_KEY,
  hostnames: process.env.TURNSTILE_HOSTNAMES,
  nodeEnv: process.env.NODE_ENV,
};

afterEach(() => {
  restore("TURNSTILE_SITE_KEY", previous.site);
  restore("TURNSTILE_SECRET_KEY", previous.secret);
  restore("TURNSTILE_HOSTNAMES", previous.hostnames);
  restore("NODE_ENV", previous.nodeEnv);
});

function restore(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

describe("turnstile", () => {
  it("uses the Cloudflare test keys outside production", async () => {
    delete process.env.TURNSTILE_SITE_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;
    process.env.NODE_ENV = "development";
    assert.equal(turnstileSiteKey(), "1x00000000000000000000AA");
    assert.equal(turnstileSecret(), "1x0000000000000000000000000000000AA");
    const ok = await verifyTurnstile("XXXX.DUMMY.TOKEN.XXXX", "", async () => {
      return new Response(JSON.stringify({ success: true, action: "test", hostname: "localhost" }));
    });
    assert.equal(ok, true);
  });

  it("stays closed in production when the keys are missing", () => {
    delete process.env.TURNSTILE_SITE_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;
    process.env.NODE_ENV = "production";
    assert.equal(turnstileSiteKey(), "");
    assert.equal(turnstileSecret(), "");
  });

  it("accepts a production token only for the contact action on an allowed hostname", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.TURNSTILE_HOSTNAMES;
    process.env.TURNSTILE_SECRET_KEY = "real-secret";
    assert.deepEqual([...expectedTurnstileHostnames()], ["site.inzight.co.nz"]);
    const calls: { url: string; body: string }[] = [];
    const ok = await verifyTurnstile("token", "203.0.113.5", async (url, init) => {
      calls.push({ url: String(url), body: String(init?.body) });
      return new Response(
        JSON.stringify({ success: true, action: "contact", hostname: "site.inzight.co.nz" }),
      );
    });
    assert.equal(ok, true);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /siteverify$/);
    assert.match(calls[0].body, /secret=real-secret/);
    assert.match(calls[0].body, /response=token/);
    assert.match(calls[0].body, /remoteip=203.0.113.5/);

    const wrongHost = await verifyTurnstile("token", "", async () => {
      return new Response(JSON.stringify({ success: true, action: "contact", hostname: "evil.example" }));
    });
    const wrongAction = await verifyTurnstile("token", "", async () => {
      return new Response(
        JSON.stringify({ success: true, action: "login", hostname: "site.inzight.co.nz" }),
      );
    });
    const rejected = await verifyTurnstile("token", "", async () => {
      return new Response(JSON.stringify({ success: false }));
    });
    assert.equal(wrongHost, false);
    assert.equal(wrongAction, false);
    assert.equal(rejected, false);
    assert.equal(await verifyTurnstile("", "", async () => new Response("")), false);
  });

  it("drops localhost from the production hostname allowlist", () => {
    process.env.NODE_ENV = "production";
    process.env.TURNSTILE_HOSTNAMES = "localhost, site.inzight.co.nz, 127.0.0.1";
    assert.deepEqual([...expectedTurnstileHostnames()], ["site.inzight.co.nz"]);
  });
});
