# Cloning objects: shallow vs deep

`{...obj}` and `Object.assign({}, obj)` both do a **shallow** copy — nested objects are copied by reference, not value. `structuredClone(obj)` does a real **deep** clone natively, handling circular references, `Map`, `Set`, and `Date`, but it cannot clone functions or DOM nodes and throws on them. The older `JSON.parse(JSON.stringify(obj))` trick deep-clones too, but silently drops `undefined`, functions, and `Symbol` keys, converts `Date` to strings, and breaks on circular references — it's a hack, not a general solution.

```js
const original = { user: { name: "Ana" }, tags: ["a", "b"] };

const shallow = { ...original };
shallow.user.name = "Bea";
console.log(original.user.name); // "Bea" (shared reference, mutated!)

const deep = structuredClone(original);
deep.user.name = "Cid";
console.log(original.user.name); // still "Bea", unaffected by deep clone
```

## Comparison table

| Aspect | Shallow (`spread`, `Object.assign`) | Deep (`structuredClone`, JSON round-trip) |
|---|---|---|
| Nested objects/arrays | Copied by reference | Fully independent copies |
| Functions | Copied by reference | `structuredClone` throws; JSON silently drops |
| `Date`, `Map`, `Set` | Reference copied | `structuredClone` clones properly; JSON mangles `Date` to string, drops `Map`/`Set` |
| Circular references | Fine (reference preserved) | `structuredClone` handles it; JSON throws |
| Performance | Very cheap | More expensive, proportional to depth/size |

Use shallow clone when you know you're only changing top-level fields (common in reducers/state updates). Use `structuredClone` when you need a true independent deep copy and don't have functions in the data. See `../problems/02-deep-clone.md` for a hand-written deep-clone implementation that also handles functions (by reference) without the JSON trick's data-loss problems. The most common mistake is shallow-cloning an object with nested state, mutating a nested field, and being surprised the "copy" and original both changed — because only the top level was actually copied.

## Object.assign merging semantics, and how it differs from spread

`Object.assign(target, ...sources)` copies own enumerable properties from each source into `target`, left to right, later sources overwriting earlier ones for the same key:

```js
const a = { val: 1 };
const b = Object.assign({}, a, { val: 2 }, { extra: 3 });
console.log(a, b); // { val: 1 } then { val: 2, extra: 3 }
```

Functionally, `Object.assign({}, a, b)` and `{...a, ...b}` behave the same for plain merging — both are shallow, later sources win on key conflicts. The surprise usually comes from forgetting `Object.assign` **mutates its first argument**: calling `Object.assign(a, b)` (without a fresh `{}` target) mutates `a` in place, whereas spread always produces a brand-new object. See `../problems/03-myassign-polyfill.md` for a from-scratch `Object.assign` polyfill.
