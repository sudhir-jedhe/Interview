# Comparisons: Objects & Prototypes

## Object.freeze vs Object.seal vs Object.preventExtensions

| Aspect | `preventExtensions` | `seal` | `freeze` |
|---|---|---|---|
| Add new properties | Blocked | Blocked | Blocked |
| Delete existing properties | Allowed | Blocked | Blocked |
| Modify existing values | Allowed | Allowed | Blocked |
| Reconfigure descriptors | Allowed | Blocked | Blocked |

Use `preventExtensions` when you want to lock the *shape* of an object but still let existing fields update, `seal` for a fixed set of mutable fields (e.g., a settings object where keys are known but values change), and `freeze` for true constants and enum-like objects. The most common mistake is assuming any of the three are deep/recursive — none are, so nested objects remain fully mutable unless you recursively freeze them yourself.

## `__proto__` vs `Object.getPrototypeOf`/`setPrototypeOf` vs `Constructor.prototype`

| Aspect | `__proto__` | `Object.getPrototypeOf`/`setPrototypeOf` | `Constructor.prototype` |
|---|---|---|---|
| What it is | Accessor property exposing `[[Prototype]]` | Standard functions doing the same job | A regular property *on a function*, used as the prototype for `new` instances |
| Standard status | Legacy, in Annex B (web-compat only) | Fully standard, ES2015+ | Fully standard, always existed |
| Where it lives | On `Object.prototype`, inherited by instances | Static methods on `Object` | On the constructor function itself |

Prefer `Object.getPrototypeOf`/`setPrototypeOf` in real code — `__proto__` is technically supported everywhere but discouraged in specs and linters. `Constructor.prototype` is a different concept entirely: it's not an instance's prototype, it's the object that *becomes* an instance's prototype after `new`. The most common confusion is thinking `instance.prototype` exists — it doesn't; only functions have a `.prototype` property, instances have `[[Prototype]]` (accessed via `__proto__` or `getPrototypeOf`).

## Shallow clone vs deep clone

| Aspect | Shallow (`spread`, `Object.assign`) | Deep (`structuredClone`, JSON round-trip) |
|---|---|---|
| Nested objects/arrays | Copied by reference | Fully independent copies |
| Functions | Copied by reference | `structuredClone` throws; JSON silently drops |
| `Date`, `Map`, `Set` | Reference copied | `structuredClone` clones properly; JSON mangles `Date` to string, drops `Map`/`Set` |
| Circular references | Fine (reference preserved) | `structuredClone` handles it; JSON throws |
| Performance | Very cheap | More expensive, proportional to depth/size |

Use shallow clone when you know you're only changing top-level fields (common in reducers/state updates). Use `structuredClone` when you need a true independent deep copy and don't have functions in the data. The most common mistake is shallow-cloning an object with nested state, mutating a nested field, and being surprised the "copy" and original both changed — because only the top level was actually copied.

## `hasOwnProperty` vs `in`

| Aspect | `obj.hasOwnProperty(key)` | `key in obj` |
|---|---|---|
| Checks inherited properties | No | Yes |
| Works on `Object.create(null)` objects | No (throws, no method) | Yes (safe, it's an operator) |
| Typical use | Filtering `for...in` results to own keys | Checking existence anywhere in the chain, including built-ins |

Use `in` when you genuinely want to know if a property is reachable at all (including via prototype, like checking for a method); use `hasOwnProperty` (or `Object.hasOwn(obj, key)` in modern JS) when you specifically care about the object's own data. The common mistake is using `in` inside a `for...in`-style existence check and getting `true` for inherited methods like `"toString" in obj`, wrongly assuming the object itself defines it.
