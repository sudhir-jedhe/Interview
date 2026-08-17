# ES6+ Features

ES2015 (ES6) and subsequent yearly releases introduced the features that define "modern JavaScript" — block scoping, arrow functions, template literals, modules, new collection types, and generators — most of which you'll use every single day without thinking twice. This topic ties together the ES6+ features not covered in dedicated depth elsewhere (scope/hoisting, operators) into one reference: modules and how they differ from CommonJS, `Symbol` as a primitive for unique keys, `Map`/`Set` versus plain objects/arrays, generators for lazy iteration, and a grab-bag of newer, genuinely useful additions (`Array.prototype.at`, `Object.hasOwn`, `structuredClone`, top-level `await`). A few topics here are intentionally brief with pointers to where the real depth lives, since they're covered more thoroughly elsewhere in this repo.

## What's covered
- `let`/`const` block scoping (brief recap — full depth in the scope & hoisting topic)
- Arrow functions (brief recap)
- Template literals and tagged templates
- Default parameters
- ES Modules: `import`/`export`, named vs. default exports, live bindings
- `Symbol` and using it for unique object keys
- `Map` vs. plain object, `Set` vs. `Array` — when to use which
- Generators in depth: `yield`, `yield*`, lazy sequences
- Optional chaining and nullish coalescing (brief recap — full depth in the operators topic)
- Newer additions: `Array.prototype.at`, `Object.hasOwn`, `structuredClone`, top-level `await`

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
