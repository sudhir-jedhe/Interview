# Notes: Strings, Numbers & Math

## String immutability

Strings in JavaScript are immutable primitives — no method ever changes a string in place, every "modifying" operation returns a brand-new string.

```js
let s = "hello";
s.toUpperCase();
console.log(s);              // "hello" — unchanged, return value was discarded
s = s.toUpperCase();
console.log(s);               // "HELLO" — reassignment is required
```

Indexing (`s[0]`) and `charAt` never let you assign into a string either — `s[0] = "H"` silently fails (or throws in strict mode).

## slice vs substring vs substr

All three extract a portion of a string, but they differ in how they handle their arguments, especially negative and out-of-order ones. `slice(start, end)` accepts negative indices (counted from the end) and returns an empty string if `start >= end` after normalization. `substring(start, end)` treats negative/NaN arguments as `0` and, critically, **swaps** `start` and `end` if `start > end` instead of returning empty. `substr(start, length)` (legacy, deprecated — avoid in new code) takes a start index and a *length*, not an end index.

```js
const str = "javascript";
str.slice(-6);        // "script" — negative counts from end
str.substring(-6);     // "javascript" — negative clamped to 0, so from start
str.slice(4, 2);       // "" — start after end returns empty
str.substring(4, 2);   // "as" — args get swapped internally to (2, 4)
```

Prefer `slice` for new code — it's the most predictable and the only one of the three with real negative-index support.

## split/join, padStart/padEnd, includes/startsWith/endsWith

```js
"a,b,,c".split(",");              // ["a", "b", "", "c"] — empty strings preserved
["a", "b"].join("-");             // "a-b"
"5".padStart(3, "0");             // "005"
"abc".includes("b");              // true
"abc".startsWith("ab");           // true
```

`padStart`/`padEnd` are common for formatting (zero-padding numbers, aligning output). `includes`/`startsWith`/`endsWith` are the modern, readable replacements for `indexOf(...) !== -1` checks.

## Template literals and tagged templates

Template literals (`` `...` ``) support interpolation (`${expr}`) and multi-line strings without escape characters. Tagged templates let a function intercept the literal's parts before they're joined:

```js
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => `${acc}${str}${values[i] ? `**${values[i]}**` : ""}`, "");
}
highlight`Score: ${95} out of ${100}`; // "Score: **95** out of **100**"
```

## Floating point precision

JavaScript numbers are IEEE-754 double-precision floats, and most decimal fractions (like `0.1`) can't be represented exactly in binary, causing tiny rounding errors that accumulate during arithmetic.

```js
console.log(0.1 + 0.2);           // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);   // false
```

Fixes: compare with a small epsilon tolerance (`Math.abs(a - b) < Number.EPSILON`), or round for display with `.toFixed(n)` (which returns a *string*, so convert back with `Number()` if you need to keep computing). For money, avoid floats entirely — store integer cents or use a decimal library.

## Number checks and parsing

`Number.isInteger(x)` checks for a whole-number value without type-coercing its argument first (unlike the old global `isFinite`/`isNaN`). `Number.isSafeInteger(x)` additionally checks the value is within `±(2^53 - 1)`, beyond which integers can't be represented exactly. `parseInt(str, radix)` parses leading numeric characters and stops at the first invalid one (`parseInt("42px")` → `42`); always pass a radix explicitly. `parseFloat` does the same for decimals. `Number(str)` and unary `+str` require the *entire* string to be numeric or they return `NaN` — no partial parsing.

```js
parseInt("42px");   // 42
Number("42px");     // NaN
+"42";               // 42
Number.isSafeInteger(2 ** 53); // false
```

## Math essentials

`Math.random()` returns `[0, 1)`; scale with `Math.floor(Math.random() * (max - min + 1)) + min` for an integer range. `Math.max(...arr)`/`Math.min(...arr)` need spread since these functions take individual arguments, not an array. `Math.floor` always rounds down, `Math.ceil` always rounds up, and `Math.round` rounds half-up (`Math.round(2.5)` is `3`, but `Math.round(-2.5)` is `-2`, not `-3` — rounding ties always go toward positive infinity).
