# Snippet: sort() and reverse() mutate in place

```js
const nums = [3, 1, 2];
const sorted = nums.sort();
console.log(nums === sorted); // true, same array reference
console.log(nums);            // [1, 2, 3]
```

`sort()` reorders `nums` directly and returns a reference to that same array — `sorted` isn't a new array, it's just another name for `nums`.
