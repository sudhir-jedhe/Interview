# What type does TS infer, and what happens at runtime?

```typescript
interface InventoryLevels {
  [sku: string]: number;
}

const stock: InventoryLevels = {
  "SKU-001": 40,
  "SKU-002": 15,
};

const level = stock["SKU-999"]; // never set
console.log(`Stock level: ${level.toFixed(0)}`);
```

**Answer:** `level` is inferred as type `number` (not `number | undefined`), so the line compiles cleanly with no errors under default `strict` settings. At runtime, `stock["SKU-999"]` evaluates to `undefined`, and `level.toFixed(0)` throws: `TypeError: Cannot read properties of undefined (reading 'toFixed')`.

**Why:** A plain index signature (`[sku: string]: number`) tells TypeScript that *any* string key access returns `number` — it does not distinguish between keys that were actually set and keys that merely satisfy the string-key constraint syntactically. This is a known soundness gap in TypeScript's default behavior: the type system promises more than the runtime can guarantee for arbitrary keys. The fix is enabling `"noUncheckedIndexedAccess": true` in `tsconfig.json` (not on by default even under `strict`), which changes every index-signature read to `number | undefined`, forcing a check (`level ?? 0` or an `if` guard) before use — turning this exact class of bug into a compile error instead of a production crash. This is precisely the limitation called out in `theory/04-index-signatures.md`.
