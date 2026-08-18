# Problem: Implement `getType(x)`

## Problem Statement

`typeof` is unreliable for distinguishing `null`, arrays, and plain objects — all three report `'object'`. Implement a `getType(x)` utility that returns a precise, human-readable type string for any JS value, correctly distinguishing at least: `'null'`, `'array'`, `'object'` (plain objects), `'date'`, `'regexp'`, and all the standard primitive names (`'string'`, `'number'`, `'boolean'`, `'undefined'`, `'symbol'`, `'bigint'`, `'function'`).

## Requirements

- `getType(null)` → `'null'` (not `'object'`).
- `getType([])` → `'array'` (not `'object'`).
- `getType({})` → `'object'`.
- `getType(new Date())` → `'date'`.
- `getType(/abc/)` → `'regexp'`.
- `getType(42)` → `'number'`, `getType('x')` → `'string'`, etc. — primitives should still report their normal `typeof` name.
- `getType(function(){})` and `getType(() => {})` → `'function'`.

## Approach

`typeof` is a fine first pass for primitives and functions, but everything else needs `Object.prototype.toString.call(x)`, which returns a reliable `'[object Type]'` tag regardless of how the object was created (unlike `instanceof`, which breaks across realms/iframes and doesn't work for `null`/primitives at all). Extract the `Type` portion and lowercase it, special-casing `null` first since `typeof null === 'object'` would otherwise fall through to the generic branch.

## Solution

```js
function getType(x) {
  if (x === null) return 'null'; // must check before typeof, since typeof null is 'object'

  const primitiveType = typeof x;
  if (primitiveType !== 'object') {
    return primitiveType; // 'string', 'number', 'boolean', 'undefined', 'symbol', 'bigint', 'function'
  }

  // Object.prototype.toString.call gives a reliable internal [[Class]] tag,
  // e.g. '[object Array]', '[object Date]', '[object RegExp]', '[object Object]'.
  const tag = Object.prototype.toString.call(x); // '[object Array]'
  return tag.slice(8, -1).toLowerCase();          // 'array'
}

module.exports = { getType };

// --- verification ---
console.log(getType(null));            // 'null'
console.log(getType(undefined));       // 'undefined'
console.log(getType(42));              // 'number'
console.log(getType('hi'));            // 'string'
console.log(getType(true));            // 'boolean'
console.log(getType(10n));             // 'bigint'
console.log(getType(Symbol('s')));     // 'symbol'
console.log(getType([]));              // 'array'
console.log(getType({}));              // 'object'
console.log(getType(new Date()));      // 'date'
console.log(getType(/abc/));           // 'regexp'
console.log(getType(function () {}));  // 'function'
console.log(getType(() => {}));        // 'function'
console.log(getType(new Map()));       // 'map'
console.log(getType(new Set()));       // 'set'
```

**Why this works:** `Object.prototype.toString.call(x)` is the one reliable, spec-guaranteed way to get an object's internal type tag in JavaScript — it works correctly across realms (unlike `instanceof`), doesn't get fooled by objects with a custom `Symbol.toStringTag`... well, actually it *respects* `Symbol.toStringTag` if present, which is usually what you want for custom class instances too. Checking `typeof x !== 'object'` first is a shortcut that avoids the `[object Function]`-style string parsing for primitives and functions, where `typeof` is already unambiguous and fast.
