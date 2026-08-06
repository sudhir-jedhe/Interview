To check if a JavaScript array includes **any** or **all** values from another array, we can use `Array.prototype.includes()` in combination with `Array.prototype.some()` or `Array.prototype.every()` depending on whether we want to check for **any** or **all** values.

### 1. **Check if an Array Includes Any Values from Another Array**

To check if **any** of the values in the second array are included in the first array, we can use `Array.prototype.some()` along with `Array.prototype.includes()`. This allows us to iterate through the second array and return `true` if at least one value is found in the first array.

#### Example: Check if any values are included

```javascript
const includesAny = (arr, values) => values.some(v => arr.includes(v));

console.log(includesAny([1, 2, 3, 4], [2, 9])); // true (2 is included)
console.log(includesAny([1, 2, 3, 4], [8, 9])); // false (no match)
```

### Explanation:
- `some()` iterates through each value in the `values` array.
- `includes()` checks if the current value in `values` exists in the `arr` array.
- If **any** value in `values` is found in `arr`, the result is `true`.

### 2. **Check if an Array Includes All Values from Another Array**

To check if **all** values in the second array are included in the first array, we can use `Array.prototype.every()` with `Array.prototype.includes()`. This ensures that each element in the second array must exist in the first array for the function to return `true`.

#### Example: Check if all values are included

```javascript
const includesAll = (arr, values) => values.every(v => arr.includes(v));

console.log(includesAll([1, 2, 3, 4], [1, 4])); // true (both 1 and 4 are included)
console.log(includesAll([1, 2, 3, 4], [1, 5])); // false (5 is not included)
```

### Explanation:
- `every()` checks if **every** value in the `values` array exists in `arr`.
- `includes()` is used to check if each value from `values` is present in `arr`.
- If **all** values in `values` exist in `arr`, the result is `true`.

### 3. **Improving Performance for Large Arrays**

These methods can have performance issues with large arrays, especially when using `includes()` inside `some()` or `every()`, because `includes()` has to iterate over the array for each value. To improve performance, we can convert the first array (`arr`) to a `Set`, which has faster lookup times.

#### Optimized Version Using `Set`

```javascript
const includesAnyOptimized = (arr, values) => {
  const set = new Set(arr); // Create a Set from arr for faster lookups
  return values.some(v => set.has(v));
};

const includesAllOptimized = (arr, values) => {
  const set = new Set(arr); // Create a Set from arr for faster lookups
  return values.every(v => set.has(v));
};

console.log(includesAnyOptimized([1, 2, 3, 4], [2, 9])); // true
console.log(includesAllOptimized([1, 2, 3, 4], [1, 4])); // true
```

### Why Use `Set`?

- **Sets** provide **constant time complexity (O(1))** for lookups, as opposed to arrays, which have a linear time complexity (O(n)) for `includes()`.
- This results in better performance when checking for the presence of elements, especially when the array is large.

### Summary

1. **Check if any values are included**: Use `Array.prototype.some()` and `Array.prototype.includes()`.
2. **Check if all values are included**: Use `Array.prototype.every()` and `Array.prototype.includes()`.
3. **For large arrays**, consider using a `Set` for faster lookups to improve performance.

### Complete Example Code:

```javascript
// Function to check if any value is included
const includesAny = (arr, values) => values.some(v => arr.includes(v));

// Function to check if all values are included
const includesAll = (arr, values) => values.every(v => arr.includes(v));

// Optimized versions using Set for performance
const includesAnyOptimized = (arr, values) => {
  const set = new Set(arr);
  return values.some(v => set.has(v));
};

const includesAllOptimized = (arr, values) => {
  const set = new Set(arr);
  return values.every(v => set.has(v));
};

// Example usage
console.log(includesAny([1, 2, 3, 4], [2, 9])); // true
console.log(includesAll([1, 2, 3, 4], [1, 4])); // true
console.log(includesAll([1, 2, 3, 4], [1, 5])); // false

// Optimized examples
console.log(includesAnyOptimized([1, 2, 3, 4], [2, 9])); // true
console.log(includesAllOptimized([1, 2, 3, 4], [1, 4])); // true
```

This code snippet demonstrates both the regular and optimized versions of checking if any or all values from one array are included in another.