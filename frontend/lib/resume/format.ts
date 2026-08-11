/**
 * Locale-aware date range formatting. `lang` drives month names and
 * ordering the same way `Intl.DateTimeFormat` would for any other
 * user-facing date in a multi-language UI.
 */
function formatDate(isoDate: string, lang: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate; // defensive: show raw value rather than throw
  return new Intl.DateTimeFormat(lang, { month: "short", year: "numeric" }).format(date);
}

/**
 * "Present" is itself user-facing text — swap this for a `localize()`
 * lookup against a small dictionary if the project's `@/lib/locale`
 * conventions expect all copy to flow through locale fields rather than
 * hardcoded per-language strings.
 */
const PRESENT_LABEL: Partial<Record<string, string>> = {
  en: "Present",
  es: "Presente",
  fr: "Présent",
  de: "Heute",
};

export function formatDateRange(startDate: string, endDate: string | undefined, lang: string): string {
  const start = formatDate(startDate, lang);
  const end = endDate ? formatDate(endDate, lang) : (PRESENT_LABEL[lang] ?? PRESENT_LABEL.en);
  return `${start} – ${end}`;
}
