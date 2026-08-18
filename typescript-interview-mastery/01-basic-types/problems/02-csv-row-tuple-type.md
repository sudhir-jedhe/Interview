# Problem: Tuple type for a fixed CSV row shape

## Problem statement

You're parsing rows from an `inventory.csv` file with a fixed column order: `sku` (string), `quantity` (number), `warehouseCode` (string), and an optional trailing `lastAuditedAt` date string that may or may not be present in older file versions. Define a tuple type for a parsed row and a function that destructures it into a readable summary.

## Requirements

- Define `type InventoryRow` as a labeled tuple: `sku`, `quantity`, `warehouseCode`, and optional `lastAuditedAt`.
- Write `parseInventoryLine(line: string): InventoryRow` that splits a comma-separated line and coerces types.
- Write `summarizeInventoryRow(row: InventoryRow): string` that destructures the tuple and produces a readable string, handling the optional trailing field.
- Must compile under `strict: true`.

## Solution

```typescript
type InventoryRow = [
  sku: string,
  quantity: number,
  warehouseCode: string,
  lastAuditedAt?: string,
];

function parseInventoryLine(line: string): InventoryRow {
  const parts = line.split(",");
  const [sku, quantityRaw, warehouseCode, lastAuditedAt] = parts;

  const row: InventoryRow = [sku, Number(quantityRaw), warehouseCode];
  if (lastAuditedAt !== undefined && lastAuditedAt !== "") {
    row.push(lastAuditedAt); // still valid: pushing the one optional trailing slot
  }
  return row;
}

function summarizeInventoryRow(row: InventoryRow): string {
  const [sku, quantity, warehouseCode, lastAuditedAt] = row;
  const auditNote = lastAuditedAt ? `last audited ${lastAuditedAt}` : "never audited";
  return `${sku}: ${quantity} units @ ${warehouseCode} (${auditNote})`;
}

// Usage
const rowWithAudit = parseInventoryLine("SKU-778,42,WH-EAST,2026-07-15");
const rowWithoutAudit = parseInventoryLine("SKU-901,10,WH-WEST,");

console.log(summarizeInventoryRow(rowWithAudit));
// "SKU-778: 42 units @ WH-EAST (last audited 2026-07-15)"
console.log(summarizeInventoryRow(rowWithoutAudit));
// "SKU-901: 10 units @ WH-WEST (never audited)"
```

### Why this is the correct approach

The tuple's optional trailing element (`lastAuditedAt?: string`) precisely models "this CSV format has an optional 4th column added later" without resorting to a loose `string[]` (which would allow any length and lose per-position typing) or `[string, number, string, string | undefined]` (which would force every row to have exactly 4 slots, even when the trailing column is entirely absent from older files — `row.length` would be forced to 4 with an explicit `undefined` value rather than genuinely being a 3-element array). The `?` modifier keeps both `row.length === 3` and `row.length === 4` valid, matching the real on-disk data variability.
