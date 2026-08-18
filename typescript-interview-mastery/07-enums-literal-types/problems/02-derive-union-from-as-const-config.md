# Derive a literal union type from an as-const config object

## Problem

Given a runtime configuration object listing supported currencies (used to populate a currency selector in the UI and needed by `fetch` calls elsewhere), derive a `Currency` type from it without duplicating the currency codes in a separate type declaration — a second, hand-written type would risk drifting out of sync with the object as currencies are added or removed.

```typescript
// Starting point — plain object, no derived type yet
const SUPPORTED_CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
};
```

## Solution

```typescript
const SUPPORTED_CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
} as const;

type Currency = keyof typeof SUPPORTED_CURRENCIES;
// "USD" | "EUR" | "GBP"

function formatAmount(currency: Currency, amount: number): string {
  const { symbol } = SUPPORTED_CURRENCIES[currency];
  return `${symbol}${amount.toFixed(2)}`;
}

console.log(formatAmount("EUR", 42.5)); // "€42.50"
// formatAmount("JPY", 100); // Error: "JPY" not assignable to Currency
```

## Discussion

`keyof typeof SUPPORTED_CURRENCIES` is the object-keys variant of the array-values pattern (`typeof arr[number]`) — `typeof SUPPORTED_CURRENCIES` recovers the object's literal type (with `as const` ensuring the keys are known specifically, not just widened to `string`), and `keyof` extracts the union of its key names. Adding a new currency is now a single edit to the object literal: `Currency` picks it up automatically because it's derived, not hand-maintained, and any code (like `formatAmount`) that was exhaustively handling currencies via a `Record<Currency, ...>` elsewhere would immediately get a compile error prompting the update — the same forcing-function benefit seen in the exhaustive label-map pattern. Note `as const` is doing double duty here: without it, `SUPPORTED_CURRENCIES`'s inferred type would still have the right *keys* (object keys aren't subject to the same widening as values), so `keyof typeof SUPPORTED_CURRENCIES` would actually work even without `as const` in this specific case — but `as const` is still needed to make the *values* (`symbol`, `name`) literal and `readonly`, which matters if those are used elsewhere as literal types too.
