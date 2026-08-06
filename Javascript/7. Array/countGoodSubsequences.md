To solve the problem of counting **good subsequences**, we need to break down the problem requirements and conditions clearly:

### Problem Breakdown:
1. **Subsequences**: A subsequence is any subset of the array in the same order.
2. **Good subsequence**: A subsequence is considered "good" if:
   - All elements in the subsequence are unique.
   - If the minimum element in the subsequence is `a`, and the maximum is `b`, then all elements in the range `[a, b]` must be present in the subsequence.

### Approach to Solve the Problem:
- First, we need to identify **all subsequences** of the array.
- Then, we need to ensure that the subsequences follow the **good subsequence** conditions.

### Key Insights:
- Since we're dealing with subsequences, it is essential to check if the sequence of elements, when sorted, forms a **continuous range**. That is, for a subsequence to be good, the difference between consecutive elements should be exactly `1`.

### Optimized Approach:
Instead of brute-forcing through every subsequence, let's use a more optimized approach:

1. **Unique Elements**: First, extract unique elements from the given array.
2. **Sort**: Sorting helps us easily identify contiguous subsequences.
3. **Check for Contiguous Subarrays**: Once the unique elements are sorted, check for all possible **contiguous subarrays** that satisfy the conditions for being good.
4. **Count Valid Subsequences**: For each valid contiguous subsequence, count it as a good subsequence.

### Optimized Code Implementation:

```javascript
function countGoodSubsequences(arr) {
    // Step 1: Extract unique elements and sort them
    let uniqueArr = [...new Set(arr)].sort((a, b) => a - b);

    let n = uniqueArr.length;
    let count = 0;

    // Step 2: Generate all contiguous subarrays of the sorted unique elements
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            // Check if the subarray [uniqueArr[i], ..., uniqueArr[j]] is good
            let isGood = true;
            // Check if elements form a contiguous range
            for (let k = i; k <= j; k++) {
                if (uniqueArr[k] !== uniqueArr[i] + (k - i)) {
                    isGood = false;
                    break;
                }
            }
            if (isGood) {
                count++;
            }
        }
    }

    return count;
}

// Example usage:
const arr = [1, 2, 3, 1, 2];
console.log(countGoodSubsequences(arr));  // Output: 6
```

### Explanation of the Code:

1. **Unique Array**: We first remove duplicate elements using `new Set(arr)` and then convert it back to an array. This ensures that all elements in the subsequence are unique.
   
2. **Sorting**: We sort the array in ascending order. This helps us efficiently check for continuous subsequences.
   
3. **Subarrays**: We loop through all possible contiguous subarrays (`i` to `j`). For each subarray, we check if the elements form a **contiguous sequence**. Specifically, for each element at index `k`, we verify that the value is exactly `uniqueArr[i] + (k - i)`. This checks if the sequence is a continuous range from `uniqueArr[i]`.

4. **Counting**: If a subarray satisfies the condition of being a good subsequence, we increment the `count`.

### Example Walkthrough:

For the input `arr = [1, 2, 3, 1, 2]`, after extracting unique elements and sorting, we get `uniqueArr = [1, 2, 3]`.

The valid subsequences are:
1. `[1]`
2. `[2]`
3. `[3]`
4. `[1, 2]`
5. `[2, 3]`
6. `[1, 2, 3]`

Thus, the output is `6` because there are 6 good subsequences.

### Optimizations:
- **Avoid Full Brute Force**: By considering only **unique** and **sorted** elements, we reduce unnecessary computations and improve performance.
  
- **Contiguous Check**: We efficiently check whether elements form a contiguous subsequence by verifying that the difference between consecutive elements is exactly `1`.

### Edge Cases:
- If the array is empty (`[]`), the result will be `0` because there are no subsequences.
- If the array has only one unique element, the result will be `1` because the single element itself is a valid subsequence.
  
### Complexity:
- **Time Complexity**: Sorting the array takes `O(n log n)`, where `n` is the number of unique elements. Checking each subarray for the "good" condition is `O(n^2)` in the worst case. Thus, the overall time complexity is **O(n^2)**.
  
- **Space Complexity**: The space complexity is **O(n)**, as we store the unique elements in a new array.

This solution efficiently handles the problem and scales well for small to medium-sized arrays.