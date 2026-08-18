# Preventing Accidental Mutation of a Settings Object

**Scenario:** You're writing a function that updates a user's settings object, but callers keep reporting that their original settings object gets mutated when they didn't expect it. How do you fix this, and what are the edge cases?

**Approach:** The bug is almost certainly that the function mutates the object it receives directly, since objects are passed by reference. The fix is to return a new object instead of mutating the input:

```js
function updateSettings(settings, changes) {
  return { ...settings, ...changes }; // shallow copy + overrides
}

const original = { theme: 'dark', notifications: true };
const updated = updateSettings(original, { theme: 'light' });

console.log(original.theme); // 'dark' — untouched
console.log(updated.theme);  // 'light'
```

Edge case: `{ ...settings }` is a **shallow** copy. If `settings` has nested objects (e.g. `settings.privacy = { shareEmail: false }`), the nested object is still shared by reference between `original` and `updated`. Mutating `updated.privacy.shareEmail` would still affect `original.privacy`. For nested data, either spread each nested level explicitly, use `structuredClone(settings)` for a true deep clone, or adopt an immutable-update library (e.g. Immer) once the shape gets complex.
