Here is the complete guide and solution for LeetCode #2677: **Chunk Array** (splitting an array into sub-arrays of a specified maximum size `size`).

---

### Solution

```javascript
/**
 * Splits an array into chunks of a given maximum length.
 *
 * @param {Array} arr - The input array.
 * @param {number} size - Maximum size of each chunk.
 * @return {Array[]} An array of chunked sub-arrays.
 */
var chunk = function(arr, size) {
  const chunked = [];
  
  for (let i = 0; i < arr.length; i += size) {
    chunked.push(arr.slice(i, i + size));
  }
  
  return chunked;
};

```

---

### Alternative Implementation Approaches

#### 1. Manual Index Iteration (`while` loop)

Instead of a `for` loop with step size `size`, use a `while` loop with `slice()`:

```javascript
var chunk = function(arr, size) {
  const result = [];
  let index = 0;

  while (index < arr.length) {
    result.push(arr.slice(index, index + size));
    index += size;
  }

  return result;
};

```

#### 2. Element-by-Element Push Loop

If you want to avoid `arr.slice()`, build sub-arrays element by element:

```javascript
var chunk = function(arr, size) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    // If the last chunk is full or doesn't exist, create a new sub-array
    if (i % size === 0) {
      result.push([arr[i]]);
    } else {
      result[result.length - 1].push(arr[i]);
    }
  }

  return result;
};

```

---

### Usage Examples

#### Example 1: Standard Equal Division

```javascript
const arr = [1, 2, 3, 4, 5];
const size = 1;

console.log(chunk(arr, size));
// Output: [[1], [2], [3], [4], [5]]

```

#### Example 2: Chunking with Remainder

```javascript
const arr = [1, 9, 6, 3, 2];
const size = 3;

console.log(chunk(arr, size));
// Output: [[1, 9, 6], [3, 2]]

```

#### Example 3: Chunk Size Exceeding Array Length

```javascript
const arr = [8, 5, 3, 2, 6];
const size = 6;

console.log(chunk(arr, size));
// Output: [[8, 5, 3, 2, 6]]

```

#### Example 4: Empty Array

```javascript
const arr = [];
const size = 1;

console.log(chunk(arr, size));
// Output: []

```

---

### Key Takeaways

1. **`Array.prototype.slice()` Behavior:** `slice(start, end)` does not throw an error if `end` exceeds the array length—it automatically stops at `arr.length`. This handles remainder chunks cleanly without extra bounds checks.
2. **Time and Space Complexity:**

* **Time Complexity:** $O(n)$ where $n$ is the length of `arr` because every element is copied into a chunk once.
* **Space Complexity:** $O(n)$ to store the chunked output array.
