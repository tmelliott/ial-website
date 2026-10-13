import { geoEqualEarth, geoGraticule, geoInterpolate, geoPath } from "d3";

/**
 * Projection for the `map` CTA band (design-system/components/CTA).
 * Equal Earth centred on 160°W, fitted so 108°E–68°W and 47°S–58°N sit
 * inside a 1440 × 384 band. Shared by the build script and the component.
 */
export const CTA_MAP_WIDTH = 1440;
export const CTA_MAP_HEIGHT = 384;
export const HOME: [number, number] = [174.76, -36.85];

export function ctaProjection() {
  return geoEqualEarth().rotate([160, 0]).scale(186).translate([1030, 207]).precision(0.2);
}

export type Partner = { name: string; lon: number; lat: number };

function round(path: string | null): string {
  return (path ?? "").replace(/(\d+\.\d+)/g, (n) => String(Math.round(Number(n))));
}

/** 15° graticule, drawn at 9% in the band. */
export function ctaGraticule(): string {
  const path = geoPath(ctaProjection());
  return round(path(geoGraticule().step([15, 15])()));
}

/** Great-circle arc from Aotearoa to each partner, plus the partner's projected position. */
export function ctaPartners(partners: Partner[]): { arcs: string; dots: [number, number][] } {
  const projection = ctaProjection();
  const path = geoPath(projection);
  let arcs = "";
  const dots: [number, number][] = [];
  for (const partner of partners) {
    const end: [number, number] = [partner.lon, partner.lat];
    const at = projection(end);
    if (!at) continue;
    dots.push([Math.round(at[0]), Math.round(at[1])]);
    const interpolate = geoInterpolate(HOME, end);
    const coordinates = Array.from({ length: 49 }, (_, i) => interpolate(i / 48));
    arcs += round(path({ type: "LineString", coordinates }));
  }
  return { arcs, dots };
}
