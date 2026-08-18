# Set for instant de-duplication with insertion order preserved

```js
const nums = [3, 1, 2, 3, 1];
console.log([...new Set(nums)]);
// [ 3, 1, 2 ]
```

`new Set(nums)` drops duplicates while iterating in original insertion order, and spreading it back into an array (`[...set]`) gives a deduplicated array in one line — the idiomatic replacement for a manual `filter` + `indexOf` dedup loop.
