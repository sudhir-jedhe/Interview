# Property descriptors

Every property on an object isn't just a value — it's a small record called a property descriptor. For data properties, that record has four attributes: `value`, `writable`, `enumerable`, and `configurable`. When you create a property with a normal assignment or object literal, all three booleans default to `true`. `Object.defineProperty` lets you set them explicitly, and if you omit an attribute it defaults to `false` (not `true`) when defining a *new* property this way — that asymmetry trips people up.

```js
const obj = {};
Object.defineProperty(obj, "id", { value: 42 });
obj.id = 99;              // silently fails in sloppy mode, throws in strict mode
console.log(obj.id);      // 42, writable defaulted to false
console.log(Object.keys(obj)); // [], enumerable defaulted to false
```

Compare that to defining the same property via a literal:

```js
const literal = { a: 1 };
console.log(Object.getOwnPropertyDescriptor(literal, "a"));
// { value: 1, writable: true, enumerable: true, configurable: true }

const defined = {};
Object.defineProperty(defined, "a", { value: 1 });
console.log(Object.getOwnPropertyDescriptor(defined, "a"));
// { value: 1, writable: false, enumerable: false, configurable: false }
```

## What each attribute controls

- **`writable`** — whether the value can be reassigned.
- **`enumerable`** — whether it shows up in `for...in`, `Object.keys`, spread, and `JSON.stringify`.
- **`configurable`** — whether the property can be deleted or have its descriptor changed again (except you can always go from `writable: true` to `false` even if `configurable` is `false` — that's the one exception the spec allows; you can never go from `false` back to `true`, and you can't change `value`, `get`/`set`, `enumerable`, or `configurable` at all once `configurable` is `false`).

## Non-enumerable properties are invisible to common iteration

```js
const obj = { visible: 1 };
Object.defineProperty(obj, "hidden", { value: 2, enumerable: false });

console.log(Object.keys(obj));    // ["visible"]
console.log(JSON.stringify(obj)); // {"visible":1}
console.log(obj.hidden);          // 2 (still directly accessible)
```

This is exactly how built-in prototype methods (like `Array.prototype.map` or `Object.prototype.toString`) stay invisible to `for...in` and `Object.keys` even though they're reachable via the prototype chain — they're defined as non-enumerable.
