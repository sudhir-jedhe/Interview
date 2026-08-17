# Operators & Coercion

Type coercion is where JavaScript earns its reputation for surprises, and it's one of the highest-yield interview topics because the rules, once understood precisely, make every "weird" result predictable rather than magical. This topic covers the exact algorithm behind `==` (and why it differs fundamentally from `===`), the complete list of falsy values, how `+` behaves differently from every other arithmetic operator, and the modern operators (`??`, `?.`) that were specifically designed to avoid the sharpest edges of truthy/falsy coercion in everyday code.

What's covered:
- `==` vs `===` and the exact coercion algorithm behind `==`, including the classic tricky comparisons (`[] == false`, `null == undefined`, `NaN == NaN`)
- The complete falsy value list: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`
- Implicit coercion in `+` (string concatenation vs numeric addition) vs other arithmetic operators (always numeric)
- The ternary operator
- Nullish coalescing `??` vs logical OR `||` — the key difference around falsy-but-valid values like `0` or `""`
- Optional chaining `?.` and short-circuiting

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
