// Pre-computes the land dot grid for the `map` CTA band.
// Run from site/: node --experimental-strip-types scripts/build-cta-map.ts
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { geoContains } from "d3";
import { feature } from "topojson-client";
import { CTA_MAP_HEIGHT, CTA_MAP_WIDTH, ctaProjection } from "../src/lib/ctaMap.ts";

const require = createRequire(import.meta.url);
const topology = JSON.parse(readFileSync(require.resolve("world-atlas/land-50m.json"), "utf8"));
const land = feature(topology, topology.objects.land);
const projection = ctaProjection();

const PITCH = 6;
const dots: [number, number][] = [];
const home: [number, number][] = [];

for (let y = 2; y < CTA_MAP_HEIGHT; y += PITCH) {
  for (let x = 2; x < CTA_MAP_WIDTH; x += PITCH) {
    const lonLat = projection.invert?.([x, y]);
    if (!lonLat || !Number.isFinite(lonLat[0])) continue;
    const back = projection(lonLat);
    if (!back || Math.abs(back[0] - x) > 0.5 || Math.abs(back[1] - y) > 0.5) continue;
    if (!geoContains(land, lonLat)) continue;
    const [lon, lat] = lonLat;
    const aotearoa = lat < -33 && lat > -48 && (lon > 165 || lon < -176);
    (aotearoa ? home : dots).push([x, y]);
  }
}

writeFileSync(new URL("../src/data/ctaMap.json", import.meta.url), JSON.stringify({ land: dots, home }));
console.log(`land ${dots.length}, home ${home.length}`);
