# Scenario: A settings form where a "0" input silently resets to a default

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
