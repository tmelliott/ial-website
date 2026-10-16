/**
 * Region totals used to build the hero chart.
 * These are approximate usually-resident counts from the handoff build, not verified Census figures.
 * Each region's dot count is its total divided by 25,000, with largest-remainder rounding.
 */
export const PEOPLE_PER_DOT = 25_000;

export const NZ_REGIONS: { name: string; people: number }[] = [
  { name: "Northland", people: 194_000 },
  { name: "Auckland", people: 1_656_000 },
  { name: "Waikato", people: 499_000 },
  { name: "Bay of Plenty", people: 334_000 },
  { name: "Gisborne", people: 51_000 },
  { name: "Hawke's Bay", people: 175_000 },
  { name: "Taranaki", people: 125_000 },
  { name: "Manawatū-Whanganui", people: 251_000 },
  { name: "Wellington", people: 520_000 },
  { name: "Tasman", people: 57_000 },
  { name: "Nelson", people: 52_000 },
  { name: "Marlborough", people: 49_000 },
  { name: "West Coast", people: 32_000 },
  { name: "Canterbury", people: 655_000 },
  { name: "Otago", people: 241_000 },
  { name: "Southland", people: 100_000 },
];

export function dotCounts(people: number[], perDot = PEOPLE_PER_DOT): number[] {
  const raw = people.map((count) => count / perDot);
  const counts = raw.map((value) => Math.floor(value));
  const target = Math.round(people.reduce((sum, count) => sum + count, 0) / perDot);
  const extra = target - counts.reduce((sum, count) => sum + count, 0);
  raw
    .map((value, index) => [value - Math.floor(value), index] as const)
    .sort((a, b) => b[0] - a[0] || a[1] - b[1])
    .slice(0, Math.max(0, extra))
    .forEach(([, index]) => {
      counts[index] += 1;
    });
  return counts;
}

export function regionsWithDots(): { name: string; people: number; dots: number }[] {
  const counts = dotCounts(NZ_REGIONS.map((region) => region.people));
  return NZ_REGIONS.map((region, index) => ({ ...region, dots: counts[index] }));
}
