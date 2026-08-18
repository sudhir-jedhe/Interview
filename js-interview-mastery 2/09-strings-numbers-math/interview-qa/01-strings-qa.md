# Interview Q&A: Strings

**Q: Are strings mutable in JavaScript?**
No. Strings are immutable primitives — every string method (`toUpperCase`, `replace`, `slice`, etc.) returns a brand-new string and never modifies the original. Attempting to assign to a character index (`str[0] = "x"`) silently fails in non-strict mode and does nothing, because there's no mechanism to mutate a string in place.

**Q: What's the difference between `slice`, `substring`, and `substr`?**
`slice(start, end)` supports negative indices counted from the end and returns an empty string if `start >= end`. `substring(start, end)` clamps negative arguments to `0` and swaps `start`/`end` if they're out of order rather than returning empty. `substr(start, length)` (deprecated, avoid) takes a length as its second argument instead of an end index. `slice` is the modern default choice.

**Q: How do template literals differ from string concatenation with `+`?**
Template literals (`` `text ${expr}` ``) support multi-line strings without escape sequences and embed expressions directly via `${}` interpolation, which is more readable than chained `+` concatenation, especially with many interpolated values. Functionally, both ultimately coerce interpolated values to strings the same way, but template literals also unlock tagged templates — a function placed before the backticks that can intercept and transform the literal's parts before they're joined.
