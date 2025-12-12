/**
 * computeDayKey(date, timezone, dayStartHour)
 *
 * Returns YYYY-MM-DD representing the "local day" for the given timestamp,
 * where local day is computed in the provided IANA timezone and shifted by
 * `dayStartHour` (hour at which a new day starts for the user).
 *
 * This implementation uses Intl.DateTimeFormat and formatToParts so we don't
 * rely on date-fns/date-fns-tz.
 *
 * Examples:
 *  computeDayKey(new Date(), "Asia/Kolkata", 4)
 *  computeDayKey("2025-12-12T00:30:00Z", "America/Los_Angeles", 3)
 */
export function computeDayKey(date = new Date(), timezone = "UTC", dayStartHour = 0) {
  // Ensure we have a Date
  const ts = date instanceof Date ? date : new Date(date);

  // Use Intl to get local date parts in the target timezone.
  // Use 'en-CA' (YYYY-MM-DD-friendly) for consistent month/day order but we'll use parts anyway.
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    hour12: false
  });

  const parts = dtf.formatToParts(ts);
  // extract numeric parts
  const partMap = {};
  for (const p of parts) {
    if (p.type !== "literal") partMap[p.type] = p.value;
  }

  // hour is in local timezone (0-23)
  const hour = partMap.hour ? parseInt(partMap.hour, 10) : 0;
  // build a Date object in the target timezone's local date by parsing the formatted date string
  // format: YYYY-MM-DD from en-CA + we have year,month,day
  const year = partMap.year;
  const month = partMap.month;
  const day = partMap.day;

  // Create a "local date" baseline string
  let localDateStr = `${year}-${month}-${day}`; // YYYY-MM-DD

  // Apply dayStartHour: if local hour < dayStartHour, we want the previous day
  if (hour < (dayStartHour || 0)) {
    // Compute previous day: create Date using UTC components to avoid timezone shifts
    // Since we only need YYYY-MM-DD, we can safely use JS Date with UTC to move date -1
    const utcDate = new Date(Date.UTC(+year, +month - 1, +day));
    utcDate.setUTCDate(utcDate.getUTCDate() - 1);
    const y = utcDate.getUTCFullYear();
    const m = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
    const d = String(utcDate.getUTCDate()).padStart(2, "0");
    localDateStr = `${y}-${m}-${d}`;
  }

  return localDateStr;
}
