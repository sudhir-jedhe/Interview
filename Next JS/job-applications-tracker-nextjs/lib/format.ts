import { format, formatDistanceToNowStrict, isToday, isTomorrow } from "date-fns";

import { CURRENCIES, DEFAULT_CURRENCY } from "@/constants";

export function currencySymbol(code: string) {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

/**
 * Compact money for dense UI (stat cards, table cells, chart axes):
 * 1_250_000 INR → "₹12.5L", 1_250_000 USD → "$1.25M".
 * Indian-numbering currencies use lakh/crore because that's how the amounts
 * are actually spoken.
 */
export function formatCompactMoney(
  value: number | null | undefined,
  code: string = DEFAULT_CURRENCY,
) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const symbol = currencySymbol(code);
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (code === "INR") {
    if (abs >= 1_00_00_000) return `${sign}${symbol}${trim(abs / 1_00_00_000)}Cr`;
    if (abs >= 1_00_000) return `${sign}${symbol}${trim(abs / 1_00_000)}L`;
    if (abs >= 1_000) return `${sign}${symbol}${trim(abs / 1_000)}K`;
    return `${sign}${symbol}${Math.round(abs)}`;
  }

  if (abs >= 1_000_000) return `${sign}${symbol}${trim(abs / 1_000_000)}M`;
  if (abs >= 1_000) return `${sign}${symbol}${trim(abs / 1_000)}K`;
  return `${sign}${symbol}${Math.round(abs)}`;
}

function trim(n: number) {
  // 12.50 → "12.5", 12.00 → "12"
  return Number(n.toFixed(2)).toString();
}

/** Full precision money for detail pages, where the exact number matters. */
export function formatMoney(
  value: number | null | undefined,
  code: string = DEFAULT_CURRENCY,
) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  try {
    return new Intl.NumberFormat(code === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currencySymbol(code)}${Math.round(value).toLocaleString()}`;
  }
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toLocaleString();
}

export function formatPercent(value: number | null | undefined, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatDate(value: Date | string | null | undefined) {
  const date = toDate(value);
  return date ? format(date, "d MMM yyyy") : "—";
}

export function formatDateTime(value: Date | string | null | undefined) {
  const date = toDate(value);
  return date ? format(date, "d MMM yyyy, h:mm a") : "—";
}

export function formatRelative(value: Date | string | null | undefined) {
  const date = toDate(value);
  if (!date) return "—";
  return `${formatDistanceToNowStrict(date)} ago`;
}

/** "Today", "Tomorrow", or an absolute date — used by interview reminders. */
export function formatFriendlyDate(value: Date | string | null | undefined) {
  const date = toDate(value);
  if (!date) return "—";
  if (isToday(date)) return `Today, ${format(date, "h:mm a")}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, "h:mm a")}`;
  return format(date, "d MMM, h:mm a");
}

export function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Value for a `datetime-local` input, in the viewer's local timezone. */
export function toDateTimeLocalValue(value: Date | string | null | undefined) {
  const date = toDate(value);
  if (!date) return "";
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function toDateInputValue(value: Date | string | null | undefined) {
  const date = toDate(value);
  return date ? format(date, "yyyy-MM-dd") : "";
}

export function initials(name: string) {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
