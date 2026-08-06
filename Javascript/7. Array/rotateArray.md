Your implementation for rotating arrays is correct, but let's break down the two approaches you've shown for rotating an array and ensure both methods are understood well. I'll also discuss possible optimizations and improvements.

### **Approach 1**: Using Slice and Concatenation

```javascript
export const rotateArray = (arr, n) => {
  const len = arr.length;
  const steps = n % len;  // Avoid unnecessary rotations if n is greater than the array length.

  return [...arr.slice(steps), ...arr.slice(0, steps)];
};
```

### Explanation:

1. **Modular Arithmetic**: 
   - Since rotating an array by its length doesn't change the array, the modulo operation (`n % len`) ensures we handle cases where `n` is greater than the array length. For example, rotating by 7 steps on a 5-element array is equivalent to rotating by 2 steps (`7 % 5 = 2`).

2. **Slice**:
   - `arr.slice(steps)` returns the sub-array from index `steps` to the end of the array.
   - `arr.slice(0, steps)` returns the sub-array from the start of the array up to index `steps`.

3. **Concatenation**:
   - The result is the concatenation of these two slices, which gives the rotated array.

### Example:

```javascript
rotateArray([1, 2, 3, 4, 5], 2);
// Output: [3, 4, 5, 1, 2]
```

This approach is **clean and simple**, but it creates two new sub-arrays and then concatenates them, which can be less efficient for large arrays.

### **Approach 2**: Using Index Calculation

```javascript
function rotateArray(array, k) {
  // Check if the array is empty or k is 0
  if (array.length === 0 || k === 0) {
    return array;
  }

  // Calculate the new index of each element
  const newIndex = (index) => (index + k) % array.length;

  // Create a new array to store the rotated elements
  const rotatedArray = new Array(array.length);

  // Iterate over the original array and populate the rotated array
  for (let i = 0; i < array.length; i++) {
    rotatedArray[newIndex(i)] = array[i];
  }

  // Return the rotated array
  return rotatedArray;
}
```

### Explanation:

1. **Early Exit**:
   - If the array is empty or `k` is 0, there's no need to do any operations, so we return the array as-is.

2. **Index Calculation**:
   - For each index `i`, the new index is computed using `(i + k) % array.length`. This ensures that the rotation wraps around and the array stays within bounds.

3. **Rotated Array**:
   - A new array is created (`rotatedArray`) to hold the rotated values.
   - We loop through the original array, calculate the new index for each element, and place it in the new array.

### Example:

```javascript
rotateArray([1, 2, 3, 4, 5], 2);
// Output: [3, 4, 5, 1, 2]
```

### **Comparing the Two Approaches**:

- **Time Complexity**:
  - Both approaches run in **O(n)** time, where `n` is the length of the array. This is because both approaches require iterating through the array (once for slicing and once for index calculation).
  
- **Space Complexity**:
  - **Approach 1 (Slice and Concatenate)**:
    - This approach creates two slices, each of size `n`, and concatenates them, which requires **O(n)** extra space.
  - **Approach 2 (Index Calculation)**:
    - This approach creates only one new array, which also requires **O(n)** extra space.

- **Efficiency**:
  - **Approach 1**: This might be less efficient for large arrays because slicing and concatenating two arrays may involve copying elements multiple times.
  - **Approach 2**: This method is potentially more efficient since we only calculate indices and don't need to create intermediate arrays.

### **Edge Cases**:
Here are some edge cases you might want to test:

1. **Empty Array**:
   ```javascript
   console.log(rotateArray([], 3)); // Output: []
   ```

2. **Rotation by Array Length**:
   ```javascript
   console.log(rotateArray([1, 2, 3, 4, 5], 5)); // Output: [1, 2, 3, 4, 5]
   ```

3. **Rotation by Zero**:
   ```javascript
   console.log(rotateArray([1, 2, 3, 4, 5], 0)); // Output: [1, 2, 3, 4, 5]
   ```

4. **Large `k` Value**:
   ```javascript
   console.log(rotateArray([1, 2, 3, 4, 5], 100)); // Output: [1, 2, 3, 4, 5] (since 100 % 5 == 0)
   ```

5. **Negative Rotation**:
   - If you want to support negative rotations (which rotate the array to the left instead of the right), you can handle this by adjusting the rotation step:
   
   ```javascript
   export const rotateArray = (arr, n) => {
     const len = arr.length;
     const steps = ((n % len) + len) % len; // Handles negative n values
     return [...arr.slice(steps), ...arr.slice(0, steps)];
   };
   ```

   Now, calling `rotateArray([1, 2, 3, 4, 5], -2)` would return `[4, 5, 1, 2, 3]`.

---

### Conclusion:

- **Approach 1** is clean and simple but may be slightly less efficient for large arrays due to the use of slice and array concatenation.
- **Approach 2** is efficient and directly calculates the new positions of elements, offering a potentially better performance for large arrays.

Both approaches are correct, and the choice between them depends on the specific use case and performance needs.