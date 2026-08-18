# The prototype chain, and the three ways to access it

## The prototype chain

Every object has an internal `[[Prototype]]` link (except objects created with `Object.create(null)`). When you access `obj.prop` and `prop` isn't an own property, the engine walks up `[[Prototype]]` links until it finds the property or hits `null`. This is how methods like `.toString()` or array methods work without being copied onto every instance.

```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return `${this.name} makes a sound`; };

const dog = new Animal("Rex");
dog.speak();                 // found on Animal.prototype, not on dog itself
dog.hasOwnProperty("speak"); // false
```

```js
const base = { greet() { return "hi from base"; } };
const mid = Object.create(base);
const top = Object.create(mid);
top.greet = function () { return "hi from top"; };

console.log(top.greet());              // "hi from top" (own property wins)
delete top.greet;
console.log(top.greet());              // "hi from base" (falls through to base)
```

`Object.create(null)` produces an object with no prototype at all — no `.toString`, no `.hasOwnProperty`. It's the right tool for a pure dictionary/map use case where you don't want prototype pollution or collisions with inherited property names like `"toString"` or `"constructor"` (see `../scenarios/02-safe-key-value-store-object-create-null.md`).

```js
const dict = Object.create(null);
dict.toString = "not a function anymore, just a key";
console.log(dict.toString);            // "not a function anymore, just a key"
console.log(Object.prototype.toString.call(dict)); // "[object Object]"
```

## Three different, easily-confused things

There are three distinct but related things for working with an object's prototype:

| Aspect | `__proto__` | `Object.getPrototypeOf`/`setPrototypeOf` | `Constructor.prototype` |
|---|---|---|---|
| What it is | Accessor property exposing `[[Prototype]]` | Standard functions doing the same job | A regular property *on a function*, used as the prototype for `new` instances |
| Standard status | Legacy, in Annex B (web-compat only) | Fully standard, ES2015+ | Fully standard, always existed |
| Where it lives | On `Object.prototype`, inherited by instances | Static methods on `Object` | On the constructor function itself |

`dog.__proto__ === Animal.prototype` is true, but `Animal.prototype` is not the prototype of `Animal` itself (that's `Function.prototype`, since `Animal` is a function). Prefer `Object.getPrototypeOf`/`setPrototypeOf` in real code — `__proto__` is technically supported everywhere but discouraged in specs and linters. `Constructor.prototype` is a different concept entirely: it's not an instance's prototype, it's the object that *becomes* an instance's prototype after `new`. The most common confusion is thinking `instance.prototype` exists — it doesn't; only functions have a `.prototype` property, instances have `[[Prototype]]` (accessed via `__proto__` or `getPrototypeOf`).

```js
console.log(Object.getPrototypeOf({}) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype));         // null — top of the chain
```
