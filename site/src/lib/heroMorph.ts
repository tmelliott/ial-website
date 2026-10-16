/** Scroll morph for the homepage map. Matches the hero handoff reference. */

const RED = [247, 60, 73] as const;

const DEG = Math.PI / 180;
const SCALE = 3531.996;
const TRANSLATE_X = 1061.532;
const TRANSLATE_Y = 446.108;
const LAT0 = -41 * DEG;
const SIN_LAT0 = Math.sin(LAT0);
const COS_LAT0 = Math.cos(LAT0);

export type HeroDot = [number, number, number, number, number, string];

export type HeroMotion = {
  dots: HeroDot[];
  r0: number;
  r1: number;
  dur: number;
};

/** Hero scrolled this far: play the morph toward wherever the chart sits. */
export function flightTrigger(heroHeight: number): number {
  return heroHeight * 0.3;
}

/** Scrolling back up, start the return before the outward tripwire. */
export function flightReturn(heroHeight: number): number {
  return heroHeight * 0.42;
}

const GRID_SPIN = 2;

/** Grid fades out by the outward tripwire, and back in from the return tripwire. */
export function gridFade(scrollY: number, heroHeight: number, returning: boolean): number {
  const trigger = flightTrigger(heroHeight);
  if (trigger <= 0) return 1;
  if (!returning) return clamp01(1 - scrollY / trigger);
  return clamp01((flightReturn(heroHeight) - scrollY) / trigger);
}

/** Turn starts on the first pixel of scroll and finishes as the grid fades. */
export function gridSpin(scrollY: number, heroHeight: number, returning: boolean): number {
  const span = returning ? flightReturn(heroHeight) : flightTrigger(heroHeight);
  if (span <= 0) return 0;
  return clamp01(scrollY / span) * GRID_SPIN;
}

/** News strip glides off the bottom across the opening of the scroll. */
const STRIP_EXIT = 0.32;

/**
 * News strip leaves through the bottom of the screen as scrolling starts.
 * `y` cancels the page moving up, then eases the strip down by its own height.
 */
export function stripExit(scrollY: number, heroHeight: number, travel: number): { opacity: number; y: number } {
  const covered = Math.max(0, scrollY);
  const span = heroHeight * STRIP_EXIT;
  const t = span <= 0 ? 0 : clamp01(covered / span);
  const gone = smoothstep(t);
  const y = Math.min(covered, Math.max(0, span)) + gone * Math.max(0, travel);
  return { opacity: 1 - gone, y };
}

export type Rgb = [number, number, number];

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function smoothstep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

export function parseHex(hex: string): Rgb {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
}

export function lerpColor(from: Rgb, amount: number): string {
  const t = clamp01(amount);
  const rgb = from.map((channel, index) => Math.round(channel + (RED[index] - channel) * t));
  return `rgb(${rgb.join(",")})`;
}

export type DotFrame = {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  opacity: number;
};

export function dotFrame(dot: HeroDot, progress: number, motion: Pick<HeroMotion, "r0" | "r1" | "dur">, reduceMotion: boolean): DotFrame {
  const [x0, y0, x1, y1, delay, hex] = dot;
  const amount = reduceMotion ? (progress > 0.5 ? 1 : 0) : smoothstep((progress - delay) / motion.dur);
  return {
    cx: x0 + (x1 - x0) * amount,
    cy: y0 + (y1 - y0) * amount,
    r: motion.r0 + (motion.r1 - motion.r0) * amount,
    fill: lerpColor(parseHex(hex), amount),
    opacity: progress > 0 ? 1 : 0,
  };
}

export function layerOpacity(progress: number, reduceMotion: boolean): {
  grat: number;
  early: number;
  land: number;
  chart: number;
  spin: number;
} {
  return {
    grat: clamp01(1 - progress * 1.4),
    early: clamp01(1 - progress * 4),
    land: clamp01(1 - progress * 1.6),
    chart: clamp01((progress - 0.85) * 7),
    spin: reduceMotion ? 0 : smoothstep(clamp01(progress / 0.72)) * 30,
  };
}

/** Orthographic projection. Centre 173.2°E 41°S, fitted to the 1440×1000 stage. */
export function project(lon: number, lat: number, spin: number): [number, number] | null {
  const lambda = lon * DEG - (173.2 - spin) * DEG;
  const phi = lat * DEG;
  const cosPhi = Math.cos(phi);
  if (SIN_LAT0 * Math.sin(phi) + COS_LAT0 * cosPhi * Math.cos(lambda) <= 0.02) return null;
  return [
    TRANSLATE_X + SCALE * cosPhi * Math.sin(lambda),
    TRANSLATE_Y - SCALE * (COS_LAT0 * Math.sin(phi) - SIN_LAT0 * cosPhi * Math.cos(lambda)),
  ];
}

/** User-space area the graticule is drawn into. The stage's viewBox is 1440 × 1000, but on
 * screens wider or taller than that the SVG shows more, so the grid is drawn past the
 * viewBox (the client widens this to the visible area; see `visibleBounds`). */
export type GridBounds = { x0: number; x1: number; y0: number; y1: number };
export const DEFAULT_GRID_BOUNDS: GridBounds = { x0: -480, x1: 1920, y0: -160, y1: 1160 };
const PAD = 40;

function inStage(point: [number, number] | null, b: GridBounds): point is [number, number] {
  return !!point && point[0] > b.x0 - PAD && point[0] < b.x1 + PAD && point[1] > b.y0 - PAD && point[1] < b.y1 + PAD;
}

function cross(lon: number, lat: number, spin: number, arm: number, bounds: GridBounds): string {
  const origin = project(lon, lat, spin);
  if (!inStage(origin, bounds)) return "";
  const north = project(lon, lat + 0.06, spin);
  const east = project(lon + 0.08, lat, spin);
  if (!north || !east) return "";
  const eastX = east[0] - origin[0];
  const eastY = east[1] - origin[1];
  const northX = north[0] - origin[0];
  const northY = north[1] - origin[1];
  const eastLength = Math.hypot(eastX, eastY);
  const northLength = Math.hypot(northX, northY);
  return (
    `M${(origin[0] - (eastX / eastLength) * arm).toFixed(1)} ${(origin[1] - (eastY / eastLength) * arm).toFixed(1)}` +
    `L${(origin[0] + (eastX / eastLength) * arm).toFixed(1)} ${(origin[1] + (eastY / eastLength) * arm).toFixed(1)}` +
    `M${(origin[0] - (northX / northLength) * arm).toFixed(1)} ${(origin[1] - (northY / northLength) * arm).toFixed(1)}` +
    `L${(origin[0] + (northX / northLength) * arm).toFixed(1)} ${(origin[1] + (northY / northLength) * arm).toFixed(1)}`
  );
}

function line(spin: number, points: [number, number][], bounds: GridBounds): string {
  let d = "";
  let pen = false;
  for (const [lon, lat] of points) {
    const point = project(lon, lat, spin);
    if (inStage(point, bounds)) {
      d += `${pen ? "L" : "M"}${point[0].toFixed(1)} ${point[1].toFixed(1)}`;
      pen = true;
    } else pen = false;
  }
  return d;
}

/** Graticule for a polar-axis spin, in degrees east of the rest position. */
export function graticulePaths(spin: number, bounds: GridBounds = DEFAULT_GRID_BOUNDS): { major: string; ticks: string } {
  let major = "";
  for (let lon = 110; lon <= 240; lon += 5) {
    const points: [number, number][] = [];
    for (let lat = -70; lat <= -5; lat++) points.push([lon, lat]);
    major += line(spin, points, bounds);
  }
  for (let lat = -70; lat <= -5; lat += 5) {
    const points: [number, number][] = [];
    for (let lon = 100; lon <= 250; lon++) points.push([lon, lat]);
    major += line(spin, points, bounds);
  }
  let ticks = "";
  for (let lon = 110; lon <= 240; lon++) {
    for (let lat = -65; lat <= -10; lat++) {
      if (lon % 5 === 0 && lat % 5 === 0) continue;
      ticks += cross(lon, lat, spin, 3.5, bounds);
    }
  }
  return { major, ticks };
}
