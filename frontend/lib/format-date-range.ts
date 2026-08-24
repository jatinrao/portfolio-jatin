export function formatProjectDateRange(startDate?: string, endDate?: string) {
  if (!startDate) return null;
  const fmt = (iso: string) => new Date(iso).getFullYear();
  return endDate ? `${fmt(startDate)} — ${fmt(endDate)}` : `${fmt(startDate)}`;
}
