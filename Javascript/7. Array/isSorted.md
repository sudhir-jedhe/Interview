Your solution to determine whether an array is sorted in ascending or descending order is efficient and clear. It leverages early returns, checks the direction of sorting (using differences between consecutive elements), and avoids unnecessary comparisons, which makes it better than the naive approach of sorting and comparing the original array.

### Let's break it down:
- **Edge Case Handling**: If the array has one or zero elements, it’s considered unsorted, so returning `0` makes sense.
  
- **Direction Determination**: The function calculates the direction based on the first two elements:
  - If the second element is greater than the first (`arr[1] - arr[0] > 0`), the array is assumed to be ascending.
  - If the second element is smaller than the first (`arr[1] - arr[0] < 0`), the array is assumed to be descending.

- **Iterating Through the Array**: Starting from the third element, it compares each pair of adjacent elements, multiplying their difference by the initial `direction`. If the product is negative, it indicates the array has switched sorting direction, and the function returns `0` (indicating the array is neither ascending nor descending).

- **Return Value**:
  - If the direction remains consistent, the function returns `1` for ascending (`Math.sign(direction)` where `direction` is positive), or `-1` for descending (`Math.sign(direction)` where `direction` is negative).
  
### Improved Version for String Arrays:
As mentioned, you can modify the function to work with non-numeric arrays (e.g., strings). You can use `localeCompare` for strings to handle lexicographical ordering.

### For String Arrays:
```javascript
const isSorted = arr => {
  if (arr.length <= 1) return 0;
  const direction = arr[1].localeCompare(arr[0]);  // Use localeCompare for string comparison
  for (let i = 2; i < arr.length; i++) {
    if (arr[i].localeCompare(arr[i - 1]) * direction < 0) return 0;
  }
  return Math.sign(direction);
};

// Example usage for string arrays:
console.log(isSorted(['apple', 'banana', 'cherry'])); // 1 (ascending)
console.log(isSorted(['cherry', 'banana', 'apple'])); // -1 (descending)
console.log(isSorted(['apple', 'cherry', 'banana'])); // 0 (not sorted)
```

### For More Complex Objects:
If you're dealing with more complex objects (e.g., arrays of objects), you can pass a custom comparator function. Here's an example where we use a comparator based on an object's property:

```javascript
const isSorted = (arr, comparator = (a, b) => a - b) => {
  if (arr.length <= 1) return 0;
  const direction = comparator(arr[1], arr[0]);
  for (let i = 2; i < arr.length; i++) {
    if (comparator(arr[i], arr[i - 1]) * direction < 0) return 0;
  }
  return Math.sign(direction);
};

// Example usage with objects
const objects = [{ age: 30 }, { age: 25 }, { age: 20 }];
console.log(isSorted(objects, (a, b) => a.age - b.age)); // -1 (descending order based on age)
```

### Time Complexity:
- The function iterates over the array exactly once, comparing each pair of adjacent elements, making the time complexity **O(n)** where `n` is the length of the array.

### Space Complexity:
- The space complexity is **O(1)** since the function uses a constant amount of extra space, regardless of the input size.

### Summary:
- Your solution is efficient, leveraging early exits and only comparing necessary elements.
- It's flexible for numeric arrays, string arrays (via `localeCompare`), and more complex object arrays (with a custom comparator).
