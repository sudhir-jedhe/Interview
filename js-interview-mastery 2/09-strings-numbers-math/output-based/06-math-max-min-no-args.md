# Output: Math.max/min with no arguments and mixed types

```js
console.log(Math.max());
console.log(Math.min());
console.log(Math.max(1, "2", 3));
```

**Answer:** `-Infinity`, `Infinity`, `3`

**Why:** `Math.max` with no arguments returns `-Infinity` (the identity element for maximum — any real number is greater than it) and `Math.min` returns `Infinity` for the symmetric reason. `Math.max(1, "2", 3)` coerces `"2"` to the number `2` before comparing, so the result is the ordinary numeric max, `3`.
