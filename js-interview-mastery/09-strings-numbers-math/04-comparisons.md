# Comparisons: Strings, Numbers & Math

## slice vs substring vs substr

| Aspect | `slice(start, end)` | `substring(start, end)` | `substr(start, length)` (legacy) |
|---|---|---|---|
| Negative indices | Counts from end | Clamped to `0` | Start clamped/wrapped, deprecated behavior varies |
| `start > end` | Returns `""` | Silently swaps arguments | N/A — second arg is a length, not an end index |
| Second argument meaning | End index (exclusive) | End index (exclusive) | Length of substring to take |
| Recommended today | Yes | Situationally | No — deprecated, avoid in new code |

Use `slice` as the default for nearly everything, especially when negative-index "from the end" extraction is useful. Use `substring` only if you specifically want the swap-on-reversed-args behavior. Avoid `substr` entirely in new code since it's marked legacy in the spec. The most common mistake is assuming `slice` and `substring` are interchangeable — they diverge exactly on negative indices and reversed arguments, both of which are easy to hit by accident with computed indices.

## parseInt vs parseFloat vs Number() vs unary +

| Aspect | `parseInt(str, radix)` | `parseFloat(str)` | `Number(str)` | `+str` |
|---|---|---|---|---|
| Partial parsing (stops at first invalid char) | Yes | Yes | No — whole string must be numeric | No — whole string must be numeric |
| Decimal support | No (integers only) | Yes | Yes | Yes |
| Radix support | Yes (2nd argument) | No | No | No |
| Empty string | `NaN` | `NaN` | `0` | `0` |

Use `parseInt`/`parseFloat` when extracting a leading number from a string that may have trailing non-numeric content (like `"42px"`). Use `Number()` or unary `+` when validating that an entire string is a clean number, since they reject any leftover characters. The most common mistake is calling `parseInt` without a radix on user input, which can misinterpret strings with unexpected prefixes in older engines or unusual formatting — always pass `10` explicitly for safety and clarity.

## `Math.floor` vs `Math.ceil` vs `Math.round` vs `Math.trunc`

| Aspect | `Math.floor` | `Math.ceil` | `Math.round` | `Math.trunc` |
|---|---|---|---|---|
| Direction | Always toward `-Infinity` | Always toward `+Infinity` | Nearest integer, ties toward `+Infinity` | Toward `0` (drops the decimal part) |
| `2.5` | `2` | `3` | `3` | `2` |
| `-2.5` | `-3` | `-2` | `-2` | `-2` |

Use `Math.floor` for pagination/bucketing math where you always want to round down regardless of sign, `Math.round` for genuine "nearest value" rounding (like display formatting), and `Math.trunc` when you specifically want to discard the fractional part without directional rounding (useful for converting a float to an integer while preserving sign symmetry). The most common mistake is assuming `Math.round(-2.5)` behaves like `-Math.round(2.5)` — it doesn't, because round-half-up always biases toward positive infinity regardless of sign.

## Number.isNaN vs global isNaN

| Aspect | `Number.isNaN(x)` | `isNaN(x)` (global) |
|---|---|---|
| Coerces argument first | No | Yes |
| `isNaN("abc")` equivalent | `false` (a string is never literally `NaN`) | `true` (coerces `"abc"` to `NaN` first) |
| Recommended today | Yes | No, avoid |

Use `Number.isNaN` whenever you want to check if a value is *actually* the `NaN` value, not something that merely coerces to `NaN`. The common mistake is using the global `isNaN` on unvalidated input and getting `true` for any non-numeric string, object, or `undefined`, which usually isn't the intended check.
