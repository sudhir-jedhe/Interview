# Output: flat's default depth

```js
console.log([1, [2, [3, [4]]]].flat());
console.log([1, [2, [3, [4]]]].flat(2));
```

**Answer:** `[1, 2, [3, [4]]]` then `[1, 2, 3, [4]]`

**Why:** `flat()` defaults to depth `1`, flattening only one level of nesting, so the innermost `[3, [4]]` stays nested inside the second-level array. `flat(2)` flattens two levels, unwrapping one more layer and exposing `3` while leaving `[4]` (three levels deep) still wrapped.
