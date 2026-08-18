# Deep-Comparing Configuration Objects to Decide on a Re-render

**Scenario:** You need to write a function that deep-compares two configuration objects (which may contain nested objects, arrays, and primitives) to decide whether to trigger a re-render. What's a correct approach, and where does naive comparison break?

**Approach:** `===` compares references, so two structurally identical objects are never `===` unless they're the same object. A correct deep-equality check must recursively compare primitive values and structurally walk nested reference types:

```js
function deepEqual(a, b) {
  if (a === b) return true; // covers identical primitives & same reference
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => deepEqual(a[key], b[key]));
}

deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
deepEqual({ a: 1 }, { a: '1' }); // false — strict comparison catches type mismatch
```

Edge cases: `NaN` breaks this naive version since `NaN === NaN` is `false` — you'd want `Object.is(a, b)` instead of `===` if NaN-equality matters. Arrays are objects too, so `Object.keys` on an array returns numeric-index keys, which mostly works but doesn't check array-ness explicitly — comparing `{0: 1, 1: 2}` to `[1, 2]` would incorrectly return `true` unless you add an `Array.isArray` check. Circular references (an object referencing itself) would cause infinite recursion without a "seen" set to track visited objects. A more complete, production-ready implementation covering all of these edge cases lives in `../problems/01-deep-equal.md`.
