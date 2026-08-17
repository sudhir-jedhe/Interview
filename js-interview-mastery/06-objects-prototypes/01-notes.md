# Notes: Objects & Prototypes

## Property descriptors

Every property on an object isn't just a value — it's a small record called a property descriptor. For data properties, that record has four attributes: `value`, `writable`, `enumerable`, and `configurable`. When you create a property with a normal assignment or object literal, all three booleans default to `true`. `Object.defineProperty` lets you set them explicitly, and if you omit an attribute it defaults to `false` (not `true`) when defining a *new* property this way — that asymmetry trips people up.

```js
const obj = {};
Object.defineProperty(obj, "id", { value: 42 });
obj.id = 99;              // silently fails in sloppy mode, throws in strict mode
console.log(obj.id);      // 42, writable defaulted to false
console.log(Object.keys(obj)); // [], enumerable defaulted to false
```

`writable` controls whether the value can be reassigned. `enumerable` controls whether it shows up in `for...in`, `Object.keys`, and spread. `configurable` controls whether the property can be deleted or have its descriptor changed again (except you can always go from `writable: true` to `false` even if `configurable` is `false`).

## Freeze, seal, preventExtensions

These three form a ladder of decreasing strictness:

- `Object.preventExtensions(obj)` — no new properties can be added, existing ones can still be modified or deleted.
- `Object.seal(obj)` — preventExtensions plus all existing properties become `configurable: false` (so no delete), but `writable` is untouched, so values can still change.
- `Object.freeze(obj)` — seal plus all data properties become `writable: false`. Fully immutable — for one level only.

```js
const frozen = Object.freeze({ nested: { a: 1 } });
frozen.nested.a = 2;         // works! freeze is shallow
console.log(frozen.nested.a); // 2
```

All three checks are inspectable via `Object.isExtensible`, `Object.isSealed`, `Object.isFrozen`. None of them are recursive — freezing an object does not freeze objects it references.

## The prototype chain

Every object has an internal `[[Prototype]]` link (except objects created with `Object.create(null)`). When you access `obj.prop` and `prop` isn't an own property, the engine walks up `[[Prototype]]` links until it finds the property or hits `null`. This is how methods like `.toString()` or array methods work without being copied onto every instance.

```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return `${this.name} makes a sound`; };

const dog = new Animal("Rex");
dog.speak();                 // found on Animal.prototype, not on dog itself
dog.hasOwnProperty("speak"); // false
```

There are three distinct but related things: `obj.__proto__` (a legacy, but still widely supported, accessor that gets/sets `[[Prototype]]`), `Object.getPrototypeOf(obj)` / `Object.setPrototypeOf(obj, proto)` (the standard API for the same job), and `Constructor.prototype` (a plain object property *on the function* that becomes the `[[Prototype]]` of instances created with `new Constructor()`). These are three different bindings to reason about separately — `dog.__proto__ === Animal.prototype` is true, but `Animal.prototype` is not the prototype of `Animal` itself (that's `Function.prototype`).

`Object.create(null)` produces an object with no prototype at all — no `.toString`, no `.hasOwnProperty`. It's the right tool for a pure dictionary/map use case where you don't want prototype pollution or collisions with inherited property names like `"toString"` or `"constructor"`.

## Own vs inherited properties

`"speak" in dog` returns `true` because `in` checks the whole chain. `dog.hasOwnProperty("speak")` returns `false` because it only checks own properties. This distinction matters constantly when iterating with `for...in`, which (unlike `Object.keys`) also walks inherited enumerable properties.

## Cloning

`{...obj}` and `Object.assign({}, obj)` both do a shallow copy — nested objects are copied by reference, not value. `structuredClone(obj)` does a real deep clone natively, handling circular references, `Map`, `Set`, and `Date`, but it cannot clone functions or DOM nodes and throws on them. The old `JSON.parse(JSON.stringify(obj))` trick deep-clones too, but silently drops `undefined`, functions, and `Symbol` keys, converts `Date` to strings, and breaks on circular references — it's a hack, not a general solution.
