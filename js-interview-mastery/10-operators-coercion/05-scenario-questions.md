# Scenario Questions: Operators & Coercion

## 1. A settings form where a "0" input silently resets to a default

Users report that typing `0` into a "discount percentage" field always reverts to the default of `10` after saving. The relevant code is `const discount = formValue || 10;`. Diagnose the bug and fix it.

**Approach:** `0` is falsy, so `formValue || 10` treats an intentionally-entered `0` exactly the same as a missing/undefined value, always substituting `10`. The fix is `??`, which only falls back on `null`/`undefined`:

```js
function getDiscount(formValue) {
  return formValue ?? 10;
}
console.log(getDiscount(0));         // 0 — correct, user's real input
console.log(getDiscount(undefined)); // 10 — correct default
console.log(getDiscount(""));        // "" — if empty string is a valid "unset" signal from your form library, you may still want a falsy check here specifically for ""
```

Edge case worth clarifying with product/design: if the form emits `""` for an empty field rather than `undefined`/`null`, `??` alone won't catch it — you may need `formValue === "" ? 10 : Number(formValue) ?? 10` or to normalize empty strings to `null` upstream in the form layer before this logic runs.

## 2. Deduplicating an API response merge that mixes `==` and `===` inconsistently

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

## 3. Safely reading deeply nested, possibly-missing API response fields

You're consuming a third-party API response where `response.data.user.profile.avatarUrl` might be missing at any level depending on the user's account state, and the old code (`response.data && response.data.user && response.data.user.profile && response.data.user.profile.avatarUrl`) is error-prone to extend and doesn't have a fallback. Rewrite it robustly.

**Approach:** Combine optional chaining with nullish coalescing for a concise, safe read with a fallback:

```js
const avatarUrl = response?.data?.user?.profile?.avatarUrl ?? "/default-avatar.png";
```

This short-circuits to `undefined` the instant any link in the chain is `null`/`undefined`, without throwing, and `??` supplies the fallback only for that genuinely-missing case — not for an intentionally empty string if the API ever returns `avatarUrl: ""` to mean "no avatar, explicitly." If an empty string *should* also trigger the fallback (common for image URLs, since `""` is not a usable src), you'd need `|| "/default-avatar.png"` instead, or an explicit check — worth clarifying against the API contract rather than guessing.

## 4. Writing a strict "is this value present" utility used across a large codebase

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
