# Interview Questions: Strings, Numbers & Math

**Q: Are strings mutable in JavaScript?**
No. Strings are immutable primitives — every string method (`toUpperCase`, `replace`, `slice`, etc.) returns a brand-new string and never modifies the original. Attempting to assign to a character index (`str[0] = "x"`) silently fails in non-strict mode and does nothing, because there's no mechanism to mutate a string in place.

**Q: Why does `0.1 + 0.2 !== 0.3` in JavaScript?**
JavaScript numbers are IEEE-754 double-precision floating point, and most decimal fractions (including `0.1` and `0.2`) can't be represented exactly in binary — they're stored as the closest possible approximation. Adding two approximations compounds the tiny error, producing `0.30000000000000004` instead of exactly `0.3`. This isn't a JS bug; it's inherent to binary floating-point representation and affects nearly every mainstream language.

**Q: How do you compare floating-point numbers safely?**
Instead of exact equality, check that the difference is within a small tolerance: `Math.abs(a - b) < Number.EPSILON` (or a custom epsilon appropriate to your value scale, since `Number.EPSILON` alone is very small and may be too strict for numbers involving larger magnitudes or more accumulated operations). For display purposes, `.toFixed(n)` rounding to a fixed number of decimals is usually sufficient.

**Q: What's the difference between `parseInt`, `Number()`, and unary `+`?**
`parseInt` parses leading numeric characters and stops at the first invalid one, so `parseInt("42px")` returns `42`. `Number()` and unary `+` both require the entire string to be a valid number or they return `NaN` — no partial parsing. `parseInt` also supports an explicit radix argument for parsing non-decimal number strings, which `Number()`/`+` do not.

**Q: Why should you always pass a radix to `parseInt`?**
Without an explicit radix, `parseInt` infers the base from the string's format — a `"0x"` prefix is parsed as hexadecimal. Older engines historically also auto-detected octal from a leading zero (`"010"` → 8), which caused real bugs; while modern engines default to base 10 for plain leading-zero strings, explicitly passing `10` (`parseInt(str, 10)`) removes any ambiguity and documents intent.

**Q: What's the difference between `Number.isNaN` and the global `isNaN`?**
The global `isNaN` coerces its argument to a number first, so `isNaN("hello")` is `true` because `"hello"` coerces to `NaN`. `Number.isNaN` does no coercion — it only returns `true` if the value is literally the `NaN` value already, so `Number.isNaN("hello")` is `false`. `Number.isNaN` is the more precise, generally recommended check.

**Q: What is `Number.isSafeInteger` and why does it matter?**
JavaScript numbers can only represent integers exactly up to `2^53 - 1` (`Number.MAX_SAFE_INTEGER`) due to the 53-bit mantissa in IEEE-754 doubles. Beyond that, integers start losing precision and can silently collide with neighboring values. `Number.isSafeInteger(x)` checks both that `x` is a whole number and that it falls within this safe range — relevant when dealing with large IDs, timestamps, or any value where exact integer precision matters (in which case `BigInt` may be the better tool).

**Q: What's the difference between `slice`, `substring`, and `substr`?**
`slice(start, end)` supports negative indices counted from the end and returns an empty string if `start >= end`. `substring(start, end)` clamps negative arguments to `0` and swaps `start`/`end` if they're out of order rather than returning empty. `substr(start, length)` (deprecated, avoid) takes a length as its second argument instead of an end index. `slice` is the modern default choice.

**Q: How do template literals differ from string concatenation with `+`?**
Template literals (`` `text ${expr}` ``) support multi-line strings without escape sequences and embed expressions directly via `${}` interpolation, which is more readable than chained `+` concatenation, especially with many interpolated values. Functionally, both ultimately coerce interpolated values to strings the same way, but template literals also unlock tagged templates — a function placed before the backticks that can intercept and transform the literal's parts before they're joined.

**Q: How would you generate a random integer within an inclusive range using `Math.random()`?**
`Math.random()` returns a float in `[0, 1)`. To get an inclusive integer range `[min, max]`, scale and floor: `Math.floor(Math.random() * (max - min + 1)) + min`. The `+1` is essential — omitting it makes the range effectively exclusive of `max`, since `Math.floor` on the unscaled maximum possible value would never quite reach `max` without it.

**Q: What's the difference between `Math.round`, `Math.floor`, `Math.ceil`, and `Math.trunc`?**
`Math.floor` always rounds toward negative infinity, `Math.ceil` always rounds toward positive infinity, `Math.round` rounds to the nearest integer with ties going toward positive infinity (`Math.round(-2.5)` is `-2`, not `-3`), and `Math.trunc` simply removes the fractional part regardless of sign, rounding toward zero (`Math.trunc(-2.9)` is `-2`).

**Q: Why do you need spread syntax with `Math.max`/`Math.min` on an array?**
`Math.max` and `Math.min` accept individual arguments, not an array, so calling `Math.max(arr)` with an array directly returns `NaN` since the array itself isn't a valid number. Spreading the array's elements as individual arguments (`Math.max(...arr)`) is required, though for very large arrays this can hit call-stack argument limits, in which case `arr.reduce((a, b) => Math.max(a, b))` is a safer alternative.
