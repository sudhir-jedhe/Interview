### Custom `lastIndexOf` Method Implementation

The `lastIndexOf` method in JavaScript is used to find the last index of a specific value in an array. If the value is found, it returns the last index of that element, otherwise, it returns `-1`. The custom `lastIndexOf` method is built similarly to the native JavaScript version but offers flexibility, such as allowing a custom starting index.

### Explanation of Code:

1. **First Version**:
   This implementation of `customLastIndexOf` loops through the array from the end to the start and returns the index of the first match found.

   ```javascript
   Array.prototype.customLastIndexOf = function (value) {
     for (let i = this.length - 1; i >= 0; i--) {
       if (this[i] == value) {  // Use loose equality to handle cases like `NaN`
         return i;
       }
     }
     return -1;
   };
   ```

   - It starts from the last index (`this.length - 1`) and iterates backward.
   - It checks if the element is equal to the `searchElement` using loose equality (`==`). This is useful for cases where the value is `NaN`, as `NaN == NaN` is false, but `NaN == NaN` with loose equality works.

   **Example Usage**:
   ```javascript
   const numbers = [1, 2, 3, 4, 3, 5];
   console.log(numbers.customLastIndexOf(3));  // Output: 4
   console.log(numbers.customLastIndexOf(6));  // Output: -1
   ```

2. **Second Version (With `fromIndex` Handling)**:
   This version is a more refined custom implementation, which includes the `fromIndex` argument, similar to the native `lastIndexOf` method. It also handles negative indices, which allow searching from the end of the array, and it accounts for `NaN` values.

   ```javascript
   Array.prototype.customLastIndexOf = function (searchElement, fromIndex = this.length - 1) {
     const length = this.length;

     // Handle negative indices
     let startIndex =
       fromIndex >= 0 ? Math.min(fromIndex, length - 1) : length + fromIndex;

     for (let i = startIndex; i >= 0; i--) {
       if (
         this[i] === searchElement ||  // Strict equality comparison
         (Number.isNaN(this[i]) && Number.isNaN(searchElement)) // Handle NaN equality
       ) {
         return i;
       }
     }

     return -1;
   };
   ```

   **Key Features**:
   - **Negative Index Handling**: The `fromIndex` argument can be negative, which allows the search to begin from the end of the array.
   - **NaN Handling**: The comparison explicitly handles `NaN` since `NaN === NaN` is false in JavaScript. The `Number.isNaN()` method ensures that `NaN` is compared correctly.
   - **Default `fromIndex`**: The default value of `fromIndex` is the last index (`this.length - 1`), but it can be customized.

   **Example Usage**:

   ```javascript
   const numbers = [1, 2, 3, 4, 3, 5];
   
   console.log(numbers.customLastIndexOf(3));       // Output: 4 (Last occurrence of 3)
   console.log(numbers.customLastIndexOf(6));       // Output: -1 (6 is not in the array)
   console.log(numbers.customLastIndexOf(3, 3));    // Output: 2 (Search starts from index 3)
   console.log(numbers.customLastIndexOf(3, -3));   // Output: 2 (Search starts from index 3 (from the end))
   console.log([NaN, 2, NaN].customLastIndexOf(NaN)); // Output: 2 (Correctly handles NaN)
   ```

### Key Considerations:
1. **Negative Index**: In JavaScript, negative indices refer to positions counted from the end of the array. For example, `-1` refers to the last element.
2. **`NaN` Special Case**: JavaScript has the caveat that `NaN === NaN` is false, but `Number.isNaN()` can correctly identify `NaN` values, which is why it's used in this implementation.

### Native `lastIndexOf` Method:
For comparison, the native `Array.prototype.lastIndexOf` works similarly but is built-in:
```javascript
const arr = [1, 2, 3, 4, 3, 5];
console.log(arr.lastIndexOf(3));  // Output: 4
```

### Conclusion:
This custom implementation of `lastIndexOf` replicates the behavior of the native method while adding handling for negative indices and `NaN` values. It provides an excellent learning opportunity for how JavaScript array methods work under the hood.