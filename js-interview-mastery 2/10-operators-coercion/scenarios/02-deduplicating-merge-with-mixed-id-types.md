# Scenario: Deduplicating an API response merge that mixes `==` and `===` inconsistently

A legacy codebase merges two lists of user records from different services, matching on `record.id`, but IDs sometimes arrive as numbers from one service and strings from the other (`42` vs `"42"`). Some merge logic uses `==` and works "by accident," other parts use `===` and silently fail to match. How do you fix this properly rather than relying on `==` coercion?

**Approach:** Relying on `==`'s coercion here is fragile and implicit — normalize types explicitly at the boundary instead, and always compare with `===` after that:

```js
function normalizeId(id) { return String(id); }

function mergeById(listA, listB) {
  const map = new Map();
  for (const record of listA) map.set(normalizeId(record.id), record);
  for (const record of listB) {
    const key = normalizeId(record.id);
    map.set(key, { ...map.get(key), ...record }); // later source wins on conflicting fields
  }
  return [...map.values()];
}
```

This removes any dependence on `==`'s coercion rules, makes the matching logic self-documenting, and avoids latent bugs where `==` "just happens" to work for `42 == "42"` but would silently misbehave for less obvious mismatches (e.g., an ID that's an object, or `""` vs `0`). Edge case: decide up front what happens on true ID collisions with conflicting data — the example above lets the second list win, but that should be an explicit, reviewed decision, not an accident of merge order.
