# Scenario: Writing `pickFields`/`omitFields` helpers

You need to write a function `pickFields(obj, ...keys)` that returns a new object containing only the specified keys, and a companion `omitFields(obj, ...keys)` that returns everything except those keys. How would you implement both cleanly using destructuring/rest, and what happens if a requested key doesn't exist?

**Approach:**
```js
function pickFields(obj, ...keys) {
  return Object.fromEntries(keys.map(k => [k, obj[k]]));
}

function omitFields(obj, ...keysToOmit) {
  const omitSet = new Set(keysToOmit);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !omitSet.has(k))
  );
}

const user = { id: 1, name: 'Rey', password: 'hunter2' };
pickFields(user, 'id', 'name');      // { id: 1, name: 'Rey' }
omitFields(user, 'password');        // { id: 1, name: 'Rey' }
```
For `omitFields` with a *fixed, known* single key, rest destructuring is actually cleaner: `const { password, ...safe } = user;`. But that pattern only works when the keys to omit are literal identifiers known at write-time, not when they're dynamic/variable — which is why the generic version above uses `Object.entries` + `filter` instead. If a requested key in `pickFields` doesn't exist on `obj`, `obj[k]` is `undefined`, and the result object will still contain that key with an `undefined` value — decide up front whether callers expect missing keys to be silently included as `undefined` or excluded entirely (filter them out with `.filter(([k]) => k in obj)` if the latter).
