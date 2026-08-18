# Problem: Implement `pick(obj, keys)` and `omit(obj, keys)` using destructuring + rest

Implement two general-purpose utilities: `pick(obj, keys)` returns a new object with only the given keys, and `omit(obj, keys)` returns a new object with everything except the given keys — both built primarily with destructuring/rest rather than manual loops.

## Requirements

- `pick(obj, ["a", "c"])` returns an object with only `a` and `c` (if present).
- `omit(obj, ["password"])` returns an object with everything except `password`.
- `keys` is an array (not variadic arguments), matching how these utilities are typically called in real codebases (`pick(user, ["id", "name"])`).
- Missing keys in `pick` should not appear in the result at all (cleaner than including them as `undefined`).

## Solution

```js
function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

function omit(obj, keys) {
  const keysToOmit = new Set(keys);
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keysToOmit.has(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

const user = { id: 1, name: 'Rey', email: 'rey@example.com', password: 'hunter2' };

console.log(pick(user, ['id', 'name']));
// { id: 1, name: 'Rey' }

console.log(pick(user, ['id', 'nonexistent']));
// { id: 1 } — "nonexistent" silently skipped, not included as undefined

console.log(omit(user, ['password']));
// { id: 1, name: 'Rey', email: 'rey@example.com' }
```

## A destructuring-based `omit` for a fixed, known key

When the key(s) to omit are literal identifiers known at write-time (not a dynamic array), rest destructuring is the cleanest possible expression of "omit":

```js
function omitPassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

console.log(omitPassword(user));
// { id: 1, name: 'Rey', email: 'rey@example.com' }
```

This only works for statically-known keys — you cannot write `const { ...dynamicKeys } = obj` to omit a variable list of keys, which is exactly why the general-purpose `omit(obj, keys)` above falls back to `Object.keys` + a `Set` membership check instead.

## Why it works

`pick` iterates the *requested* keys and copies each one over only if it actually exists on the source object (`key in obj`, which also correctly returns `true` for inherited enumerable properties, matching how `for...in` would see them) — this is why asking for a nonexistent key doesn't leave a stray `undefined` entry in the result. `omit` inverts the approach: it iterates the *source object's own* keys and copies over everything **not** in the omit set, using a `Set` for O(1) membership checks rather than `keysToOmit.includes(key)` (an O(n) array scan) on every iteration.

## Edge cases worth testing

```js
console.log(pick(user, []));          // {} — empty key list picks nothing
console.log(omit(user, []));          // full shallow copy of user — nothing omitted
console.log(pick({}, ['a']));         // {} — picking from an empty object never throws
```
