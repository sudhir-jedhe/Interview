To calculate the percentile of a given value in an array, we need to determine the percentage of values in the array that are less than or equal to the given value, while accounting for repeated occurrences of the value.

Here's how the code works:

- **Step 1**: We use `Array.prototype.reduce()` to accumulate how many numbers are strictly less than the given value (`val`) and how many are equal to the value.
  - If a number is less than the value (`v < val`), we add `1` to the accumulator.
  - If a number is equal to the value (`v === val`), we add `0.5` to the accumulator (to account for the percentile of the equal values being considered halfway between the lower and upper bound).
- **Step 2**: We then multiply this sum by `100` to get the percentage.
- **Step 3**: Finally, we divide by the total length of the array to normalize the result.

Here is the implementation:

```javascript
const percentile = (arr, val) =>
  (100 *
    arr.reduce(
      (acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0),
      0
    )) / arr.length;

console.log(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6));  // Output: 55
```

### Explanation:
- **Array**: `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`
- **Value (`val`)**: `6`

We will calculate how many numbers are less than `6`, and how many are equal to `6`:
- **Less than `6`**: The values `1, 2, 3, 4, 5` are less than `6` (5 values).
- **Equal to `6`**: The value `6` is equal to `6` (1 value).

We compute the percentile using the formula:

\[
\text{Percentile} = \left( \frac{100 \times (5 \text{ (values less than 6)} + 0.5 \text{ (value equal to 6)})}{10} \right)
\]

\[
\text{Percentile} = \left( \frac{100 \times (5 + 0.5)}{10} \right) = \left( \frac{100 \times 5.5}{10} \right) = 55
\]

Thus, the result is `55`, meaning that 55% of the values in the array are less than or equal to `6`.

### Edge Cases:
1. **Empty array**: If the array is empty, the result will be `NaN`, as division by zero occurs. You can add a check for an empty array before performing the calculation.
2. **All values less than `val`**: If all elements are less than the given value, the percentile will approach 100%.
3. **All values equal to `val`**: If all values in the array are equal to the given value, the percentile will be 50% (because `0.5` for each occurrence).

Let me know if you need any further clarification or modifications!