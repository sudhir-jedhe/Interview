Here is the problem statement along with the code implementation for the `flatten` function:

---

### **Problem Statement:**
Implement a function `flatten` that returns a newly-created array with all sub-array elements concatenated recursively into a single level.

### **Examples:**

1. **Single-level arrays are unaffected.**
   ```js
   flatten([1, 2, 3]); 
   // Output: [1, 2, 3]
   ```

2. **Inner arrays are flattened into a single level.**
   ```js
   flatten([1, [2, 3]]); 
   // Output: [1, 2, 3]
   flatten([
     [1, 2],
     [3, 4]
   ]); 
   // Output: [1, 2, 3, 4]
   ```

3. **Flattens recursively.**
   ```js
   flatten([1, [2, [3, [4, [5]]]]]);
   // Output: [1, 2, 3, 4, 5]
   ```

---

### **Solution:**

```js
function flatten(array) {
    // Create an empty array to hold the flattened elements
    let result = [];

    // Helper function to recursively flatten the array
    function flattenHelper(arr) {
        for (let item of arr) {
            if (Array.isArray(item)) {
                // If the item is an array, call flattenHelper recursively
                flattenHelper(item);
            } else {
                // If it's not an array, push it to the result array
                result.push(item);
            }
        }
    }

    // Start the recursion with the input array
    flattenHelper(array);
    
    return result;
}

// Examples
console.log(flatten([1, 2, 3])); 
// Output: [1, 2, 3]

console.log(flatten([1, [2, 3]])); 
// Output: [1, 2, 3]

console.log(flatten([[1, 2], [3, 4]])); 
// Output: [1, 2, 3, 4]

console.log(flatten([1, [2, [3, [4, [5]]]]])); 
// Output: [1, 2, 3, 4, 5]
```

### **Explanation of the Code:**

1. **Function `flatten`:**
   - The main function that starts the recursion and initializes an empty array `result` to store the flattened elements.

2. **Helper Function `flattenHelper`:**
   - This function recursively iterates over the array (`arr`).
   - If an item is an array, it calls itself recursively to flatten the nested array.
   - If an item is not an array, it pushes the element directly into the `result` array.

3. **Starting the Recursion:**
   - The recursion starts by calling `flattenHelper` with the input array.

4. **Final Output:**
   - After the recursion finishes, the `result` array contains all elements flattened into a single level.

---

### **Example Output Walkthrough:**

1. **Input**: `[1, 2, 3]`
   - Since there are no nested arrays, the output is simply `[1, 2, 3]`.

2. **Input**: `[1, [2, 3]]`
   - The inner array `[2, 3]` is flattened, resulting in `[1, 2, 3]`.

3. **Input**: `[[1, 2], [3, 4]]`
   - Both inner arrays `[1, 2]` and `[3, 4]` are flattened, resulting in `[1, 2, 3, 4]`.

4. **Input**: `[1, [2, [3, [4, [5]]]]]]`
   - The deeply nested arrays are recursively flattened into `[1, 2, 3, 4, 5]`.

---

### **Time Complexity:**
- **O(n)**: Each element of the input array is visited once during the recursion, where `n` is the total number of elements in the input.

### **Space Complexity:**
- **O(n)**: The space complexity is determined by the size of the result array and the call stack during recursion.

This approach effectively flattens arrays at any depth by using recursion and checking whether each element is an array or not.