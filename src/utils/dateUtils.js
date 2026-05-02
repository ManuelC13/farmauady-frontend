export function parseUtcDate(dateStr) {
  if (!dateStr) return new Date(NaN);
  const normalized = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
  return new Date(normalized);
}
