import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { ctaHexCells, HEX_RAMP, rampColour } from "./ctaHex.ts";

const tokens = JSON.parse(readFileSync(new URL("../../../design-system/tokens.json", import.meta.url), "utf8"));

function token(name: string): string {
  const all = tokens.color.tokens as { name: string; value: string }[];
  const value = all.find((t) => t.name === name)?.value ?? "";
  const alias = /^\{(.+)\}$/.exec(value);
  return alias ? token(alias[1]) : value.toLowerCase();
}

describe("hexheat CTA cells", () => {
  const { outlines, fills } = ctaHexCells();

  it("uses data-1 … data-4 as its ramp", () => {
    assert.deepEqual([...HEX_RAMP], ["data-1", "data-2", "data-3", "data-4"].map(token));
    assert.equal(rampColour(0), HEX_RAMP[0]);
    assert.equal(rampColour(1), HEX_RAMP[3]);
  });

  it("is deterministic", () => {
    assert.deepEqual(ctaHexCells(), { outlines, fills });
  });

  it("fades in from black: nothing is drawn at the far left", () => {
    const leftEdge = (d: string) => Number(/^M(-?[\d.]+)/.exec(d)![1]) - 80;
    assert.ok(outlines.every((cell) => leftEdge(cell.d) > 0 || cell.opacity < 0.01));
    assert.ok(fills.every((cell) => leftEdge(cell.d) > 220));
  });

  it("keeps outlines faint and fills short of pale pink", () => {
    assert.ok(outlines.every((cell) => cell.opacity <= 0.09));
    assert.ok(fills.every((cell) => cell.opacity <= 0.85));
    assert.ok(fills.length > 40, "expected a good share of red cells");
  });
});
