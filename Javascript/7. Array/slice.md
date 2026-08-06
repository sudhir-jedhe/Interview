The `slice()` method in JavaScript is used to create a new array from an existing one, containing the elements between a specified range of indices. It does not modify the original array but instead returns a new array that includes the elements between the start and end indices.

### Key Points:

1. **Syntax**:
   ```javascript
   array.slice(startIndex, endIndex);
   ```
   - `startIndex`: The index at which to begin extracting elements (inclusive). Default is `0` if omitted.
   - `endIndex`: The index at which to stop extracting elements (exclusive). Default is the length of the array if omitted.
   - If `startIndex` is negative, it counts back from the end of the array (e.g., `-1` refers to the last element).
   - If `endIndex` is omitted or greater than the length of the array, it selects till the end of the array.

2. **Behavior**:
   - **Does not modify** the original array.
   - Returns a **new array** with the selected elements.

### Example 1: Using `slice()` with only `startIndex`:

```javascript
let arrayIntegers = [1, 2, 3, 4, 5];
let arrayIntegers1 = arrayIntegers.slice(0, 2); // [1, 2]
let arrayIntegers2 = arrayIntegers.slice(2, 3); // [3]
let arrayIntegers3 = arrayIntegers.slice(4);    // [5]

console.log(arrayIntegers1); // Output: [1, 2]
console.log(arrayIntegers2); // Output: [3]
console.log(arrayIntegers3); // Output: [5]
```

### Example 2: Using `slice()` to extract a part of an array:

```javascript
const nums = [2, -3, 4, 6, -1, 9, -7];

const res = nums.slice(3);  // Starting from index 3 till the end
console.log(res);           // Output: [6, -1, 9, -7]

const res2 = nums.slice(2, 4);  // From index 2 to index 3 (not including index 4)
console.log(res2);              // Output: [4, 6]
```

### Explanation:

- `nums.slice(3)` extracts elements from index 3 (`6`) to the end of the array (`[6, -1, 9, -7]`).
- `nums.slice(2, 4)` extracts elements from index 2 (`4`) to index 3 (`6`), **excluding** index 4, so the result is `[4, 6]`.

### Example 3: Negative Indices:

Negative indices can be used to count from the end of the array:

```javascript
let arr = [10, 20, 30, 40, 50];

console.log(arr.slice(-3));      // [30, 40, 50] (starts from the 3rd last element)
console.log(arr.slice(-4, -2));  // [20, 30] (from the 4th last element to the 2nd last element)
```

### Key Notes:

- **Does not mutate the original array**:
  The `slice()` method does not change the original array, it only creates and returns a new one.
  
  Example:
  ```javascript
  const original = [10, 20, 30, 40, 50];
  const sliced = original.slice(1, 3);

  console.log(original); // [10, 20, 30, 40, 50] (original array remains unchanged)
  console.log(sliced);   // [20, 30] (new sliced array)
  ```

- **Empty array case**:
  If the start index is greater than or equal to the array length, the result is an empty array:
  
  ```javascript
  console.log([1, 2, 3].slice(5));  // [] (empty array)
  ```

### Conclusion:
The `slice()` method is a versatile and non-mutating way to create new arrays based on portions of an existing array. It is especially useful when working with subarrays or when needing to extract specific parts of an array without modifying the original data structure.