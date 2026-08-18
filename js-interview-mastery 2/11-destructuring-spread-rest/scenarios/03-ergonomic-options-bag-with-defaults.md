# Scenario: Designing an ergonomic function signature with a trailing options bag

You're converting a REST API's positional-style helper `formatDate(y, m, d)` into a more ergonomic call site that also supports an options bag for formatting (`separator`, `padZeros`). Design the function signature so callers can do `formatDate(2024, 1, 5)` or `formatDate(2024, 1, 5, { separator: '/' })`, with sensible defaults.

**Approach:**
```js
function formatDate(year, month, day, { separator = '-', padZeros = true } = {}) {
  const pad = (n) => (padZeros ? String(n).padStart(2, '0') : String(n));
  return [year, pad(month), pad(day)].join(separator);
}

formatDate(2024, 1, 5);                       // "2024-01-05"
formatDate(2024, 1, 5, { separator: '/' });   // "2024/01/05"
formatDate(2024, 1, 5, {});                   // "2024-01-05" (defaults fill in)
```
The key detail is the `= {}` default on the options parameter itself — without it, calling `formatDate(2024, 1, 5)` (no fourth argument) would try to destructure `undefined` and throw a `TypeError`. Nested defaults (`separator = '-'`) only handle missing/undefined *properties*; the outer `= {}` handles a missing *argument* entirely. Both are needed for a truly optional trailing options object.
