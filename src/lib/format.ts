/** Display formatting shared by the analysis engine and the UI. */

const COUNT_FORMAT = new Intl.NumberFormat("en-US");

const SHORT_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatCount(value: number): string {
  return COUNT_FORMAT.format(Math.round(value));
}

/** 128400 → "128.4K", 11240 → "11.2K", 4020 → "4,020" */
export function formatReach(value: number): string {
  const magnitude = Math.abs(value);
  if (magnitude >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (magnitude >= 10_000) return `${(value / 1000).toFixed(1)}K`;
  return formatCount(value);
}

/** Rates are fractions: 0.0129 → "1.29%" */
export function formatPercent(rate: number, digits = 2): string {
  return `${(rate * 100).toFixed(digits)}%`;
}

export function formatRatio(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(1)}×`;
}

export function formatDate(iso: string): string {
  return SHORT_DATE_FORMAT.format(new Date(iso));
}

export function formatDateRange(from: string, to: string): string {
  const start = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T00:00:00.000Z`);
  const startYear = start.getUTCFullYear();
  const endYear = end.getUTCFullYear();
  const startLabel = SHORT_DATE_FORMAT.format(start);
  const endLabel = SHORT_DATE_FORMAT.format(end);
  return startYear === endYear
    ? `${startLabel} – ${endLabel}, ${endYear}`
    : `${startLabel}, ${startYear} – ${endLabel}, ${endYear}`;
}

export function pluralize(count: number, word: string): string {
  const plural = /[^aeiou]y$/.test(word)
    ? `${word.slice(0, -1)}ies`
    : /(s|x|z|ch|sh)$/.test(word)
      ? `${word}es`
      : `${word}s`;
  return `${count} ${count === 1 ? word : plural}`;
}
