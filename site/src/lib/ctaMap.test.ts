import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapPlaces } from "./ctaMap.ts";

describe("map places", () => {
  it("keeps places that have a label, latitude, and longitude", () => {
    const partners = mapPlaces([
      { label: "Sydney", lat: -33.87, lon: 151.21 },
      { label: "Melbourne", lat: "-37.81", lon: "144.96" },
      { label: "No place" },
      { label: "Half", lat: -36.85 },
      { label: "Empty", lat: "", lon: "" },
      { label: "Null island", lat: null, lon: null },
      { label: "Out of range", lat: 120, lon: 10 },
    ]);
    assert.deepEqual(partners, [
      { name: "Sydney", lat: -33.87, lon: 151.21 },
      { name: "Melbourne", lat: -37.81, lon: 144.96 },
    ]);
  });
});
