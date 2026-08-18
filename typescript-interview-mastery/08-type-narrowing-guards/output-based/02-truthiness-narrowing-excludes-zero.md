```typescript
function formatQuantity(qty: number | undefined): string {
  if (!qty) {
    return "no quantity specified";
  }
  return `${qty} units`;
}

console.log(formatQuantity(0));
console.log(formatQuantity(5));
console.log(formatQuantity(undefined));
```

What does `formatQuantity(0)` print, and is that likely to be a bug?

**Answer:** `formatQuantity(0)` prints `"no quantity specified"` — almost certainly a bug if `0` is meant to be a valid, meaningful quantity (e.g., "0 units in stock" is different information from "quantity wasn't specified at all").

**Why:** `if (!qty)` is truthiness narrowing, which filters out every falsy value at once — `undefined`, `null`, `0`, `NaN`, `""` — not just the specific value (`undefined`) the function is actually trying to guard against. Since `0` is falsy in JavaScript, it takes the same branch as a genuinely missing quantity, even though semantically "the caller explicitly said zero" and "the caller didn't say anything" are different situations that deserve different handling. This compiles without any error because it's not a type error at all — the code is perfectly type-safe, just logically wrong. The fix is an explicit comparison that only excludes the actual case you mean to exclude: `if (qty === undefined) { ... }`, which correctly lets `0` fall through to the `${qty} units` branch and prints `"0 units"`.
