Here's your code, which checks if the number of occurrences of each element in an array is unique, along with the provided test cases and their explanations.

### Code:

```javascript
function uniqueOccurrences(arr) {
  const occurrenceCount = new Map();

  // Count occurrences of each integer
  for (const num of arr) {
    occurrenceCount.set(num, (occurrenceCount.get(num) || 0) + 1);
  }

  // Create a Set from the occurrence values (counts)
  const occurrenceSet = new Set(occurrenceCount.values());

  // Check if the count of occurrences is unique
  return occurrenceSet.size === occurrenceCount.size;
}

// Test cases
const arr1 = [1, 2, 2, 1, 1, 3];
console.log(uniqueOccurrences(arr1)); // Output: true

const arr2 = [1, 2];
console.log(uniqueOccurrences(arr2)); // Output: false

const arr3 = [-3, 0, 1, -3, 1, 1, 1, -3, 10, 0];
console.log(uniqueOccurrences(arr3)); // Output: true
```

### Explanation:

1. **`uniqueOccurrences` Function:**
   - **Input:** An array of integers `arr`.
   - **Steps:**
     1. A `Map` object (`occurrenceCount`) is used to store how many times each element in the array appears.
     2. The function loops through the array, and for each element (`num`), it updates the count in the `Map` using `occurrenceCount.set(num, (occurrenceCount.get(num) || 0) + 1)`.
     3. A `Set` (`occurrenceSet`) is created from the values of the `occurrenceCount` map to store only the unique occurrence counts.
     4. If the size of the `Set` (which contains only unique counts) is equal to the size of the `Map` (which counts all elements), it means all elements have unique occurrence counts, and the function returns `true`. Otherwise, it returns `false`.

2. **Test Cases:**
   - **Test Case 1:** `[1, 2, 2, 1, 1, 3]`
     - Counts: `1` appears 3 times, `2` appears 2 times, and `3` appears 1 time.
     - Frequencies: `3`, `2`, `1` — all unique.
     - **Output:** `true`
   - **Test Case 2:** `[1, 2]`
     - Counts: `1` appears 1 time, `2` appears 1 time.
     - Both frequencies are `1`, so they are not unique.
     - **Output:** `false`
   - **Test Case 3:** `[-3, 0, 1, -3, 1, 1, 1, -3, 10, 0]`
     - Counts: `-3` appears 3 times, `0` appears 2 times, `1` appears 4 times, and `10` appears 1 time.
     - Frequencies: `3`, `2`, `4`, `1` — all unique.
     - **Output:** `true`

### Output:

```javascript
true;
false;
true;
```

### Time Complexity:

- **O(n)** where `n` is the number of elements in the input array. This is because:
  - We iterate through the array once to build the occurrence map, and
  - We iterate over the unique counts to create the set.

### Space Complexity:

- **O(n)** because the space is used for:
  - Storing the `Map` which holds occurrences of each element.
  - Storing the `Set` which holds the unique occurrence counts.

This solution is efficient and works well for checking if the occurrences of elements are unique in an array.
