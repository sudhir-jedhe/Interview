```js
function dropRightWhile(array, predicate) {
  let i = array.length;
  while (i > 0 && predicate(array[i - 1])) {
    i--;
  }
  return array.slice(0, i);
}

const array = [1, 2, 3, 4, 5];

// Exclude elements from the end of the array until the element is less than 3.
const result = dropRightWhile(array, (element) => element >= 3);

console.log(result); // [1, 2]

```

The function `dropRightWhile` that you have implemented removes elements from the end of an array while they satisfy a given predicate. It does this by iterating from the end of the array and checking if the current element matches the condition provided by the predicate function. As long as the predicate returns `true`, it keeps removing the elements. Once it encounters an element that doesn't meet the condition, the function stops removing and returns the remaining part of the array.

### Explanation of `dropRightWhile`:

1. **Parameters**:
   - `array`: The array you want to operate on.
   - `predicate`: A function that tests each element of the array. It should return `true` if the element should be removed, and `false` if it should be kept.

2. **Algorithm**:
   - Start by setting `i` to the length of the array (`array.length`).
   - Iterate backward from the end of the array (`i--`) until you encounter an element that does not satisfy the predicate (`predicate(array[i - 1])`).
   - Once the loop stops, use `array.slice(0, i)` to return a new array that excludes the elements from the end that satisfied the predicate.

3. **Return**:
   - The result is the portion of the array that is left after dropping the elements from the end based on the predicate.

### Example Walkthrough:

```javascript
const array = [1, 2, 3, 4, 5];

// Exclude elements from the end of the array until the element is less than 3.
const result = dropRightWhile(array, (element) => element >= 3);

console.log(result); // [1, 2]
```

#### Steps:
1. **Initial Array**: `[1, 2, 3, 4, 5]`
2. The predicate `(element) => element >= 3` checks if the element is greater than or equal to `3`.
   - Start from the last element: `5`. `predicate(5)` returns `true`, so it is removed.
   - Next, check `4`: `predicate(4)` returns `true`, so it is removed.
   - Next, check `3`: `predicate(3)` returns `true`, so it is removed.
   - Next, check `2`: `predicate(2)` returns `false`, so the loop stops here.
3. **Return**: The remaining elements in the array are `[1, 2]`, which is returned by the function.

### Edge Cases to Consider:
- **Empty array**: If the array is empty, the function will return an empty array since there's nothing to drop.
- **All elements satisfy the predicate**: If all elements satisfy the predicate, the function will return an empty array.
- **No elements satisfy the predicate**: If none of the elements satisfy the predicate, the function will return the original array.

### Examples of Edge Cases:

1. **Empty Array**:
   ```javascript
   console.log(dropRightWhile([], (element) => element >= 3));  // []
   ```

2. **No Elements Match Predicate**:
   ```javascript
   console.log(dropRightWhile([1, 2, 3], (element) => element > 5));  // [1, 2, 3]
   ```

3. **All Elements Match Predicate**:
   ```javascript
   console.log(dropRightWhile([3, 4, 5], (element) => element >= 3));  // []
   ```

### Complexity:
- **Time complexity**: O(n), where `n` is the length of the array. The function scans the array from the end to the beginning and slices it once.
- **Space complexity**: O(n) due to the new array created by `slice`.

This is an efficient and effective way to modify an array based on a condition applied from the right.