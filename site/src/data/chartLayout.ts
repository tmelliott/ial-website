/** Compact region chart. Thinner than the stage-sized handoff chart, for the right-hand column. */

const ORIGIN_X = 640;
const ORIGIN_Y = 720;
const ORIGIN_PITCH = 12;
const ORIGIN_STRIDE = ORIGIN_PITCH * 3 + 10;

const PITCH = 8;
const GAP = 6;
const COLS = 3;
const RADIUS = 3.2;
const LABEL_HEIGHT = 18;

const NAMED = [
  { name: "Auckland", region: 1 },
  { name: "Wellington", region: 8 },
  { name: "Canterbury", region: 13 },
] as const;

export type ChartPoint = { x: number; y: number };

export type RegionChartModel = {
  width: number;
  height: number;
  radius: number;
  baseline: number;
  dots: ChartPoint[];
  labels: { name: string; x: number; y: number }[];
};

export function decodeStageSlot(x: number, y: number): { region: number; index: number } {
  const region = Math.floor((x - ORIGIN_X) / ORIGIN_STRIDE);
  const localX = x - (ORIGIN_X + region * ORIGIN_STRIDE);
  const col = Math.round((localX - ORIGIN_PITCH / 2) / ORIGIN_PITCH);
  const row = Math.round((ORIGIN_Y - ORIGIN_PITCH / 2 - y) / ORIGIN_PITCH);
  return { region, index: row * COLS + col };
}

/** Same slot order as the handoff chart, drawn on a tighter pitch. */
export function layoutRegionChart(ends: ChartPoint[]): RegionChartModel {
  const decoded = ends.map((end) => decodeStageSlot(end.x, end.y));
  const maxRow = decoded.reduce((max, slot) => Math.max(max, Math.floor(slot.index / COLS)), 0);
  const stride = COLS * PITCH + GAP;
  const regions = decoded.reduce((max, slot) => Math.max(max, slot.region), 0) + 1;
  const baseline = LABEL_HEIGHT + (maxRow + 1) * PITCH;
  const width = regions * stride - GAP;
  const height = baseline + 8;
  const dots = decoded.map((slot) => ({
    x: slot.region * stride + (slot.index % COLS) * PITCH + PITCH / 2,
    y: baseline - Math.floor(slot.index / COLS) * PITCH - PITCH / 2,
  }));
  const labels = NAMED.map((label) => ({
    name: label.name,
    x: label.region * stride + (COLS * PITCH) / 2,
    y: 12,
  }));
  return { width, height, radius: RADIUS, baseline, dots, labels };
}
