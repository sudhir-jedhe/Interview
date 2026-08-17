# Interview Questions: ES6+ Features

**Q: What's the difference between a named export and a default export?**
A module can have any number of named exports but only one default export. Named exports must be imported using the exact same name (or explicitly aliased with `as`), which helps tooling auto-import and refactor reliably; a default export can be imported under any name the importer chooses, which is more flexible but harder to trace across a large codebase.

**Q: Are ES module imports copies of the exported values, or live references?**
Live, read-only bindings. If the exporting module later reassigns an exported `let`/`var` variable, every module that imported it sees the updated value automatically — the importer cannot reassign the binding itself, only read it. This differs from CommonJS's `module.exports`, which copies primitive values at require-time.

**Q: What is a `Symbol` and why would you use one as an object key?**
`Symbol()` produces a unique, primitive value — no two symbols are ever equal, even with the same description. Using a symbol as an object key guarantees it won't collide with any string key (including future additions to a shared object shape by other code), and symbol-keyed properties are automatically excluded from `for-in`, `Object.keys()`, and `JSON.stringify()`, making them useful for "hidden" metadata.

**Q: When would you choose `Map` over a plain object?**
When keys need to be non-string values (objects, functions), when you need guaranteed insertion-order iteration with an accurate `.size`, or when the collection is frequently mutated (added to/removed from) — `Map` is optimized for that access pattern and avoids prototype-chain footguns (like accidental collision with inherited keys such as `toString`).

**Q: What does `yield*` do inside a generator?**
It delegates iteration to another iterable (often another generator), pulling and re-yielding each of its values in sequence as if they were yielded directly by the outer generator, and it also forwards the delegate's return value as the result of the `yield*` expression itself. It's the standard way to compose generators without manually looping and re-yielding.

**Q: What's the difference between `Object.hasOwn(obj, key)` and `obj.hasOwnProperty(key)`?**
Both check for an own (non-inherited) property, but `Object.hasOwn` is a static method that works correctly even on objects with no prototype (created via `Object.create(null)`, which lack `hasOwnProperty` entirely) and avoids the rare edge case where an object defines its own property literally named `hasOwnProperty`, shadowing the inherited method.

**Q: What does `structuredClone` do that `JSON.parse(JSON.stringify(x))` doesn't?**
`structuredClone` correctly deep-clones `Date` objects, `Map`, `Set`, typed arrays, and even objects with circular references, using the structured clone algorithm. The `JSON` round-trip approach converts `Date` to a string, turns `Map`/`Set` into empty objects, silently drops `undefined` values and functions, and throws on circular references.

**Q: What is a tagged template literal?**
Syntax where a function is placed immediately before a template literal (`` fn`...` ``); instead of producing a plain string, the literal is parsed into an array of string chunks plus the interpolated expression values, both passed as arguments to the function. It's used for things like safe SQL query building, CSS-in-JS libraries, and i18n string formatting.

**Q: Can you use top-level `await` in any JavaScript file?**
No — only inside an ES module (a file loaded with `type="module"` in the browser, or a `.mjs` file / a `.js` file in a package with `"type": "module"` in Node). Regular scripts and CommonJS modules cannot use `await` outside an `async function`.

**Q: What's the difference between `Array.prototype.at(-1)` and `array[array.length - 1]`?**
Functionally equivalent for reading the last element, but `.at(-1)` is more concise and less error-prone (no risk of miscalculating the index), and it works uniformly whether the index is positive or negative — `array[-1]` does not work at all with bracket notation since arrays don't support negative index access that way.

**Q: Why is `Set` a better choice than an array for deduplication and membership checks in hot code paths?**
`Set.prototype.has()` is an O(1) average-time lookup because it's backed by a hash-table-like structure, whereas `Array.prototype.includes()` is an O(n) linear scan. In a loop performing many membership checks, using an array turns the overall operation into O(n²), while a `Set` keeps it at O(n).
