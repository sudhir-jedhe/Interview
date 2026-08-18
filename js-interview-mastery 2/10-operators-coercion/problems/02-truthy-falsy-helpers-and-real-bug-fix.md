# Problem: Implement `isTruthy`/`isFalsy` and use them to fix a real `||`-filtering bug

Implement two small helpers, then use them to fix a realistic bug where `Array.prototype.filter(Boolean)`-style filtering (or a raw `||` default) incorrectly drops legitimate `0` or `""` values.

## Requirements

1. `isTruthy(x)` / `isFalsy(x)` — explicit, readable wrappers around JS's truthy/falsy semantics.
2. A buggy `getDisplayValues` function that filters out **valid, wanted** falsy values (`0`, `""`) from a list meant for a data table, purely because it uses `.filter(Boolean)` (equivalent to filtering on truthiness). Fix it so only genuinely *missing* values (`null`/`undefined`) are removed, while `0` and `""` are kept as real data.

## Solution

```js
function isTruthy(x) {
  return Boolean(x);
}

function isFalsy(x) {
  return !x;
}

console.log(isTruthy(0), isTruthy(""), isTruthy([]), isTruthy({})); // false false true true
console.log(isFalsy(0), isFalsy(""), isFalsy(null));                // true true true


// --- The bug ---
// A table renders "quantity in stock" for each product. Some products
// legitimately have 0 in stock, and some have an empty label "". The
// original code drops both by mistake:

function getDisplayValuesBuggy(values) {
  return values.filter(Boolean); // BUG: filters out 0, "", false too — not just missing data
}

const rawValues = [5, 0, "", "Low stock", null, undefined, 12];
console.log(getDisplayValuesBuggy(rawValues));
// [5, "Low stock", 12] — WRONG: 0 and "" (valid data!) silently vanished


// --- The fix ---
// "Missing" should mean null/undefined specifically, not "falsy".
function isMissing(x) {
  return x === null || x === undefined;
}

function getDisplayValuesFixed(values) {
  return values.filter((v) => !isMissing(v));
}

console.log(getDisplayValuesFixed(rawValues));
// [5, 0, "", "Low stock", 12] — correct: only null/undefined removed, 0 and "" survive
```

## Why the bug happened and why the fix works

`Array.prototype.filter(Boolean)` is a common idiom for "remove empty/missing entries," but `Boolean` as a predicate keeps only *truthy* values — it can't distinguish "this value is genuinely absent" (`null`/`undefined`) from "this value is a legitimate falsy piece of data" (`0` in-stock, `""` empty label). This is structurally the exact same class of bug as `value || defaultValue` silently overriding a valid `0`.

The fix reframes the filter's intent explicitly: define `isMissing` in terms of `null`/`undefined` only (mirroring what `??` already does), and filter on that instead of raw truthiness. This is the same principle as reaching for `??` over `||` — the general lesson being that "missing" and "falsy" are two different concepts that happen to overlap for `null`/`undefined`/`NaN` but diverge for `0`, `""`, and `false`.

## Edge cases worth testing

```js
console.log(getDisplayValuesFixed([false]));   // [false] — false is a legitimate boolean value, not "missing"
console.log(getDisplayValuesFixed([NaN]));      // [NaN] — NaN is present, just not a valid number; a separate concern from "missing"
console.log(getDisplayValuesFixed([]));         // [] — empty input stays empty, nothing to filter
```
