import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PEOPLE_PER_DOT, regionsWithDots } from "./nzRegions.ts";

describe("nz region dots", () => {
  it("rounds to 200 dots of 25,000 people", () => {
    const regions = regionsWithDots();
    assert.equal(PEOPLE_PER_DOT, 25_000);
    assert.equal(regions.length, 16);
    assert.equal(
      regions.reduce((sum, region) => sum + region.dots, 0),
      200,
    );
    assert.equal(regions.find((region) => region.name === "Auckland")?.dots, 66);
    assert.equal(regions[0]?.name, "Northland");
    assert.equal(regions.at(-1)?.name, "Southland");
  });
});
