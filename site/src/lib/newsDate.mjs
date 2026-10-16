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

/**
 * Seconds until the next 00:00 in Pacific/Auckland.
 * An instant that is exactly midnight returns a full day.
 */
export function secondsUntilNextAucklandMidnight(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-NZ", {
    timeZone: "Pacific/Auckland",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(now);
  const value = (type) => Number(parts.find((part) => part.type === type)?.value ?? "0");
  const hour = value("hour");
  const minute = value("minute");
  const second = value("second");
  if (hour === 0 && minute === 0 && second === 0 && now.getMilliseconds() === 0) return 86400;
  return 86400 - (hour * 3600 + minute * 60 + second);
}

/** Published news whose date is today or earlier. */
export function liveNewsParams(params = {}) {
  return {
    ...params,
    "where[_status][equals]": "published",
    "where[date][less_than]": nextAucklandDay(),
  };
}
