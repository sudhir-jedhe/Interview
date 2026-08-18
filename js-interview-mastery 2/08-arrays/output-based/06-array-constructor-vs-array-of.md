# Output: Array(n) sparse holes vs Array.of

```js
console.log(Array(3));
console.log(Array(3).fill(0));
console.log(Array.of(3));
```

**Answer:** `[ <3 empty items> ]`, then `[0, 0, 0]`, then `[3]`

**Why:** `Array(n)` with a single numeric argument creates a sparse array of length `n` with no actual elements (holes), which is why `.fill(0)` is needed to get real, iterable values. `Array.of(3)` instead treats its argument literally as an element to include, producing a one-element array containing the number `3` — this is exactly why `Array.of` exists, to sidestep `Array()`'s special-cased single-number behavior.
