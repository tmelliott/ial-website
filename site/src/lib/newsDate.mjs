/** Calendar day in New Zealand, where a news date becomes live. */
export function todayInAuckland(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Pacific/Auckland",
  }).format(now);
}

/** Payload stores a date-only field at noon UTC, so compare with the next day. */
export function nextAucklandDay(today = todayInAuckland()) {
  const [year, month, day] = today.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

export function isLiveNewsDate(iso, today = todayInAuckland()) {
  return typeof iso === "string" && iso.slice(0, 10) <= today;
}

/** Published news whose date is today or earlier. */
export function liveNewsParams(params = {}) {
  return {
    ...params,
    "where[_status][equals]": "published",
    "where[date][less_than]": nextAucklandDay(),
  };
}
