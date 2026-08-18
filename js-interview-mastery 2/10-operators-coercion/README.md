# Operators & Coercion

Type coercion is where JavaScript earns its reputation for surprises, and it's one of the highest-yield interview topics because the rules, once understood precisely, make every "weird" result predictable rather than magical. This topic covers the exact algorithm behind `==` (and why it differs fundamentally from `===`), the complete list of falsy values, how `+` behaves differently from every other arithmetic operator, and the modern operators (`??`, `?.`) that were specifically designed to avoid the sharpest edges of truthy/falsy coercion in everyday code.

## Structure

- **`theory/`** — concept notes: `==`/`===` and the coercion algorithm, truthy/falsy values, arithmetic operators & the ternary, and `??`/`?.`.
- **`snippets/`** — short runnable examples, one file each.
- **`output-based/`** — "what does this log?" questions with answers and explanations, one file each.
- **`scenarios/`** — realistic bugs and fixes (a falsy-`0` form bug, mixed-type ID merging, safe nested API reads, a consistent `isPresent` utility) with a full approach and edge cases, one file each.
- **`interview-qa/`** — grouped Q&A: equality & coercion, operators & truthy/falsy, nullish coalescing & optional chaining.
- **`problems/`** — hands-on "implement X from scratch" challenges with full, tested solutions: a manual `looseEquals` replicating `==` rule-by-rule, `isTruthy`/`isFalsy` helpers used to fix a real falsy-filtering bug, and a mini expression evaluator with correct `+`/`-`/`*` coercion.
- **`from-your-notes/`** — your original standalone notes, left untouched.
- **`assets/`** — placeholder for images/PDFs from your original notes.

## What's covered
- `==` vs `===` and the exact coercion algorithm behind `==`, including the classic tricky comparisons (`[] == false`, `null == undefined`, `NaN == NaN`)
- The complete falsy value list: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`
- Implicit coercion in `+` (string concatenation vs numeric addition) vs other arithmetic operators (always numeric)
- The ternary operator
- Nullish coalescing `??` vs logical OR `||` — the key difference around falsy-but-valid values like `0` or `""`
- Optional chaining `?.` and short-circuiting

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
