# Comparisons: ES6+ Features

## `Map` vs. Plain Object

| Aspect | `Map` | Plain Object |
|---|---|---|
| Key types | Any value (objects, functions, primitives) | Strings and symbols only (other keys are coerced to strings) |
| Key order | Guaranteed insertion order | Mostly insertion order, but integer-like keys are sorted numerically first |
| Size | `.size` property | Manual: `Object.keys(obj).length` |
| Iteration | Directly iterable (`for-of`, `.forEach`) | Not iterable directly; needs `Object.entries()` etc. |
| Performance | Optimized for frequent additions/removals | Better for static, JSON-like shape data |
| Serialization | No native `JSON.stringify` support | Native `JSON.stringify` support |

Use `Map` when keys are dynamic, non-string, or the collection changes frequently; use plain objects for fixed-shape records that need to be serialized to JSON or passed around as simple data. The common mistake is using a plain object as a general-purpose dictionary with untrusted/dynamic string keys, risking prototype pollution or accidental collisions with inherited properties like `toString` or `__proto__`.

## `Set` vs. Array

| Aspect | `Set` | Array |
|---|---|---|
| Duplicate values | Automatically rejected | Allowed |
| Lookup (`has`/`includes`) | O(1) average | O(n) linear scan |
| Order | Insertion order preserved | Insertion order (index-based) |
| Indexing | No index access | Direct index access (`arr[i]`) |

Use `Set` when you need uniqueness guarantees or frequent membership checks (`.has()`); use `Array` when order-based indexing, duplicates, or array methods (`.map`, `.filter`, `.reduce`) are needed. The common mistake is reaching for `.includes()` on a large array inside a loop for membership testing — this is O(n²) overall, whereas converting to a `Set` first makes each check O(1).

## Named Exports vs. Default Export

| Aspect | Named Export | Default Export |
|---|---|---|
| Count per module | Any number | At most one |
| Import syntax | `import { name } from '...'` (name must match) | `import anyName from '...'` (importer chooses the name) |
| Renaming | `import { name as alias }` | Naturally renameable, no special syntax |
| Tooling/refactor safety | Easier for IDEs to auto-import/rename correctly | Harder to trace — the imported name is arbitrary at each call site |

Prefer named exports for anything with multiple related exports from one module (utility libraries) since it improves tree-shaking and auto-import tooling; default exports suit modules that expose exactly one primary thing (a single component/class). A common mistake is mixing many default exports across a codebase, making it hard to `grep` for usages since each importer can name the import differently.

## `structuredClone` vs. `JSON.parse(JSON.stringify(obj))` vs. Spread

| Aspect | `structuredClone` | `JSON.parse(JSON.stringify())` | Spread `{ ...obj }` |
|---|---|---|---|
| Depth | Deep | Deep | Shallow only |
| Handles `Date`/`Map`/`Set`/circular refs | Yes | No — `Date` becomes a string, `Map`/`Set` become `{}`, circular refs throw | N/A (shallow) |
| Handles functions | No — throws `DataCloneError` | Silently drops functions | Copies function references (not cloned) |
| Performance | Native, generally fast | Slower (two full serialization passes) | Fastest, but shallow |

`structuredClone` is the modern default for a genuine deep copy of data-only structures. The common mistake is reaching for `JSON.parse(JSON.stringify(obj))` as a "deep clone" without realizing it silently corrupts `Date` objects (converts to ISO strings), drops `undefined`/function values, and throws on circular references — `structuredClone` handles all of these correctly except functions, which neither approach can clone.
