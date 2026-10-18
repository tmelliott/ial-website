import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cloudflareBeacon, productionBeacon } from "./webAnalytics.ts";

describe("cloudflareBeacon", () => {
  it("stays off when no token is configured", () => {
    assert.equal(cloudflareBeacon(undefined), null);
    assert.equal(cloudflareBeacon(""), null);
    assert.equal(cloudflareBeacon("   "), null);
  });

  it("emits the cookieless Cloudflare beacon for a site token", () => {
    const beacon = cloudflareBeacon("a1b2c3d4e5f67890abcd");
    assert.deepEqual(beacon, {
      src: "https://static.cloudflareinsights.com/beacon.min.js",
      payload: JSON.stringify({ token: "a1b2c3d4e5f67890abcd" }),
    });
  });

  it("rejects tokens that are not a single opaque id", () => {
    assert.equal(cloudflareBeacon("short"), null);
    assert.equal(cloudflareBeacon('token"></script>'), null);
    assert.equal(cloudflareBeacon('{"token":"a1b2c3d4e5f67890abcd"}'), null);
  });

  it("sends the site beacon only from production builds", () => {
    assert.equal(productionBeacon(false), null);
    assert.deepEqual(productionBeacon(true), {
      src: "https://static.cloudflareinsights.com/beacon.min.js",
      payload: JSON.stringify({ token: "0d8965ed31f042a886cb77a92c5efafa" }),
    });
  });
});
