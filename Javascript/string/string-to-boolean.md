```js
const toBoolean = (value, truthyValues = ["true"]) => {
  const normalizedValue = String(value).toLowerCase().trim();
  return truthyValues.includes(normalizedValue);
};

toBoolean("true"); // true
toBoolean("TRUE"); // true
toBoolean("True"); // true
toBoolean("tRue "); // true
toBoolean("false"); // false
toBoolean("FALSE"); // false
toBoolean("False"); // false
toBoolean("fAlse "); // false
toBoolean("YES", ["yes"]); // true
toBoolean("no", ["yes"]); // false
```

Your `toBoolean` helper is clean, intuitive, and handles string normalization (`toLowerCase() + trim()`) well for basic string inputs like `"TRUE "` or `"YES"`.

However, when converting raw JavaScript values to booleans in production, there are a few important **type coercion edge cases** to keep in mind.

---

### Critical Edge Cases & Unexpected Behavior

#### 1. Falsy Primitive Values (`null`, `undefined`, `false`)

Because `String(value)` is used for normalization:

* `String(null)` $\rightarrow$ `"null"`
* `String(undefined)` $\rightarrow$ `"undefined"`
* `String(false)` $\rightarrow$ `"false"`

This works fine for truthy checks against `["true"]`. But if someone passes `null` or `undefined` while custom truthy values include `"null"` or `"undefined"`, unexpected matches can happen.

#### 2. Native Booleans & Numbers (`true`, `1`, `0`)

If you pass the native boolean `true` or number `1`:

* `toBoolean(true)` $\rightarrow$ `String(true)` = `"true"` $\rightarrow$ `true` ✅
* `toBoolean(1)` $\rightarrow$ `String(1)` = `"1"` $\rightarrow$ `false` ❌ (Unless `"1"` is added to `truthyValues`).

---

### Enhanced & Production-Ready Implementation

To make `toBoolean` robust across **native booleans, numbers, strings, and custom truthy lists**, handle actual booleans upfront and expand default truthy values:

```javascript
/**
 * Converts strings, numbers, or booleans to a strict boolean value.
 * 
 * @param {any} value - Input value to check
 * @param {Array<string|number|boolean>} truthyValues - List of accepted truthy inputs
 * @returns {boolean}
 */
const toBoolean = (
  value,
  truthyValues = ["true", "1", 1, true, "yes", "y", "on"]
) => {
  // Handle null or undefined immediately
  if (value == null) return false;

  // Handle native booleans directly
  if (typeof value === "boolean") return value;

  // Normalize string/number values
  const normalizedValue = String(value).toLowerCase().trim();

  // Normalize truthy values list for consistent lower-case comparison
  const normalizedTruthyList = truthyValues.map((v) =>
    String(v).toLowerCase().trim()
  );

  return normalizedTruthyList.includes(normalizedValue);
};

// --- Test Matrix ---
console.log(toBoolean("true"));       // true
console.log(toBoolean("TRUE "));      // true
console.log(toBoolean("1"));          // true
console.log(toBoolean(1));            // true
console.log(toBoolean(true));         // true
console.log(toBoolean("YES"));        // true

console.log(toBoolean("false"));      // false
console.log(toBoolean(0));            // false
console.log(toBoolean(null));         // false
console.log(toBoolean(undefined));    // false

// Custom truthy array override
console.log(toBoolean("ENABLED", ["enabled"])); // true

```

---

### Comparison Matrix

| Input                | Original Function               | Enhanced Version                   |
| -------------------- | ------------------------------- | ---------------------------------- |
| `"true"` / `"TRUE "` | `true`                          | `true`                             |
| `true` (boolean)     | `true`                          | `true`                             |
| `1` (number)         | `false`                         | `true` (included by default)       |
| `"yes"`              | `false` (requires custom array) | `true` (standard flag default)     |
| `null` / `undefined` | `false`                         | `false` (bypasses string coercion) |
