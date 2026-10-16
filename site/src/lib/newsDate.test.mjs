import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { secondsUntilNextAucklandMidnight } from "./newsDate.mjs";

describe("secondsUntilNextAucklandMidnight", () => {
  it("is 1800 seconds at 23:30 in both NZST and NZDT", () => {
    assert.equal(secondsUntilNextAucklandMidnight(new Date("2026-07-15T11:30:00.000Z")), 1800);
    assert.equal(secondsUntilNextAucklandMidnight(new Date("2026-01-15T10:30:00.000Z")), 1800);
  });

  it("is a full day when the instant is exactly Auckland midnight", () => {
    assert.equal(secondsUntilNextAucklandMidnight(new Date("2026-07-15T12:00:00.000Z")), 86400);
    assert.equal(secondsUntilNextAucklandMidnight(new Date("2026-01-15T11:00:00.000Z")), 86400);
  });
});
