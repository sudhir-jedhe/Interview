/**
 * Printing a table to PDF.
 *
 * No PDF library. The browser already has a PDF writer behind its print
 * dialog, and using it means the output is real selectable text with working
 * page breaks and a repeating header row — not a picture of a table.
 *
 * The trick is to print the CURRENT document rather than opening a new
 * window: popup blockers eat `window.open`, and a new document has none of
 * the app's stylesheets. Instead a print-only container is appended, a class
 * on <html> hides everything else, and both are removed afterwards.
 */

const PRINT_ROOT_ID = 'spiro-print-root';

export interface PrintTableOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
  /** Right-align these column indices — numbers read wrong when left-aligned. */
  numericColumns?: number[];
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export function printTable({ title, subtitle, headers, rows, numericColumns = [] }: PrintTableOptions) {
  document.getElementById(PRINT_ROOT_ID)?.remove();

  const numeric = new Set(numericColumns);

  const container = document.createElement('div');
  container.id = PRINT_ROOT_ID;
  container.innerHTML = `
    <div class="print-doc">
      <header>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle ?? '')}${subtitle ? ' &middot; ' : ''}${escapeHtml(
          new Date().toLocaleString()
        )} &middot; ${rows.length} rows</p>
      </header>
      <table>
        <thead>
          <tr>${headers
            .map((h, i) => `<th${numeric.has(i) ? ' class="num"' : ''}>${escapeHtml(h)}</th>`)
            .join('')}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) =>
                `<tr>${row
                  .map((cell, i) => `<td${numeric.has(i) ? ' class="num"' : ''}>${escapeHtml(cell)}</td>`)
                  .join('')}</tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  document.body.appendChild(container);
  document.documentElement.classList.add('printing-table');

  const cleanUp = () => {
    document.documentElement.classList.remove('printing-table');
    container.remove();
    window.removeEventListener('afterprint', cleanUp);
  };

  window.addEventListener('afterprint', cleanUp);

  // Safari has historically not fired `afterprint`; the timeout is the
  // safety net so the app is never left stuck in print mode.
  window.setTimeout(() => {
    if (document.getElementById(PRINT_ROOT_ID)) cleanUp();
  }, 60_000);

  window.print();
}
