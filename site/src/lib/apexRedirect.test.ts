import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { apexRedirectLocation, requestHostname } from "./apexRedirect.ts";

describe("apexRedirect", () => {
  it("strips the port from the Host header", () => {
    assert.equal(requestHostname("www.inzight.co.nz:443"), "www.inzight.co.nz");
    assert.equal(requestHostname("INZIGHT.CO.NZ"), "inzight.co.nz");
    assert.equal(requestHostname(null), "");
  });

  it("redirects www to the apex with path and query", () => {
    assert.equal(
      apexRedirectLocation("www.inzight.co.nz", "/projects", "?x=1"),
      "https://inzight.co.nz/projects?x=1",
    );
    assert.equal(
      apexRedirectLocation("www.inzight.co.nz:443", "/contact", ""),
      "https://inzight.co.nz/contact",
    );
  });

  it("leaves apex and staging hosts alone", () => {
    assert.equal(apexRedirectLocation("inzight.co.nz", "/projects", "?x=1"), null);
    assert.equal(apexRedirectLocation("site.inzight.co.nz", "/", ""), null);
    assert.equal(apexRedirectLocation("localhost:4321", "/", ""), null);
  });
});
