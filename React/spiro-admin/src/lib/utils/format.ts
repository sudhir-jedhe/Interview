/** Formatting helpers. Centralised so number/date style is consistent. */

export const formatNumber = (n: number, locale = 'en-US') =>
  new Intl.NumberFormat(locale).format(n);

export const formatCompact = (n: number, locale = 'en-US') =>
  new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export const formatPercent = (n: number) => `${Math.round(n)} %`;

export const formatDecimal = (n: number, places = 2) => n.toFixed(places);

/** dd/MM/yyyy, HH:mm:ss — matching the existing product. */
export function formatDateTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}`;
}

/** "3 min ago" — for last-seen columns where absolute time is noise. */
export function formatRelative(ts: number): string {
  const seconds = Math.round((Date.now() - ts) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)} h ago`;
  return `${Math.floor(seconds / 86_400)} d ago`;
}

/** A dash, not "0" or "null" — a missing reading is not a zero reading. */
export const orDash = (value: number | string | null | undefined, suffix = '') =>
  value === null || value === undefined || value === '' ? '–' : `${value}${suffix}`;

/**
 * Map a speed in km/h to its legend band. The bands come from the product's
 * own GPS legend, so the map and the legend can never drift apart.
 */
export const SPEED_BANDS = [
  { min: 0, label: '< 20', varName: '--speed-20' },
  { min: 20, label: '40+', varName: '--speed-40' },
  { min: 40, label: '60+', varName: '--speed-60' },
  { min: 60, label: '80+', varName: '--speed-80' },
  { min: 80, label: '100+', varName: '--speed-100' },
  { min: 100, label: '110+', varName: '--speed-110' },
  { min: 110, label: '120+', varName: '--speed-120' },
  { min: 120, label: '130+', varName: '--speed-130' },
] as const;

export function speedBand(speed: number) {
  // Walk from the top so the first match is the highest applicable band.
  for (let i = SPEED_BANDS.length - 1; i >= 0; i--) {
    if (speed >= SPEED_BANDS[i]!.min) return SPEED_BANDS[i]!;
  }
  return SPEED_BANDS[0];
}

/** Resolve a CSS custom property to its computed value (for canvas/WebGL). */
export function cssVar(name: string, fallback = '#888'): string {
  if (typeof document === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
