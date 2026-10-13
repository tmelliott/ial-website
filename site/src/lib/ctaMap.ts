import { geoEqualEarth, geoGraticule, geoPath } from "d3";

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

export type MapPlace = {
  label?: string | null;
  lat?: number | string | null;
  lon?: number | string | null;
};

function coordinate(value: number | string | null | undefined, min: number, max: number): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

/** Places complete enough to draw. A missing label or coordinate is skipped. */
export function mapPlaces(places: MapPlace[] | null | undefined): Partner[] {
  const partners: Partner[] = [];
  for (const place of places ?? []) {
    const lat = coordinate(place.lat, -90, 90);
    const lon = coordinate(place.lon, -180, 180);
    if (!place.label || lat === null || lon === null) continue;
    partners.push({ name: place.label, lat, lon });
  }
  return partners;
}

function round(path: string | null): string {
  return (path ?? "").replace(/(\d+\.\d+)/g, (n) => String(Math.round(Number(n))));
}

/** 15° graticule, drawn at 9% in the band. */
export function ctaGraticule(): string {
  const path = geoPath(ctaProjection());
  return round(path(geoGraticule().step([15, 15])()));
}

/** Projected position of each partner dot. */
export function ctaPartners(partners: Partner[]): { dots: [number, number][] } {
  const projection = ctaProjection();
  const dots: [number, number][] = [];
  for (const partner of partners) {
    const at = projection([partner.lon, partner.lat]);
    if (!at) continue;
    dots.push([Math.round(at[0]), Math.round(at[1])]);
  }
  return { dots };
}
