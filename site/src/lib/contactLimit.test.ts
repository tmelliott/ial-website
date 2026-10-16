import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clientIp, createContactLimiter } from "./contactLimit.ts";

describe("contact limits", () => {
  it("reads the address nginx appended, not a spoofed prefix", () => {
    assert.equal(
      clientIp({ forwardedFor: "1.2.3.4, 203.0.113.8", realIp: null }),
      "203.0.113.8",
    );
    assert.equal(clientIp({ forwardedFor: "1.2.3.4", realIp: "198.51.100.10" }), "198.51.100.10");
    assert.equal(clientIp({ forwardedFor: "not an ip", realIp: null }), "");
  });

  it("stops one address after five messages and everyone after the global cap", () => {
    const allow = createContactLimiter(5, 8);
    const now = 1_000_000;
    for (let i = 0; i < 5; i += 1) assert.equal(allow("203.0.113.1", now + i), true);
    assert.equal(allow("203.0.113.1", now + 6), false);
    assert.equal(allow("203.0.113.2", now + 7), true);
    assert.equal(allow("203.0.113.2", now + 8), true);
    assert.equal(allow("203.0.113.2", now + 9), true);
    assert.equal(allow("203.0.113.3", now + 10), false);
  });
});
