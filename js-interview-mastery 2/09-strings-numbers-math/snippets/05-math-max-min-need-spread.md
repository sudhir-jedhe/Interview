# Math.max/min need spread to work on arrays

```js
const nums = [4, 1, 9, 2];
console.log(Math.max(nums));       // NaN — array isn't a valid single argument
console.log(Math.max(...nums));    // 9
console.log(Math.min(...nums));    // 1
```
