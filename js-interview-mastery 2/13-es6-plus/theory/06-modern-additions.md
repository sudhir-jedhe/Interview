# Newer Additions Worth Knowing

## `Array.prototype.at`

`arr.at(-1)` supports negative indexing, cleaner than `arr[arr.length - 1]`:

```js
const list = [10, 20, 30];
console.log(list.at(-1), list[list.length - 1]); // 30 30
console.log(list.at(-2));  // 20 — second from last
console.log(list[-2]);     // undefined — plain bracket indexing has no negative-index support
```
`arr[-2]` doesn't error — it just performs a normal property lookup for the string key `"-2"`, which the array doesn't have, so it silently returns `undefined`. `.at()` is the safer, intentional way to index from the end.

## `Object.hasOwn`

`Object.hasOwn(obj, key)` is a safer replacement for `obj.hasOwnProperty(key)` — it works even if `obj` has no prototype (e.g. `Object.create(null)`), and it can't be shadowed by an object that happens to define its own property literally named `hasOwnProperty`:

```js
const obj = Object.create(null);
obj.a = 1;
console.log(obj.hasOwnProperty('a')); // TypeError — no prototype, no hasOwnProperty method
console.log(Object.hasOwn(obj, 'a')); // true — static method, doesn't rely on the object's own prototype chain
```

## `structuredClone`

A built-in true deep clone (handles circular references, `Map`, `Set`, `Date`; does not clone functions or DOM nodes):

```js
const original = { nested: { value: 1 } };
const clone = structuredClone(original);
clone.nested.value = 99;
console.log(original.nested.value, clone.nested.value); // 1 99
```

### `structuredClone` vs. `JSON.parse(JSON.stringify(obj))` vs. spread

| Aspect | `structuredClone` | `JSON.parse(JSON.stringify())` | Spread `{ ...obj }` |
|---|---|---|---|
| Depth | Deep | Deep | Shallow only |
| Handles `Date`/`Map`/`Set`/circular refs | Yes | No — `Date` becomes a string, `Map`/`Set` become `{}`, circular refs throw | N/A (shallow) |
| Handles functions | No — throws `DataCloneError` | Silently drops functions | Copies function references (not cloned) |
| Performance | Native, generally fast | Slower (two full serialization passes) | Fastest, but shallow |

`structuredClone` is the modern default for a genuine deep copy of data-only structures. The common mistake is reaching for `JSON.parse(JSON.stringify(obj))` as a "deep clone" without realizing it silently corrupts `Date` objects (converts to ISO strings), drops `undefined`/function values, and throws on circular references — `structuredClone` handles all of these correctly except functions, which neither approach can clone.

## Top-level `await`

Inside an ES module (not inside a regular script or a function), you can `await` directly at the module's top level without wrapping in an `async function` — see the ES Modules theory file for a full example.
