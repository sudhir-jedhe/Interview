Here is the code and explanation in Markdown format:

```javascript
// Given an integer array arr and a mapping function fn, return a new array
// with a transformation applied to each element.
// The returned array should be created such that returnedArray[i] = fn(arr[i], i).

var map = function(arr, fn) {
    const ra = [];
    
    // Iterate through the array, applying the function `fn` on each element
    for (let i = 0; i < arr.length; i++) {
        ra.push(fn(arr[i], i)); // Apply fn to the current element and index
    }
    
    return ra; // Return the new transformed array
};
```

### Explanation:

- **Function Purpose**: 
  - This function mimics the behavior of the built-in `Array.map` method. It takes two arguments:
    1. `arr` – the input array.
    2. `fn` – the transformation function that is applied to each element of the array.
  - The function returns a new array where each element is the result of applying `fn` to the corresponding element in the input array.

- **Steps**:
  1. We create an empty array `ra` to store the transformed elements.
  2. We loop through each element of the array `arr` using a `for` loop.
  3. For each element at index `i`, we apply the function `fn` and push the result to `ra`.
  4. Finally, the new array `ra` is returned.

### Example Test Cases:

#### Example 1:
```javascript
const arr = [1, 2, 3];
const fn = function plusone(n) { return n + 1; };
console.log(map(arr, fn)); // Output: [2, 3, 4]
```
Explanation: The function `plusone` adds `1` to each element of the array.

#### Example 2:
```javascript
const arr = [1, 2, 3];
const fn = function plusI(n, i) { return n + i; };
console.log(map(arr, fn)); // Output: [1, 3, 5]
```
Explanation: The function `plusI` adds the index `i` to each element `n`.

#### Example 3:
```javascript
const arr = [10, 20, 30];
const fn = function constant() { return 42; };
console.log(map(arr, fn)); // Output: [42, 42, 42]
```
Explanation: The function always returns `42`, regardless of the input values.

### Conclusion:

This `map` function is a simple implementation of how you can transform an array with a custom function without relying on the built-in `Array.map` method. It processes each element and returns a new array with the transformed values.