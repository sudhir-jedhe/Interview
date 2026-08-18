# Problem: Index-signature dictionary type and its arbitrary-key-access limitation

## Problem statement

Write an index-signature type `ProductStockLevels` mapping SKU strings to stock counts (numbers). Write a function that looks up a SKU's stock level. Then demonstrate the limitation of plain index signatures — that looking up a key that was never set is not flagged by the compiler and produces `undefined` at runtime despite the declared type — and fix it with a defensive lookup pattern.

## Requirements

- `interface ProductStockLevels { [sku: string]: number }`
- A naive `getStockLevelUnsafe` that shows the limitation (comment explaining the runtime risk).
- A safe `getStockLevelSafe` that returns `number | undefined` explicitly and never trusts the index signature blindly.
- Must compile under `strict: true`.

## Solution

```typescript
interface ProductStockLevels {
  [sku: string]: number;
}

const stock: ProductStockLevels = {
  "SKU-001": 40,
  "SKU-002": 0,
};

// --- Unsafe version: trusts the index signature's claimed type ---
function getStockLevelUnsafe(levels: ProductStockLevels, sku: string): number {
  return levels[sku]; // TS believes this is always `number`
}

const phantom = getStockLevelUnsafe(stock, "SKU-DOES-NOT-EXIST");
// `phantom` is typed `number`, but its actual runtime value is `undefined`.
// phantom.toFixed(0) would throw: Cannot read properties of undefined (reading 'toFixed')

// --- Safe version: treats the index signature's promise as unverified ---
function getStockLevelSafe(levels: ProductStockLevels, sku: string): number | undefined {
  const value = levels[sku];
  return typeof value === "number" ? value : undefined;
}

function describeStock(levels: ProductStockLevels, sku: string): string {
  const level = getStockLevelSafe(levels, sku);
  return level === undefined ? `${sku}: unknown SKU` : `${sku}: ${level} in stock`;
}

console.log(describeStock(stock, "SKU-001"));         // "SKU-001: 40 in stock"
console.log(describeStock(stock, "SKU-DOES-NOT-EXIST")); // "SKU-DOES-NOT-EXIST: unknown SKU"
```

### Why this is the correct approach and what the limitation is

`ProductStockLevels`'s index signature tells the compiler "every string key maps to a `number`," but that's a claim about the *shape*, not a runtime guarantee about which keys actually exist — TypeScript has no way to know at compile time whether `"SKU-DOES-NOT-EXIST"` was ever assigned. `getStockLevelUnsafe` inherits this false confidence directly, silently returning `undefined` typed as `number`. The project-wide fix is `"noUncheckedIndexedAccess": true` in `tsconfig.json`, which would make `levels[sku]` infer as `number | undefined` everywhere automatically; absent that setting, `getStockLevelSafe`'s explicit `typeof` check achieves the same safety locally, at the cost of needing to remember to apply the pattern manually at every index-signature read.
