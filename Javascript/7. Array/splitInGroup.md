```js
function splitArrayIntoGroups(array, groupSize) {
    if (!Array.isArray(array) || !Number.isInteger(groupSize) || groupSize <= 0) {
        throw new Error('Invalid input. Please provide a valid array and a positive integer group size.');
    }
  
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
  
    return result;
  }
  
  // Example usage:
  
  const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const groupSize = 3;
  
  const groupedArrays = splitArrayIntoGroups(originalArray, groupSize);
  
  console.log(groupedArrays);
  // Output: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

  ```

  The code you've written splits an array into groups of a specified size, which is a common problem when you need to process large datasets in smaller chunks. Here's a detailed breakdown of how your function `splitArrayIntoGroups` works:

### **Explanation of the Code**:

1. **Input Validation**:
   ```javascript
   if (!Array.isArray(array) || !Number.isInteger(groupSize) || groupSize <= 0) {
       throw new Error('Invalid input. Please provide a valid array and a positive integer group size.');
   }
   ```
   - The function first checks if the input `array` is actually an array and if `groupSize` is a positive integer. If any of these conditions are not met, an error is thrown to ensure the inputs are valid.

2. **Creating the Result Array**:
   ```javascript
   const result = [];
   ```
   - We initialize an empty array `result` to store the chunks that we will create from the original array.

3. **Loop to Split the Array**:
   ```javascript
   for (let i = 0; i < array.length; i += groupSize) {
       result.push(array.slice(i, i + groupSize));
   }
   ```
   - We loop through the original array using the `i` variable. On each iteration, we increase `i` by the `groupSize` value. This determines the starting index for each chunk.
   - The `array.slice(i, i + groupSize)` method creates a new array that starts at index `i` and ends at `i + groupSize`. This chunk is then pushed into the `result` array.

4. **Returning the Grouped Array**:
   ```javascript
   return result;
   ```
   - Once the loop completes, the `result` array, which contains all the grouped arrays, is returned.

### **Example Usage**:

Given the array `[1, 2, 3, 4, 5, 6, 7, 8, 9]` and a `groupSize` of 3, the function will divide the array into three smaller arrays, each containing 3 elements:

```javascript
const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const groupSize = 3;
const groupedArrays = splitArrayIntoGroups(originalArray, groupSize);
console.log(groupedArrays);
```

**Output**:
```javascript
[[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```

### **Edge Cases and Considerations**:
1. **Empty Array**:
   - If the input array is empty, the function will return an empty array, which is expected behavior.
   ```javascript
   console.log(splitArrayIntoGroups([], 3)); // Output: []
   ```

2. **Array Size Less Than Group Size**:
   - If the array size is smaller than the group size, the function will return a single chunk containing all the elements.
   ```javascript
   console.log(splitArrayIntoGroups([1, 2], 5)); // Output: [[1, 2]]
   ```

3. **Last Group Smaller Than Group Size**:
   - If the array cannot be evenly divided by the group size, the last group will contain the remaining elements.
   ```javascript
   console.log(splitArrayIntoGroups([1, 2, 3, 4, 5], 2)); // Output: [[1, 2], [3, 4], [5]]
   ```

4. **Invalid Input**:
   - The function handles invalid inputs by throwing an error with a descriptive message:
   ```javascript
   console.log(splitArrayIntoGroups([1, 2, 3], -2)); // Error: Invalid input. Please provide a valid array and a positive integer group size.
   ```

### **Summary**:
This function is a straightforward and efficient way to split an array into chunks of a specified size. It handles various edge cases such as non-divisible arrays and invalid inputs.