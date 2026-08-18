# Destructuring, Spread & Rest

Destructuring lets you unpack values from arrays and properties from objects into distinct variables using a concise, declarative syntax instead of manual indexing or property access. Spread (`...`) expands an iterable or object into individual elements/properties — inside array literals, object literals, or function calls. Rest (`...`) does the opposite: it collects multiple elements into a single array or object, either as the last function parameter or the "remaining" part of a destructuring pattern. Although spread and rest share identical `...` syntax, the direction of data flow (expand vs. collect) is determined entirely by where the syntax appears. These features are used constantly in modern JS for immutable updates, argument handling, and readable variable extraction.

## Structure

- **`theory/`** — concept notes: array destructuring, object destructuring (+ function params), spread, rest, and the spread-vs-rest mental model.
- **`snippets/`** — short runnable examples, one file each.
- **`output-based/`** — "what does this log?" questions with answers and explanations, one file each.
- **`scenarios/`** — realistic problems (nested config merges, pick/omit helpers, ergonomic options bags, mixed tuple shapes) with a full approach and edge cases, one file each.
- **`interview-qa/`** — grouped Q&A: destructuring basics, spread, rest.
- **`problems/`** — hands-on "implement X from scratch" challenges with full, tested solutions: merging N objects (with a demonstrated shallow-copy bug), a destructuring-based `swap` plus nested API field extraction/renaming, and generic `pick`/`omit` utilities.
- **`assets/`** — placeholder for images/PDFs from your original notes.

This topic has no `from-your-notes/` folder — none of your original standalone notes mapped directly here (see `../SOURCE-MAP.md` for where to look in your old notes instead).

## What's covered
- Array destructuring: skipping elements, default values, swapping variables
- Object destructuring: renaming, defaults, nested patterns
- Destructuring directly in function parameters
- Spread in array literals, object literals, and function calls
- Rest parameters in functions vs. rest elements in destructuring
- Spread vs. rest: same syntax, opposite meaning
- The shallow-copy caveat when spreading objects/arrays with nested references

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
