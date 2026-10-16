import assert from "node:assert/strict";
import { describe, it } from "node:test";
import morph from "./morph5.json" with { type: "json" };
import { decodeStageSlot, layoutRegionChart } from "./chartLayout.ts";

describe("region chart layout", () => {
  it("keeps every map dot's chart slot, on a tighter pitch", () => {
    const ends = morph.dots.map((dot) => ({ x: dot[2], y: dot[3] }));
    const chart = layoutRegionChart(ends);
    const keys = ends.map((end) => {
      const slot = decodeStageSlot(end.x, end.y);
      return `${slot.region}:${slot.index}`;
    });
    assert.equal(new Set(keys).size, ends.length);
    assert.equal(chart.dots.length, 200);
    assert.ok(chart.width < 520);
    assert.ok(chart.height < 230);
    assert.ok(chart.radius < morph.r1);
    const auckland = chart.labels.find((label) => label.name === "Auckland");
    const canterbury = chart.labels.find((label) => label.name === "Canterbury");
    assert.ok(auckland && canterbury && auckland.x < canterbury.x);
  });
});
