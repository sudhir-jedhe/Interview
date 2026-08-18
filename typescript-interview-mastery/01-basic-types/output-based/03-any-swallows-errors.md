# What's the error here (if any)?

```typescript
function getDiscountRate(customerTier: any): number {
  return customerTier.rate;
}

const result = getDiscountRate({ rate: "ten percent" });
const doubled: number = result * 2;
console.log(doubled);
```

**Answer:** There is **no compile error anywhere in this snippet**, but it produces `NaN` at runtime.

**Why:** `customerTier` is typed `any`, so `customerTier.rate` is also `any` — TypeScript does not check that `rate` exists or that it's a `number`. The function's declared return type `number` is not actually verified against the `any` value being returned; `any` is assignable to every type without complaint, including a mismatched one. So `result` is typed `number` by the function signature, but the *actual runtime value* is the string `"ten percent"`. `"ten percent" * 2` evaluates to `NaN` in JavaScript, and TypeScript never catches it because `any` disabled checking at the first point of contact. This is exactly the failure mode `unknown` prevents: if `customerTier` were typed `unknown`, you'd be forced to narrow and validate `rate` before accessing it, catching the type mismatch at compile time instead of discovering `NaN` in production.
