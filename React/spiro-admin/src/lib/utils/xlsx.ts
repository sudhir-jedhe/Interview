/**
 * Writing .xlsx, with no dependency.
 *
 * An .xlsx is a ZIP of XML parts. Writing one usually means pulling in a
 * spreadsheet library, but there is a shortcut the libraries do not take:
 * **the ZIP does not have to be compressed.** Method 0 ("stored") is a
 * perfectly legal ZIP entry, and Excel, Numbers, LibreOffice and Google
 * Sheets all open it. That removes the only hard part — a deflate encoder —
 * and leaves CRC-32 plus a few header structs.
 *
 * The cost is file size: a stored workbook is roughly the size of its XML.
 * For an operational export of a few thousand rows that is a couple of
 * megabytes, which is a fair trade for zero dependencies.
 *
 * Cells are written as inline strings rather than through a shared-strings
 * table — one less part to keep consistent — while genuine numbers are
 * written as numeric cells so Excel will sum and chart them.
 */

/* ------------------------------------------------------------------ *
 * CRC-32
 * ------------------------------------------------------------------ */

let crcTable: Uint32Array | null = null;

function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
}

function crc32(bytes: Uint8Array): number {
  crcTable ??= makeCrcTable();
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]!) & 0xff]!;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/* ------------------------------------------------------------------ *
 * ZIP (stored entries only)
 * ------------------------------------------------------------------ */

export interface ZipPart {
  name: string;
  data: Uint8Array;
}

/** MS-DOS date/time, which is what a ZIP header carries. */
function dosDateTime(date: Date): { time: number; date: number } {
  return {
    time:
      (date.getHours() << 11) | (date.getMinutes() << 5) | (Math.floor(date.getSeconds() / 2) & 0x1f),
    // Years count from 1980 in a ZIP header, not 1970.
    date: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

export function zipStore(parts: ZipPart[], mime: string): Blob {
  const encoder = new TextEncoder();
  const stamp = dosDateTime(new Date());

  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const part of parts) {
    const nameBytes = encoder.encode(part.name);
    const crc = crc32(part.data);
    const size = part.data.length;

    const local = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); // local file header signature
    lv.setUint16(4, 20, true); // version needed to extract
    lv.setUint16(6, 0x0800, true); // flags: UTF-8 file names
    lv.setUint16(8, 0, true); // method 0 = stored
    lv.setUint16(10, stamp.time, true);
    lv.setUint16(12, stamp.date, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true); // compressed size
    lv.setUint32(22, size, true); // uncompressed size — identical when stored
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true); // extra field length
    local.set(nameBytes, 30);

    chunks.push(local, part.data);

    const entry = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(entry.buffer);
    cv.setUint32(0, 0x02014b50, true); // central directory signature
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true); // version needed
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, stamp.time, true);
    cv.setUint16(14, stamp.date, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint32(42, offset, true); // offset of this entry's local header
    entry.set(nameBytes, 46);

    central.push(entry);
    offset += local.length + size;
  }

  const centralSize = central.reduce((sum, c) => sum + c.length, 0);

  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, parts.length, true); // entries on this disk
  ev.setUint16(10, parts.length, true); // entries in total
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true); // offset of the central directory

  // Concatenate into ONE buffer rather than handing the Blob an array of
  // views. Two reasons: `TextEncoder.encode` returns
  // `Uint8Array<ArrayBufferLike>`, which is not assignable to `BlobPart`
  // under TypeScript's typed-array generics, and a single allocation is
  // cheaper than dozens of small ones for a large sheet.
  const total = offset + centralSize + eocd.length;
  const merged = new Uint8Array(total);

  let cursor = 0;
  for (const piece of [...chunks, ...central, eocd]) {
    merged.set(piece, cursor);
    cursor += piece.length;
  }

  return new Blob([merged], { type: mime });
}

/* ------------------------------------------------------------------ *
 * The workbook
 * ------------------------------------------------------------------ */

/**
 * XML escaping.
 *
 * The control-character strip is not decoration: characters below U+0020
 * (other than tab, newline and carriage return) are illegal in XML 1.0, and
 * Excel refuses the ENTIRE file rather than skipping the offending cell. One
 * stray 0x1A pasted into a spreadsheet somewhere upstream would otherwise
 * make every export unopenable.
 */
const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

/** 0 -> "A", 26 -> "AA". */
function columnName(index: number): string {
  let name = '';
  let n = index + 1;
  while (n > 0) {
    const remainder = (n - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

/**
 * Only a real JavaScript number becomes a numeric cell.
 *
 * Strings that merely LOOK numeric stay text on purpose. An IMEI is fifteen
 * digits; hand it to Excel as a number and it comes back as 3.56938E+14 with
 * the last digits gone for good. The rule is: if the source data modelled it
 * as a number, it is a number; if it modelled it as a string, it is an
 * identifier and identifiers are text.
 */
function cellXml(ref: string, value: unknown): string {
  if (value === null || value === undefined || value === '') return '';

  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${ref}"><v>${value}</v></c>`;
  }

  if (typeof value === 'boolean') {
    return `<c r="${ref}" t="b"><v>${value ? 1 : 0}</v></c>`;
  }

  return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(
    String(value)
  )}</t></is></c>`;
}

export interface SheetSpec {
  name: string;
  headers: string[];
  rows: unknown[][];
}

function sheetXml(sheet: SheetSpec): string {
  const rows: string[] = [];

  rows.push(
    `<row r="1">${sheet.headers.map((h, i) => cellXml(`${columnName(i)}1`, h)).join('')}</row>`
  );

  sheet.rows.forEach((row, r) => {
    const cells = row.map((value, c) => cellXml(`${columnName(c)}${r + 2}`, value)).join('');
    rows.push(`<row r="${r + 2}">${cells}</row>`);
  });

  // A frozen header row and an autofilter, because a four-thousand-row export
  // without either is unusable the moment it lands in someone's inbox.
  const lastColumn = columnName(Math.max(0, sheet.headers.length - 1));

  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<sheetViews><sheetView tabSelected="1" workbookViewId="0">` +
    `<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>` +
    `</sheetView></sheetViews>` +
    `<sheetData>${rows.join('')}</sheetData>` +
    `<autoFilter ref="A1:${lastColumn}${sheet.rows.length + 1}"/>` +
    `</worksheet>`
  );
}

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export function buildXlsx(sheet: SheetSpec): Blob {
  const encoder = new TextEncoder();
  const name = escapeXml(sheet.name.slice(0, 31) || 'Sheet1');

  const parts: ZipPart[] = [
    {
      name: '[Content_Types].xml',
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
          `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
          `<Default Extension="xml" ContentType="application/xml"/>` +
          `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
          `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
          `</Types>`
      ),
    },
    {
      name: '_rels/.rels',
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
          `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
          `</Relationships>`
      ),
    },
    {
      name: 'xl/workbook.xml',
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ` +
          `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
          `<sheets><sheet name="${name}" sheetId="1" r:id="rId1"/></sheets>` +
          `</workbook>`
      ),
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      data: encoder.encode(
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
          `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
          `</Relationships>`
      ),
    },
    { name: 'xl/worksheets/sheet1.xml', data: encoder.encode(sheetXml(sheet)) },
  ];

  return zipStore(parts, XLSX_MIME);
}

/** Rows of display objects -> a sheet, keys become headings. */
export function sheetFromRecords(name: string, records: Record<string, unknown>[]): SheetSpec {
  const headers: string[] = [];
  for (const record of records.slice(0, 50)) {
    for (const key of Object.keys(record)) if (!headers.includes(key)) headers.push(key);
  }

  return {
    name,
    headers,
    rows: records.map((record) => headers.map((key) => record[key] ?? '')),
  };
}
