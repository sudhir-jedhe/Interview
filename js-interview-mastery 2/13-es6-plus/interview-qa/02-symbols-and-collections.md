# Interview Q&A: Symbols, Map, and Set

**Q: What is a `Symbol` and why would you use one as an object key?**
`Symbol()` produces a unique, primitive value — no two symbols are ever equal, even with the same description. Using a symbol as an object key guarantees it won't collide with any string key (including future additions to a shared object shape by other code), and symbol-keyed properties are automatically excluded from `for-in`, `Object.keys()`, and `JSON.stringify()`, making them useful for "hidden" metadata.

**Q: When would you choose `Map` over a plain object?**
When keys need to be non-string values (objects, functions), when you need guaranteed insertion-order iteration with an accurate `.size`, or when the collection is frequently mutated (added to/removed from) — `Map` is optimized for that access pattern and avoids prototype-chain footguns (like accidental collision with inherited keys such as `toString`).

**Q: Why is `Set` a better choice than an array for deduplication and membership checks in hot code paths?**
`Set.prototype.has()` is an O(1) average-time lookup because it's backed by a hash-table-like structure, whereas `Array.prototype.includes()` is an O(n) linear scan. In a loop performing many membership checks, using an array turns the overall operation into O(n²), while a `Set` keeps it at O(n).
