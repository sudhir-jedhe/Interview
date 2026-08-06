The provided function `isNumberInteger` checks if a given number is an integer by determining whether the remainder of the number when divided by `1` is zero. Here's how it works:

### Explanation
- **`num % 1`**:
  - When dividing any number by `1`, the remainder will be `0` if the number is an integer (e.g., `4 % 1 === 0`).
  - If the number has a fractional part, the remainder will be non-zero (e.g., `4.5 % 1 === 0.5`).

- **Return Value**:
  - The function returns `true` if the remainder is `0`, meaning the number is an integer.
  - It returns `false` otherwise.

### Code:
```javascript
function isNumberInteger(num) {
  return num % 1 === 0;
}

// Example usage
console.log(isNumberInteger(5));       // true (5 is an integer)
console.log(isNumberInteger(5.0));     // true (5.0 is equivalent to 5)
console.log(isNumberInteger(5.1));     // false (5.1 has a fractional part)
console.log(isNumberInteger(-3));      // true (-3 is an integer)
console.log(isNumberInteger(0));       // true (0 is an integer)
console.log(isNumberInteger(Math.PI)); // false (π is not an integer)
```

### Additional Notes:
- For a more robust check in modern JavaScript, you can also use `Number.isInteger(num)`, which is part of the ES6 standard:
  ```javascript
  console.log(Number.isInteger(5));   // true
  console.log(Number.isInteger(5.1)); // false
  ```
- Using `Number.isInteger` is preferred when dealing with special cases like `NaN`, `Infinity`, or `-Infinity`, as `num % 1` can produce unexpected results for those.