# Strings, Numbers & Math

Strings and numbers are the two most-used primitive types in JavaScript, and both have interview-relevant quirks: strings are immutable and have a handful of overlapping/legacy extraction methods, while numbers are all IEEE-754 doubles, which means floating-point precision surprises are a near-guaranteed interview topic. This section covers the practical string API (slicing, searching, padding, template literals), why `0.1 + 0.2 !== 0.3` and how to work around it, the family of numeric-parsing functions and their different failure behaviors, and the handful of `Math` methods you actually use day to day.

## Structure

- **`theory/`** — concept notes, split by topic: string basics (immutability, `slice`/`substring`/`substr`, `split`/`join`/`pad`/`includes`), template literals & tagged templates, floating-point precision, number checks & parsing, and `Math` essentials.
- **`snippets/`** — short runnable examples, one file each.
- **`output-based/`** — "what does this log?" questions with answers and explanations, one file each.
- **`scenarios/`** — realistic problems (currency rounding, form validation, safe truncation, random ID generation) with a full approach and edge cases, one file each.
- **`interview-qa/`** — grouped Q&A: strings, number parsing/checks, floating point & Math.
- **`problems/`** — hands-on "implement X from scratch" challenges with full, tested solutions: string utilities (`capitalize`/`truncate`/`slugify`), a thousands-separator number formatter, and a tiny `{{mustache}}`-style template engine.
- **`from-your-notes/`** — your original standalone notes, left untouched.
- **`assets/`** — placeholder for images/PDFs from your original notes.

## What's covered
- String methods: `slice`/`substring`/`substr` differences, `split`/`join`, `padStart`/`padEnd`, `includes`/`startsWith`/`endsWith`, template literals and tagged templates
- String immutability
- Floating point precision (`0.1 + 0.2 !== 0.3`) and fixes (`toFixed`, epsilon comparison)
- `Number.isInteger`/`isFinite`/`isSafeInteger`
- `parseInt` vs `parseFloat` vs `Number()` vs unary `+`
- `Math` essentials: `Math.random` for ranges, `Math.max`/`min` with spread, `Math.floor`/`ceil`/`round` differences

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
