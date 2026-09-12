### 1. Built-in Method (`Array.prototype.sort`)

JavaScript's native `.sort()` converts elements to strings by default, so you must provide a numerical comparator `(a, b) => a - b` for ascending order.

```javascript
const arr = [42, 5, 12, 89, 1, 16];

// In-place sort (mutates original array):
arr.sort((a, b) => a - b);
console.log(arr); // [1, 5, 12, 16, 42, 89]

// Non-mutating sort (ES2023+ toSorted):
const sorted = arr.toSorted((a, b) => a - b);

```

---

### 2. Quick Sort ($O(n \log n)$ Average Time, In-Place)

Standard divide-and-conquer algorithm suitable for technical interviews:

```javascript
function quickSort(nums, left = 0, right = nums.length - 1) {
  if (left >= right) return nums;

  const pivotIndex = partition(nums, left, right);
  quickSort(nums, left, pivotIndex - 1);
  quickSort(nums, pivotIndex + 1, right);

  return nums;
}

function partition(nums, left, right) {
  const pivot = nums[right];
  let i = left;

  for (let j = left; j < right; j++) {
    if (nums[j] <= pivot) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      i++;
    }
  }

  [nums[i], nums[right]] = [nums[right], nums[i]];
  return i;
}

// Example:
const list = [64, 25, 12, 22, 11];
console.log(quickSort(list)); // [11, 12, 22, 25, 64]

```

---

### 3. Merge Sort ($O(n \log n)$ Guaranteed Time, Stable)

Splits the array into halves, recursively sorts them, and merges the sorted halves:

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

// Example:
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
// [3, 9, 10, 27, 38, 43, 82]

```

---

### Comparison

| Algorithm                      | Average Time  | Worst Time    | Space Complexity | Stability |
| ------------------------------ | ------------- | ------------- | ---------------- | --------- |
| **Native `.sort()` (Timsort)** | $O(n \log n)$ | $O(n \log n)$ | $O(n)$           | Stable    |
| **Quick Sort**                 | $O(n \log n)$ | $O(n^2)$      | $O(\log n)$      | Unstable  |
| **Merge Sort**                 | $O(n \log n)$ | $O(n \log n)$ | $O(n)$           | Stable    |
