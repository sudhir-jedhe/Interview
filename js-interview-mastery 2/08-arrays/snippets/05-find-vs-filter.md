# Snippet: find vs filter — element vs array

```js
const nums = [1, 2, 3, 4];
console.log(nums.find((n) => n > 2));   // 3 — first match, a single value
console.log(nums.filter((n) => n > 2)); // [3, 4] — all matches, an array
```

`find` stops at the first match and returns it directly; `filter` always scans the whole array and returns every match wrapped in a new array.
