# Scenario: detecting whether two "equal-looking" objects share mutable state

**Prompt:** Your team has a bug where updating one object in a list also silently changes another. You suspect a shallow clone was used somewhere it shouldn't have been. How would you track this down and what would the fix look like?

**Approach:** First, verify the hypothesis by reference-comparing nested fields, not the top-level objects:

```js
function findSharedRefs(a, b, path = "") {
  if (a === b && typeof a === "object" && a !== null) {
    console.log("Shared reference at:", path || "(root)");
    return;
  }
  if (typeof a === "object" && a && typeof b === "object" && b) {
    for (const key of Object.keys(a)) {
      if (key in b) findSharedRefs(a[key], b[key], `${path}.${key}`);
    }
  }
}
```

Once located, the fix is almost always replacing `{ ...original }` (or `Object.assign({}, original)`) with `structuredClone(original)` at the point where independent copies are actually required, or restructuring the code so updates go through an immutable-update pattern (`{ ...original, nested: { ...original.nested, field: newValue } }`) instead of relying on a full deep clone every time, which can be wasteful for large objects.
