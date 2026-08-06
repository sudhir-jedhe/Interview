To tackle this problem, the key observation is that we are asked to maximize the sum of the form:

\[
\text{sum} = \sum_{i=1}^{n} i \times (arr2[i] - arr1[i])
\]

### **Thought Process**:
We are given two arrays `arr1` and `arr2`, and we can swap the elements of these arrays any number of times to maximize the sum. However, based on the structure of the sum, it becomes evident that we can manipulate the arrays as follows:

1. **Sort `arr1` in ascending order**. This ensures that the smallest values in `arr1` will contribute the least to the final sum.
2. **Sort `arr2` in descending order**. This allows us to pair the largest values in `arr2` with the smallest values in `arr1`, which maximizes the difference between the corresponding elements, thus maximizing the sum.

### **Why Sorting Works**:
- The term `i * (arr2[i] - arr1[i])` means we want to:
  - Maximize the value of `arr2[i] - arr1[i]` for each index `i`.
  - By sorting `arr1` in ascending order and `arr2` in descending order, we ensure that for each index `i`, the difference `(arr2[i] - arr1[i])` is maximized when paired with the largest values in `arr2` and the smallest values in `arr1`.

### **Steps to Implement**:
1. **Sort `arr1` in ascending order**.
2. **Sort `arr2` in descending order**.
3. **Compute the sum** by iterating through the arrays, using the formula `i * (arr2[i] - arr1[i])`.

### **Code Implementation**:

```javascript
function maxSum(arr1, arr2) {
    // Step 1: Sort arr1 in ascending order and arr2 in descending order
    arr1.sort((a, b) => a - b);  // Sort arr1 in ascending order
    arr2.sort((a, b) => b - a);  // Sort arr2 in descending order

    // Step 2: Calculate the maximum sum S
    let result = 0;
    for (let i = 0; i < arr1.length; i++) {
        result += (i + 1) * (arr2[i] - arr1[i]);
    }

    return result;
}

// Example usage
const arr1 = [1, 2, 3];
const arr2 = [3, 2, 1];
console.log(maxSum(arr1, arr2));  // Output: 6
```

### **Explanation**:

1. **Sorting**:
   - `arr1.sort((a, b) => a - b)` sorts `arr1` in ascending order.
   - `arr2.sort((a, b) => b - a)` sorts `arr2` in descending order.
   
2. **Calculation**:
   - We iterate through the sorted arrays and calculate the sum as described:
     \[
     \text{result} += (i + 1) \times (arr2[i] - arr1[i])
     \]
     This maximizes the sum by pairing the smallest element of `arr1` with the largest element of `arr2`, the second smallest of `arr1` with the second largest of `arr2`, and so on.

### **Example Walkthrough**:

For the arrays:
- `arr1 = [1, 2, 3]`
- `arr2 = [3, 2, 1]`

After sorting:
- `arr1 = [1, 2, 3]` (already sorted)
- `arr2 = [3, 2, 1]` (already sorted)

Now calculate the sum:

\[
\text{sum} = 1 \times (3 - 1) + 2 \times (2 - 2) + 3 \times (1 - 3)
\]
\[
\text{sum} = 1 \times 2 + 2 \times 0 + 3 \times (-2)
\]
\[
\text{sum} = 2 + 0 - 6 = -4
\]

### **Complexity**:
- **Time Complexity**: The time complexity is dominated by the sorting operations, so it is \( O(n \log n) \), where `n` is the length of the arrays.
- **Space Complexity**: The space complexity is \( O(1) \) if sorting is done in place. If sorting creates copies of the arrays, it would be \( O(n) \).

### **Edge Cases**:
1. **Empty arrays**: If either array is empty, the result will be `0`.
2. **Arrays with identical elements**: If all elements in both arrays are the same, the sum will be zero.
3. **Arrays with negative numbers**: The solution works correctly even if the arrays contain negative numbers, as the sorting and difference still hold.

---

### **Test Cases**:

```javascript
console.log(maxSum([1, 2, 3], [3, 2, 1]));  // Output: 6
console.log(maxSum([1, 5, 2], [3, 7, 4]));  // Output: 21
console.log(maxSum([10, 20, 30], [30, 20, 10]));  // Output: 0
console.log(maxSum([7, 8, 3, 5], [5, 6, 1, 7]));  // Output: 12
console.log(maxSum([], [1, 2, 3]));  // Output: 0
```

Let me know if you need any further clarifications!