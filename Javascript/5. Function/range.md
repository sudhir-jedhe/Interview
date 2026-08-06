The function `range` you've written is quite close to the desired behavior. Let's walk through the expected functionality and see how we can enhance it.

### Goal:
We want the `range` function to behave as follows:
- **`range(start, end)`**: Returns an array of numbers from `start` to `end` (inclusive).
- **`range(start)(end)`**: A curried version of the function, where `range` takes the `start` value first and returns a function that takes the `end` value and returns the range as an array.

### How to achieve this:
1. If both `start` and `end` are provided at once (`range(start, end)`), return an array containing the numbers from `start` to `end`.
2. If only `start` is provided, return a function that takes `end` and returns the array (curried function behavior).

### Your existing implementation is almost correct, but let's make sure we handle the case when only `start` is given, and improve the readability.

### Updated `range` function:

```javascript
function range(start, end) {
  if (end === undefined) {
    return function (end) {
      return range(start, end);
    };
  }

  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
}

// Examples:

console.log(range(3, 6)); // [3, 4, 5, 6]
console.log(range(3)(5)); // [3, 4, 5]
console.log(range(3)(0)); // []
```

### Explanation:

1. **If both `start` and `end` are provided** (i.e., `range(3, 6)`), the function immediately constructs the array from `start` to `end`.
2. **If only `start` is provided**, the function returns another function that expects the `end` value, and then it constructs the array from `start` to `end`. This is the curried behavior (i.e., `range(3)(5)`).

### Example Walkthrough:

- **`range(3, 6)`**:
  - Here, both `start` (3) and `end` (6) are provided. The loop will run from 3 to 6, and the array `[3, 4, 5, 6]` will be returned.

- **`range(3)(5)`**:
  - Here, `start` (3) is provided initially. The function returns a new function that expects `end` as an argument. When `5` is passed, the new function returns an array from 3 to 5: `[3, 4, 5]`.

- **`range(3)(0)`**:
  - Here, `start` (3) is provided, and the new function is called with `0`. Since `start` (3) is greater than `end` (0), the loop doesn't run, and an empty array `[]` is returned.

### Final Output:

```javascript
[3, 4, 5, 6] // from range(3, 6)
[3, 4, 5]    // from range(3)(5)
[]           // from range(3)(0)
```