# Scenario Questions: Destructuring, Spread & Rest

**You're writing a function `updateConfig(currentConfig, changes)` that must return a new config object with `changes` applied, without mutating `currentConfig`. The config has a nested `network: { retries, timeout }` object, and callers sometimes only pass a partial update to `network`. How do you implement this correctly, and what's the trap?**

**Approach:**
A single top-level spread is not enough because `network` is nested — a shallow merge would silently overwrite the entire `network` object instead of merging into it.

```js
function updateConfig(currentConfig, changes) {
  return {
    ...currentConfig,
    ...changes,
    network: {
      ...currentConfig.network,
      ...(changes.network || {}),
    },
  };
}

const base = { theme: 'dark', network: { retries: 3, timeout: 5000 } };
const updated = updateConfig(base, { network: { timeout: 8000 } });
// updated.network = { retries: 3, timeout: 8000 } — retries preserved
```
The trap: `{ ...currentConfig, ...changes }` alone would replace `network` wholesale with whatever `changes.network` is (or delete it if `changes.network` is undefined but the key is present as `undefined`), losing `retries`. Any nested field needs its own explicit spread merge, one level per nesting depth — this is why libraries like Immer or lodash's `merge` exist for genuinely deep structures.

---

**You need to write a function `pickFields(obj, ...keys)` that returns a new object containing only the specified keys, and a companion `omitFields(obj, ...keys)` that returns everything except those keys. How would you implement both cleanly using destructuring/rest, and what happens if a requested key doesn't exist?**

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

---

**You're converting a REST API's positional-style helper `formatDate(y, m, d)` into a more ergonomic call site that also supports an options bag for formatting (`separator`, `padZeros`). Design the function signature so callers can do `formatDate(2024, 1, 5)` or `formatDate(2024, 1, 5, { separator: '/' })`, with sensible defaults.**

**Approach:**
```js
function formatDate(year, month, day, { separator = '-', padZeros = true } = {}) {
  const pad = (n) => (padZeros ? String(n).padStart(2, '0') : String(n));
  return [year, pad(month), pad(day)].join(separator);
}

formatDate(2024, 1, 5);                       // "2024-01-05"
formatDate(2024, 1, 5, { separator: '/' });   // "2024/01/05"
formatDate(2024, 1, 5, {});                   // "2024-01-05" (defaults fill in)
```
The key detail is the `= {}` default on the options parameter itself — without it, calling `formatDate(2024, 1, 5)` (no fourth argument) would try to destructure `undefined` and throw a `TypeError`. Nested defaults (`separator = '-'`) only handle missing/undefined *properties*; the outer `= {}` handles a missing *argument* entirely. Both are needed for a truly optional trailing options object.

---

**A charting library gives you an array of data points as `[timestamp, value, metadata]` tuples, but 80% of call sites only care about `timestamp` and `value` and ignore `metadata`. You also occasionally get legacy 2-element tuples without metadata. Write a normalization step that's robust to both shapes.**

**Approach:**
```js
function normalizePoint([timestamp, value, metadata = {}]) {
  return { timestamp, value, metadata };
}

console.log(normalizePoint([1000, 42]));
// { timestamp: 1000, value: 42, metadata: {} }

console.log(normalizePoint([1000, 42, { source: 'sensorA' }]));
// { timestamp: 1000, value: 42, metadata: { source: 'sensorA' } }
```
Destructuring directly in the parameter list handles both tuple shapes in one line: the default `= {}` on `metadata` only fires because array destructuring yields `undefined` for a missing index (index 2 on a 2-element array), exactly the same rule as object destructuring defaults. This avoids manual `arr.length === 3 ? arr[2] : {}` branching entirely.
