# Freeze, seal, and preventExtensions

These three form a ladder of decreasing strictness for locking down an object:

- `Object.preventExtensions(obj)` — no new properties can be added, existing ones can still be modified or deleted.
- `Object.seal(obj)` — `preventExtensions` plus all existing properties become `configurable: false` (so no delete), but `writable` is untouched, so values can still change.
- `Object.freeze(obj)` — `seal` plus all data properties become `writable: false`. Fully immutable — for one level only.

```js
const frozen = Object.freeze({ nested: { a: 1 } });
frozen.nested.a = 2;          // works! freeze is shallow
console.log(frozen.nested.a); // 2
```

All three are inspectable via `Object.isExtensible`, `Object.isSealed`, `Object.isFrozen`. **None of them are recursive** — freezing an object does not freeze objects it references. See `../scenarios/01-deep-freeze-immutable-config.md` for a recursive `deepFreeze` implementation.

## Comparison table

| Aspect | `preventExtensions` | `seal` | `freeze` |
|---|---|---|---|
| Add new properties | Blocked | Blocked | Blocked |
| Delete existing properties | Allowed | Blocked | Blocked |
| Modify existing values | Allowed | Allowed | Blocked |
| Reconfigure descriptors | Allowed | Blocked | Blocked |

Use `preventExtensions` when you want to lock the *shape* of an object but still let existing fields update, `seal` for a fixed set of mutable fields (e.g., a settings object where keys are known but values change), and `freeze` for true constants and enum-like objects. The most common mistake is assuming any of the three are deep/recursive — none are, so nested objects remain fully mutable unless you recursively freeze them yourself.

## What happens on violation

Adding a property to a sealed (or frozen, or non-extensible) object fails silently in non-strict mode (the property simply isn't added, no error) and throws a `TypeError` in strict mode or ES modules (which are strict by default):

```js
const frozenArr = Object.freeze([1, 2, 3]);
frozenArr.push(4);
// Throws: TypeError: Cannot add property 3, object is not extensible
// (Array mutator methods run in strict mode internally in modern engines, so this always throws.)
```
