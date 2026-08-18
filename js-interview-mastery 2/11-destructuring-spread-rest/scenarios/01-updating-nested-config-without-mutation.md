# Scenario: Updating a nested config object without mutation

You're writing a function `updateConfig(currentConfig, changes)` that must return a new config object with `changes` applied, without mutating `currentConfig`. The config has a nested `network: { retries, timeout }` object, and callers sometimes only pass a partial update to `network`. How do you implement this correctly, and what's the trap?

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
