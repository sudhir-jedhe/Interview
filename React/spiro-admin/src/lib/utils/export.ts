/**
 * Client-side data export.
 *
 * The part that is easy to get wrong is CSV escaping: a value containing a
 * comma, a quote or a newline must be wrapped in quotes with inner quotes
 * doubled (RFC 4180). Skipping that silently corrupts every export that
 * contains a name with a comma in it.
 */

export interface ExportColumn<T> {
  key: string;
  header: string;
  value?: (row: T) => unknown;
}

function escapeCell(value: unknown, delimiter: string): string {
  if (value === null || value === undefined) return '';

  const str = String(value);
  const needsQuotes = str.includes(delimiter) || str.includes('"') || /[\r\n]/.test(str);

  return needsQuotes ? `"${str.replace(/"/g, '""')}"` : str;
}

/**
 * Derive columns from the data when the caller did not supply any.
 *
 * Callers here build a pre-shaped object per row whose KEYS are already the
 * headings they want ({ 'Battery ID': …, 'SOC (%)': … }), so the key is the
 * header. The union of keys across the first rows is used rather than just
 * row zero, because one row with a missing optional field would otherwise
 * drop that column from the whole export.
 */
function inferColumns<T extends Record<string, unknown>>(rows: T[]): ExportColumn<T>[] {
  const keys = new Set<string>();
  for (const row of rows.slice(0, 50)) for (const key of Object.keys(row)) keys.add(key);
  return [...keys].map((key) => ({ key, header: key }));
}

export function toCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns?: ExportColumn<T>[],
  delimiter = ','
): string {
  const cols = columns ?? inferColumns(rows);
  const header = cols.map((c) => escapeCell(c.header, delimiter)).join(delimiter);

  const body = rows.map((row) =>
    cols
      .map((c) => escapeCell(c.value ? c.value(row) : row[c.key], delimiter))
      .join(delimiter)
  );

  return [header, ...body].join('\r\n');
}

/**
 * Trigger a browser download from a string.
 *
 * The BOM matters: without it, Excel opens UTF-8 CSV as Latin-1 and mangles
 * every accented character — which, for a French-speaking West African fleet,
 * is every other row.
 */
export function downloadText(filename: string, content: string, mime = 'text/csv;charset=utf-8') {
  const bom = mime.startsWith('text/csv') ? '﻿' : '';
  const blob = new Blob([bom + content], { type: mime });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Release the object URL, or the blob leaks for the page's lifetime.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * `columns` is optional: omit it and the row keys become the headings.
 *
 * It was NOT optional originally, and every one of the ten call sites omitted
 * it — so `columns.map` threw inside the click handler and every Download
 * button silently did nothing. A typecheck would have caught it in a second;
 * this is the bug that comes of shipping without one.
 */
export function downloadCsv<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  columns?: ExportColumn<T>[]
) {
  downloadText(filename, toCsv(rows, columns));
}

export function downloadJson(filename: string, data: unknown) {
  downloadText(filename, JSON.stringify(data, null, 2), 'application/json');
}

/** Trigger a download from a Blob — the xlsx path, where the bytes are binary. */
export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Timestamped filename, so repeated exports don't overwrite each other. */
export function timestampedName(base: string, ext: string): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${base}_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(
    d.getHours()
  )}${pad(d.getMinutes())}.${ext}`;
}
