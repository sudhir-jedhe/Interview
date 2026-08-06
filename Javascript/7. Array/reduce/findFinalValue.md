The problem you're describing requires a function that will repeatedly double a number (`original`) as long as it is found in the `nums` array. If `original` is not found in the array, the function stops and returns the current value of `original`.

### Plan:
1. Start with the `original` number.
2. Check if `original` exists in the `nums` array.
3. If found, multiply it by 2 and continue the search.
4. If not found, stop and return the current value of `original`.

### Example Walkthrough:

- **Example 1:**
  - Input: `nums = [5,3,6,1,12], original = 3`
  - 3 is found, so we multiply it by 2 → `original = 6`
  - 6 is found, so we multiply it by 2 → `original = 12`
  - 12 is found, so we multiply it by 2 → `original = 24`
  - 24 is not found in the array, so we stop and return `24`.
  
- **Example 2:**
  - Input: `nums = [2,7,9], original = 4`
  - 4 is not found in `nums`, so we return the initial value `4`.

### Solution Code:

```javascript
function findFinalValue(nums, original) {
    return nums.reduce((accumulator, currentValue) => {
      if (currentValue === accumulator) {
        accumulator *= 2;
      }
      return accumulator;
    }, original);
}
```

### Explanation:
- The function uses `reduce` to iterate over the `nums` array.
- For each value in `nums`, it checks if the `accumulator` (which starts as `original`) matches the current value.
- If the value is found, it doubles the `accumulator`.
- Once all numbers are checked, the final `accumulator` is returned.

### Example Test Cases:

1. **Test Case 1:**

```javascript
const nums1 = [5, 3, 6, 1, 12];
const original1 = 3;
console.log(findFinalValue(nums1, original1)); // Output: 24
```

2. **Test Case 2:**

```javascript
const nums2 = [2, 7, 9];
const original2 = 4;
console.log(findFinalValue(nums2, original2)); // Output: 4
```

### Output:
1. `findFinalValue([5, 3, 6, 1, 12], 3)` will return `24`.
2. `findFinalValue([2, 7, 9], 4)` will return `4`.

This approach effectively simulates the process of doubling the number if it's found in the array, and stops when the number is no longer found.