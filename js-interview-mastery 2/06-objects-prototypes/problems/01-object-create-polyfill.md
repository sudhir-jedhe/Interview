# Problem: implement Object.create from scratch

## Requirements

Write `myObjectCreate(proto, propertiesObject)` that behaves like `Object.create`: it returns a new object whose `[[Prototype]]` is `proto`, optionally with additional own properties defined via a `propertiesObject` in the same shape `Object.defineProperties` accepts. `proto` must be either an object or `null`; anything else should throw a `TypeError`, matching native behavior.

## The constructor + prototype trick

Before `Object.setPrototypeOf` and object literals with a `__proto__` key existed, the standard way to make an object inherit from an arbitrary object was to temporarily borrow a throwaway constructor function's `.prototype`:

```js
function myObjectCreate(proto, propertiesObject) {
  if (typeof proto !== "object" && proto !== null) {
    throw new TypeError("Object prototype may only be an Object or null");
  }

  function Temp() {} // a throwaway constructor, never otherwise used
  Temp.prototype = proto; // when `new Temp()` runs, the new object's [[Prototype]] becomes `proto`
  const obj = new Temp();

  if (proto === null) {
    // `new Temp()` with Temp.prototype = null still produces an object whose
    // [[Prototype]] is Object.prototype (engines fall back to Object.prototype
    // when a constructor's .prototype isn't an object) — so we explicitly strip
    // it to match real Object.create(null) semantics.
    Object.setPrototypeOf(obj, null);
  }

  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject);
  }

  return obj;
}
```

### Why the trick works

`new Temp()` performs (roughly) these steps internally: create a brand-new plain object, set its `[[Prototype]]` to `Temp.prototype`, then run `Temp` with `this` bound to that new object. Since `Temp`'s body is empty, the net effect is just "produce an object whose prototype is whatever `Temp.prototype` currently is." By pointing `Temp.prototype` at the caller-supplied `proto` right before constructing, we get an object that inherits from `proto` — without needing any dedicated "set prototype at creation time" API.

## Verifying it works

```js
const base = { greet() { return `hi, ${this.name}`; } };
const obj = myObjectCreate(base, {
  name: { value: "Rex", enumerable: true, writable: true, configurable: true },
});

console.log(obj.greet());                       // "hi, Rex"
console.log(Object.getPrototypeOf(obj) === base); // true
console.log(obj.hasOwnProperty("greet"));         // false — inherited, not own
console.log(obj.hasOwnProperty("name"));          // true

const dict = myObjectCreate(null);
console.log(Object.getPrototypeOf(dict));         // null
console.log(dict.toString);                       // undefined — no inherited methods

try {
  myObjectCreate(42);
} catch (e) {
  console.log(e instanceof TypeError); // true
}
```

## Notes and edge cases

- Native `Object.create(proto)` with `proto` set to any object (not just plain objects — functions and arrays work too) must be supported; the constructor trick handles this fine since `Temp.prototype` accepts any object.
- The `propertiesObject` parameter mirrors `Object.defineProperties`'s format exactly (each key maps to a descriptor, not a raw value) — this is a common detail people get wrong by passing plain values instead of descriptors.
- A fully spec-accurate version would also validate that each entry of `propertiesObject` is itself a valid property descriptor object, but `Object.defineProperties` already does that validation for us when we delegate to it.
