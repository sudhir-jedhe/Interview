// Nested Array Inorder Traversal Generator Medium 29 35.8% Acceptance In this
// lab, you will implement a generator function that performs an inorder
// traversal of a given multi-dimensional array of integers. The generator
// object should yield integers in the same order as the inorder traversal.

// A multi-dimensional array is a recursive data structure that contains both
// integers and other multi-dimensional arrays.

// Inorder traversal iterates over each array from left to right, yielding any
// integers it encounters or applying inorder traversal to any arrays it
// encounters.

// Examples
```
const arr = [[[6]], [1, 3], []];
const generator = inorderTraversal(arr);
generator.next().value; // 6
generator.next().value; // 1
generator.next().value; // 3
generator.next().done; // true

const arr = [];
const generator = inorderTraversal(arr);
generator.next().done; // true

// arr = [[[6]], [1, 3], []] will produce the output [6, 1, 3] after performing
// inorder traversal.

function* inorderTraversal(arr) {
  for (const element of arr) {
    if (Array.isArray(element)) {
      yield* inorderTraversal(element); // Recursively traverse sub-array
    } else {
      yield element; // Yield integer
    }
  }
}

// Example usage:
const multiDimensionalArray = [1, [2, 3], [4, [5, 6]]];
const generator = inorderTraversal(multiDimensionalArray);

for (const value of generator) {
  console.log(value);
}

```

### Problem Overview

You need to implement a generator function that performs **inorder traversal** of a multi-dimensional array. This means:
- If the element is an **integer**, yield it.
- If the element is an **array**, recursively perform the inorder traversal on that sub-array.

### Understanding the Inorder Traversal

In order traversal of a multi-dimensional array:
- Traverse the left-most depth first.
- If an element is an array, recurse into that array first.
- Yield elements in a left-to-right manner.

### Solution Explanation

We will use a **recursive generator** function `inorderTraversal` to perform the inorder traversal. The key points are:
1. **Base case**: If the element is a number (integer), we simply yield it.
2. **Recursive case**: If the element is an array, we recursively call the generator function for that array and yield its values.
3. Use the `yield*` syntax to delegate the generator's yielding to a sub-generator, allowing for recursion.

### Code Implementation

```javascript
// The generator function performs inorder traversal on a multi-dimensional array
function* inorderTraversal(arr) {
  // Iterate through each element of the array
  for (const element of arr) {
    // If the element is an array, recursively perform inorder traversal on that array
    if (Array.isArray(element)) {
      yield* inorderTraversal(element);
    } else {
      // If the element is a number, yield it
      yield element;
    }
  }
}

// Example usage:

// Example 1: Multi-dimensional array
const arr1 = [[[6]], [1, 3], []];
const generator1 = inorderTraversal(arr1);
console.log(generator1.next().value); // 6
console.log(generator1.next().value); // 1
console.log(generator1.next().value); // 3
console.log(generator1.next().done);  // true

// Example 2: Empty array
const arr2 = [];
const generator2 = inorderTraversal(arr2);
console.log(generator2.next().done); // true

// Example 3: Complex multi-dimensional array
const arr3 = [1, [2, 3], [4, [5, 6]]];
const generator3 = inorderTraversal(arr3);

// Print each value as it's yielded
for (const value of generator3) {
  console.log(value);
}
// Output: 1, 2, 3, 4, 5, 6
```

### How the Code Works

1. **The Generator (`inorderTraversal`)**:
   - It accepts an array (`arr`).
   - It loops through each element of `arr`.
   - If the element is an array (`Array.isArray(element)`), it recursively calls `inorderTraversal` on that sub-array using the `yield*` syntax. This delegates yielding control to the sub-generator.
   - If the element is a number, it simply yields that value.

2. **Example 1** (`arr1 = [[[6]], [1, 3], []]`):
   - It first encounters a nested array `[[[6]]]`, recursively traverses and yields `6`.
   - Then, it encounters the array `[1, 3]` and yields `1` followed by `3`.
   - The empty array `[]` results in no values being yielded.
   - Final output: `6, 1, 3`.

3. **Example 2** (Empty array `arr2 = []`):
   - Since the array is empty, no values are yielded, and the generator ends immediately.

4. **Example 3** (`arr3 = [1, [2, 3], [4, [5, 6]]]`):
   - The generator yields the integer `1` from the first element.
   - Then, it recursively traverses `[2, 3]` and yields `2`, then `3`.
   - Finally, it recursively traverses `[4, [5, 6]]`, yielding `4`, and recursively traverses `[5, 6]` yielding `5` then `6`.
   - Final output: `1, 2, 3, 4, 5, 6`.

### Time Complexity

- **Time Complexity**: O(n), where n is the total number of elements (integers) in the multi-dimensional array. Every element is visited exactly once.
- **Space Complexity**: O(d), where d is the maximum depth of the array. This is due to recursion, which uses the call stack to traverse nested arrays.

### Summary

The generator function `inorderTraversal` recursively traverses a multi-dimensional array in an inorder manner (left-to-right, depth-first), and yields integers in the order they are encountered. This approach handles arrays of arbitrary depth and structure efficiently.