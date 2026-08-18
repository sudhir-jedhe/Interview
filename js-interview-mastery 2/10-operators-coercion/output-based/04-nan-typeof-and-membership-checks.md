# Output: NaN's typeof and membership checks

```js
console.log(typeof NaN);
console.log(NaN === NaN);
console.log([NaN, NaN].indexOf(NaN));
console.log([NaN, NaN].includes(NaN));
```

**Answer:** `"number"`, `false`, `-1`, `true`

**Why:** `NaN` is, perhaps counterintuitively, a numeric value (`typeof NaN === "number"`), but by IEEE-754 definition it's not equal to any value including itself. `indexOf` uses strict `===` internally, so it can never find a `NaN` (always `-1`). `includes` uses the SameValueZero algorithm instead, which treats `NaN` as equal to `NaN` specifically for this kind of membership check, so it correctly returns `true`.
