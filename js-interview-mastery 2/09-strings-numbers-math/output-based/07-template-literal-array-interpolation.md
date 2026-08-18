# Output: Template literal interpolation of an array and reduce

```js
const arr = [1, 2, 3];
console.log(`Values: ${arr}`);
console.log(`Sum: ${arr.reduce((a, b) => a + b)}`);
```

**Answer:** `"Values: 1,2,3"` then `"Sum: 6"`

**Why:** Template literal interpolation coerces any expression to a string via the same mechanism as string concatenation; arrays convert to strings by joining their elements with commas (equivalent to calling `.join(",")`), so `arr` becomes `"1,2,3"`. `reduce` without an initial value uses the first element (`1`) as the starting accumulator and sums the rest, giving `6`, which then interpolates normally as a number-turned-string.
