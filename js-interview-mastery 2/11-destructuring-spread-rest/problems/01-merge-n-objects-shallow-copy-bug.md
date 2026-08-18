# Problem: Merge N objects with later objects overriding earlier ones

Implement `mergeAll(...objects)` that merges any number of objects, where later objects in the argument list override earlier ones on conflicting keys — then demonstrate, with a concrete example, why the result is only a **shallow** copy and how that can bite you.

## Requirements

- `mergeAll({a: 1}, {b: 2}, {a: 3})` → `{a: 3, b: 2}`
- Works with any number of source objects (zero, one, or many).
- Explain and demonstrate the shallow-copy limitation with nested objects.

## Solution

```js
function mergeAll(...objects) {
  return objects.reduce((merged, obj) => ({ ...merged, ...obj }), {});
}

console.log(mergeAll({ a: 1 }, { b: 2 }, { a: 3 }));
// { a: 3, b: 2 } — the last object's "a" wins

console.log(mergeAll());
// {} — zero sources is fine, returns an empty object

console.log(mergeAll({ x: 1 }));
// { x: 1 } — single source just returns an equivalent shallow copy
```

## Why it works

`reduce` walks the list of source objects left to right, spreading the accumulator (`merged`, everything combined so far) followed by the current object (`obj`) into a brand-new object literal each step. Because object spread applies keys in written order and later keys always overwrite earlier ones with the same name, each `obj` naturally "wins" over everything merged before it — which is exactly the "later overrides earlier" rule the spec for object spread already guarantees, so no manual key-by-key comparison logic is needed.

## The shallow-copy bug, demonstrated concretely

```js
const base = { user: { name: 'Ada', role: 'admin' } };
const patch = { status: 'active' };

const merged = mergeAll(base, patch);
merged.user.role = 'guest'; // "just updating the merged copy"...

console.log(base.user.role);
// "guest" — BUG: the original `base.user` object was never actually copied,
// only its *reference* was; merged.user and base.user are the same object in memory
```

`mergeAll` (and object spread in general) only copies **top-level** keys as new bindings — `merged.user` is a fresh property on a new object, but the *value* stored at that property is the exact same nested object reference that lived on `base`. Mutating `merged.user.role` therefore mutates the object that `base.user` also points to, silently corrupting data the caller assumed was left untouched.

## The fix

For genuinely nested data, either merge one level deeper explicitly:

```js
function mergeUserSafely(base, patch) {
  return {
    ...base,
    ...patch,
    user: { ...base.user, ...(patch.user || {}) }, // one extra spread per nesting level
  };
}
```

or use `structuredClone`/a deep-merge utility (like lodash's `merge`) when the nesting depth is unknown or arbitrary — shallow spread alone is never sufficient once any source object contains nested objects or arrays that callers might later mutate.
