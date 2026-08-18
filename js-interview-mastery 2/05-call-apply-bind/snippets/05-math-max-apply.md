# Snippet: using apply with Math.max to find the max of an array

```js
const nums = [3, 7, 2, 9, 4];
console.log(Math.max.apply(null, nums)); // 9
console.log(Math.max(...nums));          // 9 — modern equivalent with spread
```

`Math.max` expects individual numeric arguments, not an array. `apply` spreads `nums` into separate arguments; the spread operator does the same thing at the call site and is the preferred modern idiom.
