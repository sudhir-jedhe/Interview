# Snippet: Optional vs default parameters side by side

Shows the type difference inside the function body between an optional parameter (`T | undefined`) and a default parameter (always `T`).

```typescript
function formatPrice(cents: number, currency?: string): string {
  // currency: string | undefined — must guard before use
  return `${currency ?? "USD"} ${(cents / 100).toFixed(2)}`;
}

function formatPriceWithDefault(cents: number, currency: string = "USD"): string {
  // currency: string — always defined, no guard needed
  return `${currency} ${(cents / 100).toFixed(2)}`;
}

console.log(formatPrice(1999));
console.log(formatPriceWithDefault(1999));
```
