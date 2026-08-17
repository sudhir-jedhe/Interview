# Destructuring, Spread & Rest

Destructuring lets you unpack values from arrays and properties from objects into distinct variables using a concise, declarative syntax instead of manual indexing or property access. Spread (`...`) expands an iterable or object into individual elements/properties — inside array literals, object literals, or function calls. Rest (`...`) does the opposite: it collects multiple elements into a single array or object, either as the last function parameter or the "remaining" part of a destructuring pattern. Although spread and rest share identical `...` syntax, the direction of data flow (expand vs. collect) is determined entirely by where the syntax appears. These features are used constantly in modern JS for immutable updates, argument handling, and readable variable extraction.

## What's covered
- Array destructuring: skipping elements, default values, swapping variables
- Object destructuring: renaming, defaults, nested patterns
- Destructuring directly in function parameters
- Spread in array literals, object literals, and function calls
- Rest parameters in functions vs. rest elements in destructuring
- Spread vs. rest: same syntax, opposite meaning
- The shallow-copy caveat when spreading objects/arrays with nested references

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
