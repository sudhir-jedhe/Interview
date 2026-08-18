# Problem: Implement `deepEqual(a, b)`

## Problem Statement

Implement a `deepEqual(a, b)` function that recursively compares two values for structural equality — correctly handling primitives, plain objects, arrays, and `NaN` (which naive `===`-based comparisons get wrong).

## Requirements

- Primitives compare by value, with `NaN` treated as equal to `NaN` (unlike `===`).
- Two objects are equal if they have the same set of own enumerable keys, and every value at each key is (recursively) deep-equal.
- Two arrays are equal if they have the same length and every element is (recursively) deep-equal. An array must **not** be considered equal to a plain object with the same numeric keys.
- Different types (e.g. `1` vs `'1'`) are never equal.
- `null` is handled explicitly — `typeof null === 'object'`, so it needs a guard before recursing into "object" logic.

## Approach

Handle the `NaN` case up front with `Object.is`, which treats `NaN` as equal to itself (unlike `===`). Then branch on type: if either value isn't an object (or is `null`), fall back to `Object.is` for the final comparison. Otherwise, check that both are arrays or both are non-arrays (never mixed), compare lengths/key counts, and recurse into every key.

## Solution

```js
function deepEqual(a, b) {
  // Object.is handles NaN === NaN correctly (true) and +0/-0 correctly (false),
  // unlike ===, and covers identical primitives/references in one check.
  if (Object.is(a, b)) return true;

  const aIsObject = typeof a === 'object' && a !== null;
  const bIsObject = typeof b === 'object' && b !== null;
  if (!aIsObject || !bIsObject) return false; // primitives that aren't Object.is-equal are just unequal

  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  if (aIsArray !== bIsArray) return false; // an array must never equal a plain object

  if (aIsArray) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]));
}

module.exports = { deepEqual };

// --- verification ---
console.log(deepEqual(1, 1));                          // true
console.log(deepEqual(NaN, NaN));                       // true — the whole point of using Object.is
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual({ a: 1 }, { a: '1' }));            // false — type mismatch
console.log(deepEqual([1, 2, 3], [1, 2, 3]));            // true
console.log(deepEqual([1, 2], { 0: 1, 1: 2 }));          // false — array vs plain object
console.log(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })); // true
console.log(deepEqual(null, undefined));                 // false — different values, neither is an object here
console.log(deepEqual(null, null));                       // true — Object.is(null, null) is true
```

**Why this works:** `Object.is` as the first check elegantly handles three tricky cases at once (identical primitives, `NaN`, and identical references) without special-casing any of them manually. Explicitly checking `Array.isArray` on both sides before falling into the generic object-key comparison prevents the classic bug where `{0: 1, 1: 2}` (a plain object) would otherwise look structurally identical to `[1, 2]`. Using `hasOwnProperty` when checking `b`'s keys (rather than just `key in b`) avoids false positives from inherited properties.

**Known limitation:** this implementation doesn't guard against circular references — a self-referencing object would cause infinite recursion. See `03-safe-json-stringify-circular-refs.md` for the pattern (a "seen" tracking set) that fixes that class of bug, which could be layered onto `deepEqual` the same way if needed.
