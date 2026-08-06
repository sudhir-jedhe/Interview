The function `singleNonDuplicate` is designed to solve the problem where you are given a sorted array where every element appears exactly twice except for one element that appears once. The goal is to find that single element.

The approach uses **binary search**, which significantly improves the time complexity to **O(log n)**, compared to a brute-force solution that would take **O(n)** time.

### Explanation of the Algorithm:

1. **Initial Setup**:  
   You are given a sorted array `nums`, and the goal is to find the unique element that appears only once. All other elements appear exactly twice. You use a binary search approach to locate this element.

2. **Binary Search**:  
   We initialize `left` to 0 and `right` to `nums.length - 1`. The idea is to repeatedly divide the search space in half based on the index `mid`:
   
   - For each mid element, we check whether it is at an even or odd index and whether it is paired with its neighbor.
   
   - **Even Index**: If `mid` is even, the element at `mid` should ideally be paired with the next element (i.e., `nums[mid] === nums[mid + 1]`).
     - If they are paired, the single element must be on the right side, so we move `left = mid + 2`.
     - If they are not paired, the single element is on the left side, so we move `right = mid`.
     
   - **Odd Index**: If `mid` is odd, the element at `mid` should ideally be paired with the previous element (i.e., `nums[mid] === nums[mid - 1]`).
     - If they are paired, the single element must be on the right side, so we move `left = mid + 1`.
     - If they are not paired, the single element is on the left side, so we move `right = mid`.

3. **Termination**:  
   The loop continues until `left` equals `right`, at which point `nums[left]` will be the single non-duplicate element.

### Code Walkthrough:

#### First Example:
```javascript
console.log(singleNonDuplicate([1, 1, 2, 3, 3, 4, 4, 8, 8])); // Output: 2
```
- **Step-by-step**:
  1. **mid = 4** (`nums[4] = 3`), since `mid` is even, we check if `nums[4] === nums[5]`. It is `false`, so the single element is to the left of `mid`, hence `right = 4`.
  2. **mid = 2** (`nums[2] = 2`), since `mid` is even, we check if `nums[2] === nums[3]`. It is `false`, so the single element is to the left of `mid`, hence `right = 2`.
  3. Finally, `left = right = 2`, so the unique element is `nums[2] = 2`.

#### Second Example:
```javascript
console.log(singleNonDuplicate([3, 3, 7, 7, 10, 11, 11])); // Output: 10
```
- **Step-by-step**:
  1. **mid = 3** (`nums[3] = 7`), since `mid` is odd, we check if `nums[3] === nums[2]`. It is `true`, so the single element is to the right of `mid`, hence `left = 4`.
  2. **mid = 5** (`nums[5] = 11`), since `mid` is odd, we check if `nums[5] === nums[4]`. It is `false`, so the single element is to the left of `mid`, hence `right = 5`.
  3. **mid = 4** (`nums[4] = 10`), since `mid` is even, we check if `nums[4] === nums[5]`. It is `false`, so the single element is to the left of `mid`, hence `right = 4`.
  4. Finally, `left = right = 4`, so the unique element is `nums[4] = 10`.

### Time and Space Complexity:

- **Time Complexity**:  
  The time complexity is **O(log n)** because we are using a binary search, which halves the search space in each iteration.

- **Space Complexity**:  
  The space complexity is **O(1)**, as we are only using a few additional variables (`left`, `right`, `mid`) and not using extra space proportional to the input size.

### Final Code:

```javascript
function singleNonDuplicate(nums) {
    let left = 0;
    let right = nums.length - 1;
  
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
  
      // Check if the middle element is paired with its expected neighbor based on its position (even or odd index)
      if (mid % 2 === 0) { // Even index (should be paired with left neighbor)
        if (nums[mid] === nums[mid + 1]) {
          left = mid + 2; // If paired, move left to search the right half
        } else {
          right = mid; // If not paired, the single element is in the left half
        }
      } else { // Odd index (should be paired with right neighbor)
        if (nums[mid] === nums[mid - 1]) {
          left = mid + 1; // If paired, move left to search the right half
        } else {
          right = mid; // If not paired, the single element is in the left half
        }
      }
    }
  
    return nums[left];
}

// Examples
console.log(singleNonDuplicate([1, 1, 2, 3, 3, 4, 4, 8, 8])); // Output: 2
console.log(singleNonDuplicate([3, 3, 7, 7, 10, 11, 11])); // Output: 10
```

### Conclusion:
The `singleNonDuplicate` function is an optimal solution to find the single element in a sorted array where all other elements appear exactly twice. It efficiently uses binary search with a time complexity of **O(log n)** and a space complexity of **O(1)**, making it well-suited for large input arrays.