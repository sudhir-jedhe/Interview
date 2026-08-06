### **Problem Statement:**

We are given an array that may contain nested arrays. The goal is to implement a function that flattens the array so that all nested arrays are recursively combined into a single-level array. The function should not mutate the original array, and should return a new flattened array.

---

### **Solution Explanation:**

1. **Check if a value is an array**: 
   - The most reliable way to check if a value is an array is to use `Array.isArray()` or `instanceof Array`. In this solution, `Array.isArray(item)` is used to determine if an item is an array.

2. **Avoid mutation**: 
   - Instead of mutating the input array directly, we create a copy using `slice()` to ensure we don't modify the original array.

3. **Flattening Process**:
   - We use a `while` loop to process items from the copy of the input array.
   - For each item, if it's an array, we unshift its elements into the array to be processed next. If it's not an array, we push the item into the result array.
   - This loop ensures that all items, regardless of nesting depth, are processed and placed into the final result array.

---

### **Code Implementation:**

```js
type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  const res = [];          // This will hold the final flattened result
  const copy = value.slice(); // Create a copy of the input array to avoid mutation

  // Loop through the copy array
  while (copy.length) {
    const item = copy.shift();  // Get the first item from the array
    if (Array.isArray(item)) {
      // If the item is an array, flatten it by unshifting its elements
      copy.unshift(...item);
    } else {
      // If the item is not an array, push it into the result
      res.push(item);
    }
  }

  return res;  // Return the flattened array
}
```

---

### **Examples and Explanation:**

1. **Example 1: Flattening a simple array**:
   ```js
   flatten([1, 2, 3]); 
   // Output: [1, 2, 3]
   ```
   - The array is already flat, so no changes are made.

2. **Example 2: Flattening an array with one level of nesting**:
   ```js
   flatten([1, [2, 3]]); 
   // Output: [1, 2, 3]
   ```
   - The nested array `[2, 3]` is flattened and the result is `[1, 2, 3]`.

3. **Example 3: Flattening an array with multiple levels of nesting**:
   ```js
   flatten([1, [2, [3, [4, [5]]]]]);
   // Output: [1, 2, 3, 4, 5]
   ```
   - The nested arrays are recursively flattened into `[1, 2, 3, 4, 5]`.

4. **Example 4: Flattening multiple inner arrays**:
   ```js
   flatten([[1, 2], [3, 4]]);
   // Output: [1, 2, 3, 4]
   ```
   - The inner arrays `[1, 2]` and `[3, 4]` are flattened into a single array.

---

### **Time and Space Complexity:**

- **Time Complexity**: 
   - The time complexity of the `flatten` function is **O(n)** where `n` is the total number of elements in all arrays (including the nested ones). The algorithm processes each element once.
  
- **Space Complexity**: 
   - The space complexity is also **O(n)** because we store all elements in a new array `res`, and the copy of the input array also takes up space.

---

### **Conclusion:**
This solution effectively flattens deeply nested arrays while maintaining immutability of the input array. It does so by recursively unshifting elements from nested arrays and placing them in the result array using a `while` loop.