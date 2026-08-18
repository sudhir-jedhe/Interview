# Number Checks and Parsing

## Number.isInteger and Number.isSafeInteger

`Number.isInteger(x)` checks for a whole-number value without type-coercing its argument first (unlike the old global `isFinite`/`isNaN`). `Number.isSafeInteger(x)` additionally checks the value is within `±(2^53 - 1)` (`Number.MAX_SAFE_INTEGER`), beyond which integers can't be represented exactly because of the 53-bit mantissa in an IEEE-754 double — past that boundary, integers can silently collide with neighboring values.

```js
Number.isInteger(5.0);          // true — 5.0 is stored identically to 5
Number.isInteger("5");          // false — no coercion, so a string is never an integer
Number.isSafeInteger(2 ** 53);  // false — just outside the safe range
Number.isSafeInteger(2 ** 53 - 1); // true — exactly at the boundary
```

Relevant when dealing with large IDs, timestamps, or any value where exact integer precision matters — in which case `BigInt` may be the better tool than `Number` entirely.

## parseInt vs parseFloat vs Number() vs unary +

`parseInt(str, radix)` parses leading numeric characters and stops at the first invalid one (`parseInt("42px")` → `42`); always pass a radix explicitly. `parseFloat` does the same for decimals. `Number(str)` and unary `+str` require the *entire* string to be numeric or they return `NaN` — no partial parsing.

```js
parseInt("42px");    // 42
Number("42px");      // NaN
+"42";                // 42
parseFloat("10.5abc"); // 10.5
```

| Aspect | `parseInt(str, radix)` | `parseFloat(str)` | `Number(str)` | `+str` |
|---|---|---|---|---|
| Partial parsing (stops at first invalid char) | Yes | Yes | No — whole string must be numeric | No — whole string must be numeric |
| Decimal support | No (integers only) | Yes | Yes | Yes |
| Radix support | Yes (2nd argument) | No | No | No |
| Empty string | `NaN` | `NaN` | `0` | `0` |

Use `parseInt`/`parseFloat` when extracting a leading number from a string that may have trailing non-numeric content (like `"42px"`). Use `Number()` or unary `+` when validating that an entire string is a clean number, since they reject any leftover characters. The most common mistake is calling `parseInt` without a radix on user input — modern engines default to base 10 for a plain leading-zero string, but older engines historically guessed octal, so always pass `10` explicitly for safety and clarity.

## Number.isNaN vs global isNaN

| Aspect | `Number.isNaN(x)` | `isNaN(x)` (global) |
|---|---|---|
| Coerces argument first | No | Yes |
| `isNaN("abc")` equivalent | `false` (a string is never literally `NaN`) | `true` (coerces `"abc"` to `NaN` first) |
| Recommended today | Yes | No, avoid |

Use `Number.isNaN` whenever you want to check if a value is *actually* the `NaN` value, not something that merely coerces to `NaN`. The common mistake is using the global `isNaN` on unvalidated input and getting `true` for any non-numeric string, object, or `undefined`, which usually isn't the intended check.
