# Output: Math.max with apply vs call

```js
const numbers = [5, 1, 9, 3];
console.log(Math.max.apply(Math, numbers));
console.log(Math.max.call(Math, numbers));
```

**Answer:** `9` then `NaN`

**Why:** `apply` correctly spreads the array `numbers` into individual arguments for `Math.max`, so it compares `5, 1, 9, 3` and returns `9`. `call` passes `numbers` as a single argument (not spread), so `Math.max` is effectively called with one argument — the array itself — which coerces to `NaN` when compared numerically, since an array of multiple numbers doesn't convert cleanly to a single number.
