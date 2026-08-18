# Snippet: Primitive type basics

Shows all seven primitives declared with explicit annotations and one common pitfall with `null`/`undefined` under strict mode.

```typescript
const productName: string = "Wireless Mouse";
const unitsInStock: number = 128;
const isDiscontinued: boolean = false;
const discontinuedAt: Date | null = null;
const notes: string | undefined = undefined;
const legacySkuId: bigint = 9007199254741001n;
const internalKey: unique symbol = Symbol("internal-key");

console.log(productName, unitsInStock, isDiscontinued, discontinuedAt, notes, legacySkuId);
```
