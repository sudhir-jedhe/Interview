# The `typeof` Operator and Its Quirks

`typeof` returns a string describing a value's type, but it has two famous inconsistencies:

```js
typeof null;         // 'object'  — a decades-old bug, kept for backward compatibility
typeof undefined;    // 'undefined'
typeof function(){};  // 'function' — functions get their own typeof result
typeof [];            // 'object'  — arrays are NOT distinguished by typeof
typeof Symbol();      // 'symbol'
typeof 10n;           // 'bigint'
```

## Why `typeof null === 'object'`

This happens because in the original JS engine, values were represented with a type tag, and objects had the tag `0`. `null` was represented as the null pointer (`0x00`), so it accidentally got tagged as an object. Fixing it now would break the web, so it's permanent.

## How to check things reliably instead

- To reliably check for `null`, use `value === null` — never `typeof`.
- To check for arrays, use `Array.isArray(value)`, not `typeof` (which just says `'object'` for both plain objects and arrays).
- To distinguish `null` from a plain object from an array from other primitives in one utility, see `../problems/02-get-type-utility.md`.

`typeof` is most reliable for primitives other than `null` (`'string'`, `'number'`, `'boolean'`, `'undefined'`, `'symbol'`, `'bigint'`) and for detecting functions (`'function'`). For anything object-shaped, it can't tell you *what kind* of object you have — only that it's an `object`.
