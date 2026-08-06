The code you provided demonstrates the use of `Array.prototype.reduce()` to compute the sum and product of elements in an array.

### Explanation:

1. **Sum using `reduce`:**
   ```javascript
   const sum = arr.reduce((previousValue, currentValue) => {
     const nextValue = previousValue + currentValue;
     return nextValue;
   }, 0);
   ```
   - **Initial Value**: The second argument to `reduce`, `0`, is the initial value for the accumulator (`previousValue`).
   - **Reducer Function**: The function takes two arguments: `previousValue` and `currentValue`. It adds `currentValue` to `previousValue` on each iteration, ultimately calculating the sum of all elements in the array.
   - **Output**: For the array `[1, 2, 3, 4]`, it adds `1 + 2 + 3 + 4`, which results in `10`.

2. **Product using `reduce`:**
   ```javascript
   const product = arr.reduce((previousValue, currentValue) => {
     const nextValue = previousValue * currentValue;
     return nextValue;
   }, 1);
   ```
   - **Initial Value**: The second argument to `reduce`, `1`, is the initial value for the accumulator (`previousValue`).
   - **Reducer Function**: The function takes two arguments: `previousValue` and `currentValue`. It multiplies `currentValue` with `previousValue` on each iteration, calculating the product of all elements in the array.
   - **Output**: For the array `[1, 2, 3, 4]`, it multiplies `1 * 2 * 3 * 4`, which results in `24`.

### Example Output:
```javascript
console.log(sum);     // Output: 10
console.log(product); // Output: 24
```

This code illustrates the versatility of `reduce()` for accumulating values in various ways, such as summing or multiplying all elements of an array.