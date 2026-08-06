```
export function canThreePartsEqualSum(arr) {
  const totalSum = arr.reduce((acc, curr) => acc + curr, 0);
  if (totalSum % 3 !== 0) {
    return false; // Total sum is not divisible by 3
  }

  const targetSum = totalSum / 3;
  let sum = 0;
  let count = 0;

  for (const num of arr) {
    sum += num;
    if (sum === targetSum) {
      count++;
      sum = 0;
    }
  }

  return count >= 3;
}

import { canThreePartsEqualSum } from "./canThreePartsEqualSum.js";

const arr1 = [0, 2, 1, -6, 6, -7, 9, 1, 2, 0, 1];
console.log(canThreePartsEqualSum(arr1)); // Output: true

const arr2 = [0, 2, 1, -6, 6, 7, 9, -1, 2, 0, 1];
console.log(canThreePartsEqualSum(arr2)); // Output: false

```

The function `canThreePartsEqualSum` checks whether it is possible to split an array `arr` into three contiguous subarrays with equal sum.

### Approach:

1. **Calculate Total Sum**: 
   - We first compute the total sum of all elements in the array using the `reduce()` function.
   
2. **Check Divisibility by 3**:
   - If the total sum is not divisible by 3, it's impossible to divide it into three equal parts, so we return `false`.

3. **Set the Target Sum**:
   - If the total sum is divisible by 3, we set `targetSum` to `totalSum / 3`.

4. **Traverse the Array**:
   - We initialize `sum = 0` and `count = 0`. We then iterate through the array and keep adding the elements to `sum`.
   - Whenever `sum` equals `targetSum`, it means we have found a valid partition. We reset `sum = 0` and increment `count`.
   
5. **Return the Result**:
   - If we can find at least 3 valid partitions, then we return `true`. Otherwise, we return `false`.

### Code Explanation:

```javascript
export function canThreePartsEqualSum(arr) {
  // Calculate the total sum of the array elements
  const totalSum = arr.reduce((acc, curr) => acc + curr, 0);

  // If the total sum is not divisible by 3, return false
  if (totalSum % 3 !== 0) {
    return false;
  }

  // Calculate the target sum for each part
  const targetSum = totalSum / 3;
  let sum = 0;  // to accumulate the current sum
  let count = 0;  // to count the number of valid partitions

  // Iterate through the array
  for (const num of arr) {
    sum += num;  // add the current number to the sum

    // If the sum equals the target, we have a valid partition
    if (sum === targetSum) {
      count++;  // increment the partition count
      sum = 0;  // reset sum to start checking the next partition
    }
  }

  // If we found at least 3 valid partitions, return true
  return count >= 3;
}
```

### Example Walkthrough:

#### Example 1:

```javascript
const arr1 = [0, 2, 1, -6, 6, -7, 9, 1, 2, 0, 1];
console.log(canThreePartsEqualSum(arr1)); // Output: true
```

**Step-by-Step Execution**:
1. `totalSum = 0 + 2 + 1 - 6 + 6 - 7 + 9 + 1 + 2 + 0 + 1 = 9`.
2. Since `9 % 3 == 0`, we can proceed. The target sum for each partition is `9 / 3 = 3`.
3. Traverse the array:
   - Sum from start until `sum = 3`, count 1 partition, reset sum.
   - Sum from start until `sum = 3`, count 2 partitions, reset sum.
   - Sum from start until `sum = 3`, count 3 partitions, reset sum.
4. We have found 3 partitions, so the function returns `true`.

#### Example 2:

```javascript
const arr2 = [0, 2, 1, -6, 6, 7, 9, -1, 2, 0, 1];
console.log(canThreePartsEqualSum(arr2)); // Output: false
```

**Step-by-Step Execution**:
1. `totalSum = 0 + 2 + 1 - 6 + 6 + 7 + 9 - 1 + 2 + 0 + 1 = 21`.
2. Since `21 % 3 == 0`, we can proceed. The target sum for each partition is `21 / 3 = 7`.
3. Traverse the array:
   - Sum from start until `sum = 7`, count 1 partition, reset sum.
   - Sum from start until `sum = 7`, count 2 partitions, reset sum.
   - We cannot get a valid partition for the third subarray because the remaining elements don't sum to `7`.
4. Therefore, the function returns `false`.

### Edge Case Considerations:
- **Empty Array**: If `arr` is empty, the total sum will be `0`, which is divisible by `3`, but since we can't form three non-empty subarrays, the function will return `false`.
- **Single Element Arrays**: If the array has fewer than 3 elements, it's impossible to split it into 3 partitions, and the function will return `false`.
- **All Zero Arrays**: If the array contains only zeros, it is trivially split into three equal subarrays.

### Time and Space Complexity:
- **Time Complexity**: O(n), where `n` is the length of the array. We only need to traverse the array once to calculate the total sum and once more to check for partitions.
- **Space Complexity**: O(1), as we are using a constant amount of extra space, apart from the input array.

This solution is efficient for the problem and works for any valid array of integers.