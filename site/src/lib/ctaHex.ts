/**
 * Cells for the `hexheat` CTA band (design-system/components/CTAHex).
 * A flat-topped hex grid across the whole 1440 × 384 band: empty cells are faint
 * outlines that fade in from black on the left; filled cells come from a smooth
 * field, gated left to right, coloured along the data ramp up to brand red.
 * Deterministic, so the art is identical on every render.
 */
export const CTA_HEX_WIDTH = 1440;
export const CTA_HEX_HEIGHT = 384;

/** data-1 … data-4 from design-system/tokens.json (graphite → brand red). */
export const HEX_RAMP = ["#3c3c40", "#6a3a40", "#b3202c", "#f73c49"] as const;

const RADIUS = 40;
const SEAM = 1.6;
const OUTLINE_MAX = 0.09;
const OUTLINE_IN: [number, number] = [0, 420];
const FILL_IN: [number, number] = [300, 900];
const GAIN = 1.15;
const THRESHOLD = 0.03;
const PHASE = 2.1;
const SQRT3 = Math.sqrt(3);

export type HexOutline = { d: string; opacity: number };
export type HexFill = { d: string; fill: string; opacity: number };

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function hexPath(cx: number, cy: number, r: number): string {
  const points = Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${points.join("L")}Z`;
}

function hex(n: number): string {
  return Math.round(n).toString(16).padStart(2, "0");
}

/** Colour at t ∈ [0, 1] along HEX_RAMP. */
export function rampColour(t: number): string {
  const x = Math.min(1, Math.max(0, t)) * (HEX_RAMP.length - 1);
  const i = Math.min(HEX_RAMP.length - 2, Math.floor(x));
  const f = x - i;
  const [a, b] = [HEX_RAMP[i], HEX_RAMP[i + 1]].map((c) => [1, 3, 5].map((j) => parseInt(c.slice(j, j + 2), 16)));
  return `#${a.map((v, k) => hex(v + (b[k] - v) * f)).join("")}`;
}

/** A broad, smooth field so neighbouring cells blend rather than step. */
function field(x: number, y: number): number {
  const f =
    0.55 +
    0.28 * Math.sin(x / 230 + 0.9 + PHASE) * Math.cos(y / 140 - 0.5) +
    0.22 * Math.sin((x - y) / 300 + PHASE);
  return Math.min(1, Math.max(0, (f - 0.15) / 0.85));
}

export function ctaHexCells(): { outlines: HexOutline[]; fills: HexFill[] } {
  const outlines: HexOutline[] = [];
  const fills: HexFill[] = [];
  const r = RADIUS - SEAM / 2;
  for (let c = 0; c * 1.5 * RADIUS <= CTA_HEX_WIDTH + RADIUS; c++) {
    const x = c * 1.5 * RADIUS;
    const offset = c % 2 ? (SQRT3 * RADIUS) / 2 : 0;
    for (let row = -1; row * SQRT3 * RADIUS + offset <= CTA_HEX_HEIGHT + RADIUS; row++) {
      const y = row * SQRT3 * RADIUS + offset;
      const v = Math.min(1, field(x, y) * smoothstep(...FILL_IN, x) * GAIN);
      if (v > THRESHOLD) {
        fills.push({ d: hexPath(x, y, r), fill: rampColour(0.82 * v ** 1.15), opacity: +(0.18 + 0.67 * v).toFixed(2) });
      } else {
        const opacity = OUTLINE_MAX * smoothstep(...OUTLINE_IN, x);
        if (opacity > 0.004) outlines.push({ d: hexPath(x, y, r), opacity: +opacity.toFixed(3) });
      }
    }
  }
  return { outlines, fills };
}
