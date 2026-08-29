export function formatProjectDateRange(startDate?: string, endDate?: string) {
  if (!startDate) return null;
  const fmt = (iso: string) => new Date(iso).getFullYear();
  return endDate ? `${fmt(startDate)} — ${fmt(endDate)}` : `${fmt(startDate)}`;
}

/**
 * Formats a date-only ISO string ("2026-08-01") for display, e.g. "August 1,
 * 2026". Forces UTC so the date-only string doesn't shift a day backward in
 * timezones behind UTC (new Date("2026-08-01") is midnight UTC, and the
 * default local-timezone formatting would render it as the previous day
 * there).
 */
export function formatBlogDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
