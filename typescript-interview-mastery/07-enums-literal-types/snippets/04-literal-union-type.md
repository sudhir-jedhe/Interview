# A plain literal union as an enum alternative

```typescript
// Zero runtime cost — purely a compile-time constraint
type Size = "small" | "medium" | "large";

function priceFor(size: Size): number {
  const prices: Record<Size, number> = { small: 3, medium: 4, large: 5 };
  return prices[size];
}

console.log(priceFor("medium")); // 4
```
