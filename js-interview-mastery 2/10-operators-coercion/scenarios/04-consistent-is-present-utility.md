# Scenario: Writing a strict "is this value present" utility used across a large codebase

Your team keeps writing inconsistent presence checks (`if (value)`, `if (value != null)`, `if (value !== undefined)`) that behave differently for `0`, `""`, and `NaN`, causing intermittent bugs. Design one `isPresent` utility with clearly documented, consistent semantics, and show how it differs from a naive truthy check.

**Approach:** Define "present" as "not null and not undefined" — deliberately excluding truthy/falsy semantics so `0`, `""`, and `false` all count as present, valid values:

```js
function isPresent(value) {
  return value !== null && value !== undefined;
}

console.log(isPresent(0));         // true — a valid value, not "missing"
console.log(isPresent(""));        // true — same
console.log(isPresent(NaN));       // true — NaN is a value, just not a *valid number*, different concern
console.log(isPresent(null));      // false
console.log(isPresent(undefined)); // false
```

This intentionally separates two different concerns that naive `if (value)` conflates: "is data present at all" (this utility's job) versus "is the value valid/non-empty for this specific field" (a separate, field-specific validation concern, e.g. checking `Number.isNaN` explicitly or string length separately). Standardizing on `isPresent` throughout the codebase and reserving truthy checks only for genuinely boolean-flag contexts eliminates an entire category of `0`/`""`-related bugs.
