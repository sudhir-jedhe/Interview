# Problem: implement a deep-clone function (no JSON tricks)

## Requirements

Write `deepClone(value)` that produces a fully independent copy of nested objects and arrays, correctly handling:

- Plain objects and arrays, nested arbitrarily deep
- `Date` objects (cloned as new `Date` instances with the same time, not stringified)
- Functions (JSON.stringify silently drops these — we should preserve them, by reference, since functions can't meaningfully be "deep cloned")
- Circular references (an object that references itself, directly or indirectly, must not blow the stack)
- `Map` and `Set`

This is explicitly *not* allowed to use `JSON.parse(JSON.stringify(...))`, since that trick loses functions, `Date` types, `undefined` values, and throws on circular references — exactly the cases this exercise is testing.

## Full solution

```js
function deepClone(value, seen = new WeakMap()) {
  // Primitives (including null) and functions are returned as-is —
  // functions aren't meaningfully cloneable, and primitives are already immutable.
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Circular reference guard: if we've already started cloning this exact
  // object, return the clone we already created for it instead of recursing forever.
  if (seen.has(value)) {
    return seen.get(value);
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (value instanceof Map) {
    const cloned = new Map();
    seen.set(value, cloned);
    for (const [k, v] of value) {
      cloned.set(deepClone(k, seen), deepClone(v, seen));
    }
    return cloned;
  }

  if (value instanceof Set) {
    const cloned = new Set();
    seen.set(value, cloned);
    for (const item of value) {
      cloned.add(deepClone(item, seen));
    }
    return cloned;
  }

  if (Array.isArray(value)) {
    const cloned = [];
    seen.set(value, cloned);
    value.forEach((item, i) => {
      cloned[i] = deepClone(item, seen);
    });
    return cloned;
  }

  // Plain object (or object with a custom prototype) — preserve the prototype
  // rather than always producing a plain {} clone.
  const cloned = Object.create(Object.getPrototypeOf(value));
  seen.set(value, cloned);
  for (const key of Reflect.ownKeys(value)) { // includes Symbol keys, unlike Object.keys
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor.value !== undefined || descriptor.hasOwnProperty("value")) {
      cloned[key] = deepClone(value[key], seen);
    } else {
      Object.defineProperty(cloned, key, descriptor); // preserve getters/setters as-is
    }
  }
  return cloned;
}
```

## Verifying it works

```js
const original = {
  name: "Ada",
  born: new Date("1815-12-10"),
  tags: ["math", "computing"],
  greet() { return `hi, ${this.name}`; }, // function — kept by reference
};
original.self = original; // circular reference

const clone = deepClone(original);

console.log(clone.name);                 // "Ada"
console.log(clone.born instanceof Date);  // true
console.log(clone.born !== original.born); // true — a new Date instance, not the same one
console.log(clone.tags !== original.tags); // true — new array
console.log(clone.greet === original.greet); // true — functions are shared by reference
console.log(clone.self === clone);         // true — circular reference preserved, no infinite loop

const map = new Map([["a", { nested: 1 }]]);
const clonedMap = deepClone(map);
clonedMap.get("a").nested = 99;
console.log(map.get("a").nested); // 1 — untouched, independent clone
```

## Key implementation notes

- **`WeakMap` for cycle detection**: as each object starts being cloned, its clone is immediately registered in `seen` *before* recursing into its properties — so if a nested property later references back to the original object (directly or through several levels), `deepClone` finds the already-in-progress clone instead of recursing infinitely. `WeakMap` (rather than `Map`) is used so it doesn't prevent garbage collection of the original objects once cloning finishes.
- **Functions are returned by reference**, not cloned — there's no general way to "deep clone" a function's closure, and doing so isn't usually the intent; this mirrors how most real-world deep-clone utilities (like Lodash's `cloneDeep`) behave.
- **`Reflect.ownKeys`** is used instead of `Object.keys` so `Symbol`-keyed properties are also cloned, which `JSON.stringify` silently drops entirely.
- **Prototype preservation**: `Object.create(Object.getPrototypeOf(value))` means cloning a class instance produces another instance of the same class (with its methods intact via the shared prototype), rather than collapsing everything to a plain object.
