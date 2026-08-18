# Interview Q&A: Number Parsing & Checks

**Q: What's the difference between `parseInt`, `Number()`, and unary `+`?**
`parseInt` parses leading numeric characters and stops at the first invalid one, so `parseInt("42px")` returns `42`. `Number()` and unary `+` both require the entire string to be a valid number or they return `NaN` — no partial parsing. `parseInt` also supports an explicit radix argument for parsing non-decimal number strings, which `Number()`/`+` do not.

**Q: Why should you always pass a radix to `parseInt`?**
Without an explicit radix, `parseInt` infers the base from the string's format — a `"0x"` prefix is parsed as hexadecimal. Older engines historically also auto-detected octal from a leading zero (`"010"` → 8), which caused real bugs; while modern engines default to base 10 for plain leading-zero strings, explicitly passing `10` (`parseInt(str, 10)`) removes any ambiguity and documents intent.

**Q: What's the difference between `Number.isNaN` and the global `isNaN`?**
The global `isNaN` coerces its argument to a number first, so `isNaN("hello")` is `true` because `"hello"` coerces to `NaN`. `Number.isNaN` does no coercion — it only returns `true` if the value is literally the `NaN` value already, so `Number.isNaN("hello")` is `false`. `Number.isNaN` is the more precise, generally recommended check.

**Q: What is `Number.isSafeInteger` and why does it matter?**
JavaScript numbers can only represent integers exactly up to `2^53 - 1` (`Number.MAX_SAFE_INTEGER`) due to the 53-bit mantissa in IEEE-754 doubles. Beyond that, integers start losing precision and can silently collide with neighboring values. `Number.isSafeInteger(x)` checks both that `x` is a whole number and that it falls within this safe range — relevant when dealing with large IDs, timestamps, or any value where exact integer precision matters (in which case `BigInt` may be the better tool).
