/**
 * Reading tabular files the user uploads: CSV, JSON and XLSX.
 *
 * No parsing library. CSV and JSON are straightforward; XLSX is a ZIP of XML,
 * and the browser can already inflate a ZIP entry via `DecompressionStream`,
 * so the whole reader is ~120 lines instead of a 400 kB dependency. If the
 * browser lacks `DecompressionStream` — or the workbook uses something this
 * reader does not handle — it fails with a message telling the user to save
 * as CSV, rather than importing a silently wrong table.
 */

export type Row = Record<string, string>;

export class ParseError extends Error {}

/* ------------------------------------------------------------------ *
 * CSV
 * ------------------------------------------------------------------ */

/**
 * A real CSV parser, character by character.
 *
 * `line.split(',')` is the classic wrong answer: it breaks on the first
 * quoted comma, and quoted fields containing newlines make a line-based
 * parser wrong in a way that is invisible until someone's address has a
 * comma in it.
 */
export function parseCsv(text: string): Row[] {
  // Strip a UTF-8 BOM — Excel writes one, and left in place it becomes part
  // of the first column's name.
  const input = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;

    if (quoted) {
      if (ch === '"') {
        // A doubled quote inside a quoted field is one literal quote.
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else if (ch === '\r' && input[i + 1] === '\n') {
        // A CRLF *inside* a quoted field: normalise to a single newline, the
        // same way one outside the quotes is. Keeping the CR here and
        // dropping it there means the same line break survives differently
        // depending on whether the field happened to be quoted.
        field += '\n';
        i++;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      quoted = true;
    } else if (ch === ',' || ch === ';' || ch === '\t') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const header = rows.shift();
  if (!header) throw new ParseError('The file is empty.');

  const keys = header.map((h) => h.trim());

  return rows
    // A trailing newline produces one empty row; drop rows that are entirely blank.
    .filter((r) => r.some((cell) => cell.trim() !== ''))
    .map((r) => {
      const record: Row = {};
      keys.forEach((key, i) => {
        record[key] = (r[i] ?? '').trim();
      });
      return record;
    });
}

/* ------------------------------------------------------------------ *
 * JSON
 * ------------------------------------------------------------------ */

export function parseJson(text: string): Row[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new ParseError(`That is not valid JSON: ${(error as Error).message}`);
  }

  // Accept either a bare array or the common { items: [...] } / { data: [...] }
  // wrapper, because both are what an export from another system looks like.
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as { items?: unknown }).items)
      ? (data as { items: unknown[] }).items
      : Array.isArray((data as { data?: unknown }).data)
        ? (data as { data: unknown[] }).data
        : null;

  if (!list) throw new ParseError('Expected a JSON array of rows, or an object with an "items" array.');

  return list.map((entry, i) => {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      throw new ParseError(`Row ${i + 1} is not an object.`);
    }
    const record: Row = {};
    for (const [key, value] of Object.entries(entry as Record<string, unknown>)) {
      record[key.trim()] = value === null || value === undefined ? '' : String(value).trim();
    }
    return record;
  });
}

/* ------------------------------------------------------------------ *
 * XLSX
 *
 * An .xlsx file is a ZIP archive of XML parts. The two that matter are
 * `xl/worksheets/sheet1.xml` (the cells) and `xl/sharedStrings.xml` (the
 * strings, which sheets reference by index rather than repeating).
 * ------------------------------------------------------------------ */

interface ZipEntry {
  name: string;
  compressed: boolean;
  offset: number;
  size: number;
}

/**
 * Read a ZIP's central directory.
 *
 * The central directory lives at the END of the file, which is what makes it
 * readable without scanning: find the End Of Central Directory record, follow
 * its pointer, and walk the entries.
 */
function readZipDirectory(buffer: ArrayBuffer): ZipEntry[] {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // Scan backwards for the EOCD signature. The comment field is at most
  // 65535 bytes, so it cannot be further back than that plus the record.
  let eocd = -1;
  const limit = Math.max(0, bytes.length - 65_557);
  for (let i = bytes.length - 22; i >= limit; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new ParseError('That file is not a readable .xlsx workbook.');

  const count = view.getUint16(eocd + 10, true);
  let pointer = view.getUint32(eocd + 16, true);
  const entries: ZipEntry[] = [];

  for (let i = 0; i < count; i++) {
    if (view.getUint32(pointer, true) !== 0x02014b50) break;

    const method = view.getUint16(pointer + 10, true);
    const size = view.getUint32(pointer + 20, true);
    const nameLength = view.getUint16(pointer + 28, true);
    const extraLength = view.getUint16(pointer + 30, true);
    const commentLength = view.getUint16(pointer + 32, true);
    const localOffset = view.getUint32(pointer + 42, true);

    const name = new TextDecoder().decode(bytes.subarray(pointer + 46, pointer + 46 + nameLength));

    // The local header repeats the name and extra fields with its OWN
    // lengths — they can differ from the central directory's, and trusting
    // the central copy is a classic way to land a few bytes into the data.
    const localNameLength = view.getUint16(localOffset + 26, true);
    const localExtraLength = view.getUint16(localOffset + 28, true);

    entries.push({
      name,
      compressed: method === 8,
      offset: localOffset + 30 + localNameLength + localExtraLength,
      size,
    });

    pointer += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

async function readEntry(buffer: ArrayBuffer, entry: ZipEntry): Promise<string> {
  const slice = buffer.slice(entry.offset, entry.offset + entry.size);
  if (!entry.compressed) return new TextDecoder().decode(slice);

  if (typeof DecompressionStream === 'undefined') {
    throw new ParseError(
      'This browser cannot read compressed .xlsx files. Save the sheet as CSV and import that instead.'
    );
  }

  // ZIP method 8 is raw deflate — no zlib header, hence 'deflate-raw'.
  const stream = new Blob([slice]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Response(stream).text();
}

/** XML entity decoding, enough for the five predefined entities plus numeric. */
function decodeXml(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    // Ampersand LAST, or "&amp;lt;" decodes twice into "<".
    .replace(/&amp;/g, '&');
}

/** "BC12" -> 54. Spreadsheet columns are base-26 with no zero digit. */
function columnIndex(ref: string): number {
  const letters = /^[A-Z]+/.exec(ref)?.[0] ?? 'A';
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

export async function parseXlsx(buffer: ArrayBuffer): Promise<Row[]> {
  const entries = readZipDirectory(buffer);

  const sheetEntry =
    entries.find((e) => e.name === 'xl/worksheets/sheet1.xml') ??
    entries.find((e) => e.name.startsWith('xl/worksheets/sheet'));

  if (!sheetEntry) throw new ParseError('No worksheet found in that workbook.');

  const sharedEntry = entries.find((e) => e.name === 'xl/sharedStrings.xml');

  const [sheetXml, sharedXml] = await Promise.all([
    readEntry(buffer, sheetEntry),
    sharedEntry ? readEntry(buffer, sharedEntry) : Promise.resolve(''),
  ]);

  // Shared strings: each <si> may hold several <t> runs (mixed formatting),
  // which must be concatenated or the text comes back truncated.
  const shared: string[] = [];
  for (const si of sharedXml.match(/<si>[\s\S]*?<\/si>/g) ?? []) {
    const runs = si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) ?? [];
    shared.push(decodeXml(runs.map((r) => r.replace(/<[^>]+>/g, '')).join('')));
  }

  const grid: string[][] = [];

  for (const rowXml of sheetXml.match(/<row[^>]*>[\s\S]*?<\/row>/g) ?? []) {
    const cells: string[] = [];

    for (const cellXml of rowXml.match(/<c[^>]*\/>|<c[^>]*>[\s\S]*?<\/c>/g) ?? []) {
      const ref = /r="([A-Z]+\d+)"/.exec(cellXml)?.[1] ?? '';
      const type = /t="([^"]+)"/.exec(cellXml)?.[1];
      const index = ref ? columnIndex(ref) : cells.length;

      let value = '';
      if (type === 'inlineStr') {
        value = decodeXml((/<t[^>]*>([\s\S]*?)<\/t>/.exec(cellXml)?.[1] ?? '').replace(/<[^>]+>/g, ''));
      } else {
        const raw = /<v>([\s\S]*?)<\/v>/.exec(cellXml)?.[1] ?? '';
        // t="s" means the value is an INDEX into sharedStrings, not the text.
        value = type === 's' ? (shared[Number(raw)] ?? '') : decodeXml(raw);
      }

      // Fill any columns the file skipped: xlsx omits empty cells entirely,
      // so positioning by `r` is the only way to keep columns aligned.
      while (cells.length < index) cells.push('');
      cells[index] = value;
    }

    grid.push(cells);
  }

  const header = grid.shift();
  if (!header) throw new ParseError('That worksheet has no rows.');

  const keys = header.map((h) => (h ?? '').trim());

  return grid
    .filter((r) => r.some((cell) => (cell ?? '').trim() !== ''))
    .map((r) => {
      const record: Row = {};
      keys.forEach((key, i) => {
        if (key) record[key] = (r[i] ?? '').trim();
      });
      return record;
    });
}

/* ------------------------------------------------------------------ *
 * One entry point
 * ------------------------------------------------------------------ */

export async function parseTabularFile(file: File): Promise<Row[]> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.json')) return parseJson(await file.text());
  if (name.endsWith('.csv') || name.endsWith('.tsv') || name.endsWith('.txt')) {
    return parseCsv(await file.text());
  }
  if (name.endsWith('.xlsx')) return parseXlsx(await file.arrayBuffer());

  if (name.endsWith('.xls')) {
    // .xls is a completely different binary format (OLE2), not a ZIP.
    throw new ParseError('The old .xls format is not supported — save the file as .xlsx or .csv.');
  }

  throw new ParseError('Unsupported file type. Use .csv, .json or .xlsx.');
}
