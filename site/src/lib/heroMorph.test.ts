import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  dotFrame,
  flightReturn,
  flightTrigger,
  gridFade,
  gridSpin,
  graticulePaths,
  layerOpacity,
  project,
  smoothstep,
} from "./heroMorph.ts";

function crossMark(lon: number, lat: number, arm: number): string {
  const origin = project(lon, lat, 0);
  const east = project(lon + 0.08, lat, 0);
  assert.ok(origin && east);
  const eastX = east[0] - origin[0];
  const eastY = east[1] - origin[1];
  const eastLength = Math.hypot(eastX, eastY);
  return `M${(origin[0] - (eastX / eastLength) * arm).toFixed(1)} ${(origin[1] - (eastY / eastLength) * arm).toFixed(1)}`;
}

describe("hero morph", () => {
  it("starts the outward morph at 30% and the return a little earlier", () => {
    assert.equal(smoothstep(0), 0);
    assert.equal(smoothstep(1), 1);
    assert.equal(smoothstep(0.5), 0.5);
    assert.equal(flightTrigger(1000), 300);
    assert.equal(flightReturn(1000), 420);
    assert.ok(flightReturn(800) > flightTrigger(800));
  });

  it("turns the grid from the first pixel and fades it by the tripwires", () => {
    assert.equal(gridFade(0, 1000, false), 1);
    assert.equal(gridFade(300, 1000, false), 0);
    assert.equal(gridFade(150, 1000, false), 0.5);
    assert.equal(gridSpin(0, 1000, false), 0);
    assert.ok(gridSpin(10, 1000, false) > 0);
    assert.equal(gridSpin(300, 1000, false), 2);

    assert.equal(gridFade(420, 1000, true), 0);
    assert.equal(gridFade(120, 1000, true), 1);
    assert.equal(gridSpin(420, 1000, true), 2);
    assert.equal(gridSpin(0, 1000, true), 0);
  });

  it("places the projection centre on the fitted translate", () => {
    const centre = project(173.2, -41, 0);
    assert.ok(centre);
    assert.ok(Math.abs(centre[0] - 1061.532) < 0.01);
    assert.ok(Math.abs(centre[1] - 446.108) < 0.01);
  });

  it("draws a graticule at rest and after the eastward spin", () => {
    const rest = graticulePaths(0);
    const spun = graticulePaths(12);
    assert.ok(rest.major.length > 100);
    assert.ok(rest.ticks.length > 100);
    assert.notEqual(rest.major, spun.major);
    const onLine = project(175, -41, 0);
    assert.ok(onLine);
    assert.ok(rest.major.includes(`${onLine[0].toFixed(1)} ${onLine[1].toFixed(1)}`));
    assert.ok(rest.ticks.includes(crossMark(175, -41, 3.5)));
    assert.ok(rest.ticks.includes(crossMark(173, -41, 3.5)));
    assert.ok(!rest.ticks.includes(crossMark(175, -40, 3.5)));
  });

  it("flies a dot from its cell to the chart, and jumps under reduced motion", () => {
    const dot = [10, 20, 110, 220, 0, "#3c3c40"] as const;
    const motion = { r0: 2.6, r1: 4.6, dur: 0.45 };
    const start = dotFrame([...dot], 0, motion, false);
    assert.equal(start.opacity, 0);
    assert.equal(start.cx, 10);
    assert.equal(start.r, 2.6);

    const middle = dotFrame([...dot], 0.225, motion, false);
    assert.equal(middle.cx, 60);
    assert.equal(middle.cy, 120);
    assert.equal(middle.opacity, 1);

    const end = dotFrame([...dot], 1, motion, false);
    assert.equal(end.cx, 110);
    assert.equal(end.cy, 220);
    assert.equal(end.r, 4.6);
    assert.equal(end.fill, "rgb(247,60,73)");

    assert.equal(dotFrame([...dot], 0.5, motion, true).cx, 10);
    assert.equal(dotFrame([...dot], 0.51, motion, true).cx, 110);
  });

  it("fades the map before the chart caption appears, without spinning for reduced motion", () => {
    const early = layerOpacity(0, false);
    assert.equal(early.land, 1);
    assert.equal(early.chart, 0);
    assert.equal(early.spin, 0);

    const late = layerOpacity(1, false);
    assert.equal(late.land, 0);
    assert.equal(late.chart, 1);
    assert.equal(late.spin, 30);
    assert.equal(layerOpacity(1, true).spin, 0);
  });
});
