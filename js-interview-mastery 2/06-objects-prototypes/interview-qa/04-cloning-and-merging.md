# Interview Q&A: cloning and merging

**Q: How do you deep clone an object in modern JavaScript, and what are the limitations?**
`structuredClone(obj)` is the built-in, spec-defined way to deep clone — it handles nested objects, arrays, `Map`, `Set`, `Date`, and even circular references correctly. Its limitations: it cannot clone functions, DOM nodes, or anything with prototype chains beyond plain built-ins (it throws a `DataCloneError`). The older `JSON.parse(JSON.stringify(obj))` trick also deep clones but silently drops `undefined` values and functions, converts `Date` objects to ISO strings (losing the `Date` type), can't handle `Map`/`Set`, and throws on circular references.

**Q: Why does `Object.assign({}, a, b)` sometimes surprise people compared to spread?**
Functionally, `Object.assign({}, a, b)` and `{...a, ...b}` behave the same for plain merging — both are shallow, later sources win on key conflicts. The surprise usually comes from forgetting `Object.assign` mutates its *first* argument, so calling `Object.assign(a, b)` (without a fresh `{}` target) mutates `a` in place, whereas spread always produces a new object.
