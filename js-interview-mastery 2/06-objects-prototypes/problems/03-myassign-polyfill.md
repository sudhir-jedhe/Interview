# Problem: implement myAssign (an Object.assign polyfill)

## Requirements

Write `myAssign(target, ...sources)` that behaves like `Object.assign`:

- Copies own enumerable properties (both string- and Symbol-keyed) from each source object into `target`, left to right.
- Later sources overwrite earlier ones (and the original `target`) for the same key.
- Mutates and returns `target` itself (not a new object).
- Skips `null`/`undefined` sources silently (a documented native behavior — handy for conditionally spreading optional sources).
- Throws a `TypeError` if `target` itself is `null`/`undefined`.

## Full solution

```js
function myAssign(target, ...sources) {
  if (target === null || target === undefined) {
    throw new TypeError("Cannot convert undefined or null to object");
  }

  const to = Object(target); // boxes primitives, e.g. myAssign(1, {a:1}) -> Number object with .a

  for (const source of sources) {
    if (source === null || source === undefined) continue; // native Object.assign silently skips these

    // Reflect.ownKeys picks up both string and Symbol keys; we still need to
    // filter to only *enumerable* ones, since ownKeys includes non-enumerable too.
    for (const key of Reflect.ownKeys(source)) {
      const descriptor = Object.getOwnPropertyDescriptor(source, key);
      if (descriptor.enumerable) {
        to[key] = source[key]; // a plain assignment, so target's own setters (if any) still run
      }
    }
  }

  return to;
}
```

## Verifying it works

```js
const target = { a: 1 };
const result = myAssign(target, { b: 2 }, { a: 3, c: 4 });
console.log(result);          // { a: 3, b: 2, c: 4 }
console.log(result === target); // true — mutates and returns target itself

// null/undefined sources are skipped
console.log(myAssign({}, null, { x: 1 }, undefined)); // { x: 1 }

// Symbol keys are copied too
const sym = Symbol("s");
const withSymbol = myAssign({}, { [sym]: "value" });
console.log(withSymbol[sym]); // "value"

// non-enumerable properties are NOT copied
const withHidden = {};
Object.defineProperty(withHidden, "hidden", { value: 42, enumerable: false });
console.log(myAssign({}, withHidden)); // {} — hidden was skipped

try {
  myAssign(null, { a: 1 });
} catch (e) {
  console.log(e instanceof TypeError); // true
}
```

## Multiple sources — merge order matters

```js
const defaults = { retries: 3, timeout: 1000 };
const userConfig = { timeout: 5000 };
const overrides = { retries: 0 };

const finalConfig = myAssign({}, defaults, userConfig, overrides);
console.log(finalConfig); // { retries: 0, timeout: 5000 }
```

Each source is applied in order, so this is the standard "defaults, then user config, then hard overrides" merge pattern — whichever source comes last for a given key wins.

## Key implementation notes

- **`Object(target)` boxing**: real `Object.assign` coerces a primitive `target` (like a number or string) into its wrapper object rather than throwing, which is why `Object.assign(1, {a: 1})` doesn't error — it returns a boxed `Number` object with an `.a` property attached. Only `null`/`undefined` targets throw.
- **Enumerable-only copying**: this is the detail most hand-rolled polyfills get wrong — simply doing `for...in` or `Object.keys` misses Symbol keys, while a naive `Reflect.ownKeys` loop without checking `descriptor.enumerable` would incorrectly copy non-enumerable properties that real `Object.assign` skips.
- **Plain assignment, not `defineProperty`**: copying via `to[key] = source[key]` (rather than `Object.defineProperty`) means if `target` already has a setter for that key, real `Object.assign` (and this polyfill) triggers it rather than silently overwriting the descriptor — matching native spec behavior.
