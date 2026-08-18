# `Map` vs. Object, `Set` vs. Array

`Map` allows **any value** (including objects and functions) as a key, preserves insertion order, and has an accurate `.size` — plain objects coerce non-symbol keys to strings and require manual `Object.keys(obj).length` for a count. `Set` stores unique values with fast `.has()` lookup — arrays require a linear `.includes()` scan and manual dedup logic. Use `Map`/`Set` when keys aren't simple strings, when insertion order and size matter cleanly, or when you're frequently adding/removing entries; use plain objects/arrays for simple, JSON-serializable data.

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

```js
// Map accepts object keys; plain objects cannot distinguish them
const objKey = { id: 1 };
const map = new Map();
map.set(objKey, 'metadata');
console.log(map.get(objKey));        // metadata
console.log(map.get({ id: 1 }));     // undefined — different object reference
```

## `Set` vs. Array

| Aspect | `Set` | Array |
|---|---|---|
| Duplicate values | Automatically rejected | Allowed |
| Lookup (`has`/`includes`) | O(1) average | O(n) linear scan |
| Order | Insertion order preserved | Insertion order (index-based) |
| Indexing | No index access | Direct index access (`arr[i]`) |

Use `Set` when you need uniqueness guarantees or frequent membership checks (`.has()`); use `Array` when order-based indexing, duplicates, or array methods (`.map`, `.filter`, `.reduce`) are needed. The common mistake is reaching for `.includes()` on a large array inside a loop for membership testing — this is O(n²) overall, whereas converting to a `Set` first makes each check O(1).

```js
// Set for instant de-duplication with insertion order preserved
const nums = [3, 1, 2, 3, 1];
console.log([...new Set(nums)]); // [ 3, 1, 2 ]
```

## `WeakMap`/`WeakSet` in one line

Both hold their entries **weakly** — keys (in `WeakMap`) or values (in `WeakSet`) don't prevent garbage collection, and neither is iterable or has `.size`. Use them for attaching metadata to objects (like a cache keyed by object identity) that should automatically clean itself up once nothing else references the object.
