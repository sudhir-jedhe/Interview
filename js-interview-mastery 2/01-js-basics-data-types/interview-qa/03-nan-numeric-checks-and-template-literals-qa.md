# Interview Q&A — `NaN`, Numeric Checks, and Template Literals

**Q: Why is `NaN !== NaN`?**
Per the IEEE-754 floating point spec that JS numbers follow, `NaN` is defined to compare unequal to every value, including itself — this lets `NaN` propagate visibly through calculations rather than silently matching other invalid results. It's a deliberate spec decision, not a JS-specific quirk.

**Q: How do you check whether a value is `NaN`?**
Use `Number.isNaN(value)`, which returns `true` only if the value is exactly the `NaN` value, with no coercion. Avoid the global `isNaN(value)`, which coerces its argument to a number first and can produce false positives (e.g. `isNaN('hello')` is `true`).

**Q: What's the difference between `Number.isNaN` and `isNaN`?**
`Number.isNaN` checks whether a value is literally `NaN`, with no type coercion. The global `isNaN` first coerces its argument via `Number()`, so any value that becomes `NaN` after coercion (like a non-numeric string) returns `true`, even though the original value was never `NaN`. `Number.isNaN` is almost always the correct choice.

**Q: What are template literals and what advantages do they have over string concatenation?**
Template literals use backticks and support `${expression}` interpolation and multi-line strings without escape characters. They're more readable than `+`-based concatenation, avoid subtle bugs from operator precedence when mixing types, and any valid expression (including function calls) can go inside `${}`.
