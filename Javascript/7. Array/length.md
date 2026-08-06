### Quiz Breakdown

Let's go through the different sections of this JavaScript quiz step by step and explain what's happening in each.

### Section 1: Custom `MyArray` Class

```javascript
class MyArray extends Array {
  get length() {
    return 3;
  }
}

const arr1 = new MyArray(10);
console.log(arr1.length);  // ?
const arr2 = new Array(10);
console.log(arr2.length);  // ?
```

- **Explanation**:
  - **`MyArray` class**: This is a custom class that extends the built-in `Array`. It overrides the `length` getter to always return `3`, regardless of the actual length of the array.
  - `arr1` is an instance of `MyArray`, and `arr2` is a regular `Array`.
  - When we call `arr1.length`, it returns `3` due to the getter in the `MyArray` class.
  - For `arr2`, the `length` is determined by the number of elements in the array, so `arr2.length` will be `10` because it was initialized with `10` elements.

- **Output**:
  ```
  3
  10
  ```

### Section 2: `foo` Function and Its `length` Property

```javascript
function foo(a, b, undefined, undefined) {
  console.log("BFE.dev");
}
console.log(foo.length);  // ?
```

- **Explanation**:
  - The `length` property of a function in JavaScript represents the number of parameters it is defined to accept.
  - In the `foo` function, there are two parameters (`a` and `b`), but `undefined` is used twice in the parameter list. However, JavaScript ignores the duplicate `undefined` entries in the function's declaration and only counts the actual parameters that are defined (`a` and `b`).
  - Therefore, `foo.length` is `2` because the function has two parameters.

- **Output**:
  ```
  2
  ```

### Section 3: Array Manipulation and Iteration

```javascript
const a = [0];
console.log(a.length);  // ?
a[3] = 3;
console.log(a.length);  // ?
for (let item of a) {
  console.log(item);  // ?
}
a.map((item) => {
  console.log(item);  // ?
});
a.forEach((item) => {
  console.log(item);  // ?
});
console.log(Object.keys(a));  // ?
delete a[3];
console.log(a.length);  // ?
a[2] = 2;
a.length = 1;
console.log(a[0], a[1], a[2]);  // ?
```

- **Step-by-step Explanation**:
  1. **`a = [0]`**: Initializes the array with one element `0`.
     - **`console.log(a.length)`**: The length of the array is `1` because it has one element.
     - **Output**: `1`

  2. **`a[3] = 3`**: Adds an element at index `3` (creating "holes" in the array at indices `1` and `2`).
     - **`console.log(a.length)`**: The length of the array is `4` because arrays in JavaScript are sparse, and the index `3` is explicitly set.
     - **Output**: `4`

  3. **Iteration over `a`**:
     - **`for (let item of a)`**: Iterates over the array, outputting the values at the non-empty indices.
       - Outputs: `0`, `empty`, `empty`, `3` because indices `1` and `2` are "holes" and are skipped in the loop.
     - **`.map()`**: `.map()` always processes all indices, including holes, resulting in `undefined` for the missing indices.
       - Outputs: `0`, `undefined`, `undefined`, `3`.
     - **`.forEach()`**: Similar to `.map()`, `.forEach()` will iterate over all indices, including holes, resulting in `undefined` for missing values.
       - Outputs: `0`, `undefined`, `undefined`, `3`.

  4. **`console.log(Object.keys(a))`**: `Object.keys()` returns an array of all enumerable property names. The output will show only the indices that have been set, ignoring the holes.
     - Outputs: `["0", "3"]` (only indices `0` and `3` are explicitly set).

  5. **`delete a[3]`**: This deletes the value at index `3` but leaves the index in place (the array will have a `hole` at index `3`).
     - **`console.log(a.length)`**: The length of the array doesn't change (it's still `4`), because the deletion only removes the value, not the index itself.
     - **Output**: `4`

  6. **`a[2] = 2`**: Adds the value `2` at index `2`.
     - **`a.length = 1`**: Sets the array length to `1`, which effectively removes all elements after index `0`.
     - **`console.log(a[0], a[1], a[2])`**: After the length is set to `1`, `a[1]` and `a[2]` are removed, and the output will show `0`, `undefined`, `undefined`.

- **Final Output**:
  ```
  1
  4
  0
  empty
  empty
  3
  0
  undefined
  undefined
  3
  0
  undefined
  undefined
  3
  ["0", "3"]
  4
  0 undefined undefined
  ```

### Key Concepts:

1. **Length of Sparse Arrays**:
   - The length of an array is determined by the highest index explicitly set, not by the number of elements in the array.
   
2. **Iterating Over Arrays with Holes**:
   - Methods like `for...of`, `.forEach()`, and `.map()` behave differently with sparse arrays:
     - `for...of` skips over "holes" (indices with no values).
     - `.forEach()` and `.map()` treat "holes" as `undefined`.

3. **Setting and Deleting Array Length**:
   - Modifying `length` will truncate or extend the array and affect the indices of the array.
   - Deleting an array element with `delete` doesn't remove the index, just the value at that index.

### Conclusion:

This JavaScript quiz covers important aspects of how arrays work, such as sparse arrays, the `length` property, and iteration methods. It also highlights some nuanced behavior of JavaScript arrays like `delete`, `Object.keys()`, and custom array manipulations.