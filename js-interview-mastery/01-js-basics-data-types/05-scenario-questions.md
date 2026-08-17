# JS Basics & Data Types — Scenario Questions

### 1. You're writing a function that updates a user's settings object, but callers keep reporting that their original settings object gets mutated when they didn't expect it. How do you fix this, and what are the edge cases?

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

---

### 2. You're validating a numeric form input from the user before submitting it to an API. How do you correctly detect invalid ("not a number") input, and what are the trap cases?

**Approach:** Don't reach for global `isNaN` — it coerces its argument, producing false positives/negatives. Convert deliberately, then check with `Number.isNaN`:

```js
function isValidNumberInput(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return false;
  const n = Number(raw);
  return !Number.isNaN(n) && Number.isFinite(n);
}

isValidNumberInput('42');      // true
isValidNumberInput('  42  ');  // true — Number() trims whitespace
isValidNumberInput('');        // false — Number('') is 0, but we reject empty explicitly
isValidNumberInput('abc');     // false
isValidNumberInput('Infinity'); // false — Number.isFinite catches this
isValidNumberInput(null);      // false — wrong type entirely
```

Edge cases: `Number('')` returns `0`, not `NaN`, so an empty field would silently pass unless you check for empty strings separately. `Number('Infinity')` is a valid finite-looking string but not a valid form value, hence the `Number.isFinite` check. Also watch for `Number('  ')` (whitespace-only) — it also becomes `0`, so trimming and checking emptiness first is essential.

---

### 3. You need to write a function that deep-compares two configuration objects (which may contain nested objects, arrays, and primitives) to decide whether to trigger a re-render. What's a correct approach, and where does naive comparison break?

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

Edge cases: `NaN` breaks this naive version since `NaN === NaN` is `false` — you'd want `Object.is(a, b)` instead of `===` if NaN-equality matters. Arrays are objects too, so `Object.keys` on an array returns numeric-index keys, which mostly works but doesn't check array-ness explicitly — comparing `{0: 1, 1: 2}` to `[1, 2]` would incorrectly return `true` unless you add an `Array.isArray` check. Circular references (an object referencing itself) would cause infinite recursion without a "seen" set to track visited objects.

---

### 4. Your team's linter flags every use of `==` and insists on `===`, but a teammate says `value == null` should be allowed as an exception. Do you agree, and how would you explain the tradeoff to the team?

**Approach:** Yes, this is a widely accepted, deliberate exception. `value == null` is `true` for both `null` and `undefined` and `false` for everything else (including `0`, `''`, `false`, `NaN`), because `==` special-cases `null` to only loosely equal `undefined`. It's a concise, well-understood idiom for "value is missing," and it's arguably clearer than `value === null || value === undefined`.

```js
function getOrDefault(value, fallback) {
  return value == null ? fallback : value;
}

getOrDefault(0, 10);         // 0   — 0 is not "missing"
getOrDefault(null, 10);      // 10
getOrDefault(undefined, 10); // 10
```

The tradeoff to communicate: this exception only works safely because `==` with `null` has exactly one special case, unlike `==` between numbers/strings/booleans, which has many coercion pitfalls (`'' == 0`, `[] == false`). Recommend allowing `== null` specifically (many linters support an `eqeqeq: ["error", "always", { null: "ignore" }]` config) while still banning `==` everywhere else, rather than a blanket ban that forces awkward double-equality checks.
