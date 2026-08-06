### 1. **Custom `indexOf` Implementation**

You’ve implemented a custom `indexOf` method on the `Array.prototype` that mimics the behavior of the native `indexOf`. Let's break it down:

#### Custom `indexOf` Method:

```javascript
Array.prototype.customIndexOf = function (value) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] == value) { // Use '==' for loose comparison
      return i;
    }
  }
  return -1;
};
```

- **How it works**:
  - The function iterates over the array, checking each element.
  - If it finds an element equal to the search value (`value`), it returns the index of that element.
  - If no matching element is found, it returns `-1`.

- **Example Usage**:

```javascript
const arr = [1, 2, 3, 4, 5, 9, 7, 9, 9, 10];
console.log(arr.customIndexOf(9)); // Output: 5
```

- **Explanation**:
  - The custom `indexOf` finds the **first occurrence** of `9` at index `5` (note that this behavior is similar to the native `indexOf`).

### 2. **Remove Duplicates Using `indexOf`**

You’ve implemented a function to remove duplicates from an array using `indexOf` to check if an element has already been added to the `unique` array.

#### `removeDuplicates` Function:

```javascript
let arr = ["apple", "mango", "apple", "orange", "mango", "mango"];

function removeDuplicates(arr) {
  let unique = [];
  for (i = 0; i < arr.length; i++) {
    if (unique.indexOf(arr[i]) === -1) { // Check if the item already exists
      unique.push(arr[i]);
    }
  }
  return unique;
}

console.log(removeDuplicates(arr));
```

- **How it works**:
  - The function iterates over each element in the array.
  - For each element, it checks if that element is already in the `unique` array using `indexOf`. If `indexOf` returns `-1`, it means the element has not been added yet, so it gets pushed into the `unique` array.
  - The result is a new array with no duplicates.

- **Example Usage**:

```javascript
let arr = ["apple", "mango", "apple", "orange", "mango", "mango"];
console.log(removeDuplicates(arr)); // Output: [ 'apple', 'mango', 'orange' ]
```

### Key Points:

- **Custom `indexOf`**:
  - The custom `indexOf` method is an excellent exercise in understanding how `indexOf` works under the hood. Your implementation uses loose equality (`==`), so it will return `true` for `NaN` values and handle different types (e.g., `"5"` vs `5`).
  
- **Remove Duplicates**:
  - The `removeDuplicates` function effectively removes duplicates by checking if each element has been seen before using `indexOf`. While this works fine for small arrays, note that `indexOf` has a time complexity of O(n), so the overall time complexity of `removeDuplicates` is O(n²). This might not be efficient for larger arrays.

  - For larger datasets, using a **Set** or an **object** as a lookup would be more efficient, as both have O(1) average time complexity for insertions and lookups.

#### More Efficient Solution Using `Set`:

Here’s a more efficient way to remove duplicates using a `Set`, which automatically handles uniqueness:

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates(arr)); // Output: [ 'apple', 'mango', 'orange' ]
```

- **Explanation**: 
  - A `Set` is a collection of values where each value must be unique. By converting the array to a `Set`, you automatically remove duplicates, and then using the spread operator `[...]` converts the set back to an array.

### Summary:
- Your custom `indexOf` method works as expected, demonstrating how to iterate over an array and return the index of the first match.
- The `removeDuplicates` function effectively removes duplicates, but for larger datasets, using a `Set` would be a more efficient alternative.