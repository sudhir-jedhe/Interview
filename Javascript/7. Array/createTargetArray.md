Here is the full solution with code that demonstrates how to create a target array based on the given `nums` and `index` arrays.

### `createTargetArray.js`

````javascript


Here's my take: This snippet is the signature for **LeetCode 1389: Create Target Array in the Given Order**.

You are given two integer arrays, `nums` and `index`. Your goal is to insert each element `nums[i]` into a target array at index `index[i]`. In JavaScript, this is cleanly solved using `Array.prototype.splice()`.

---

### Optimal JavaScript Implementation ($\mathcal{O}(n^2)$)

Because `splice` shifts elements to the right when inserting at an existing index, it natively handles all insertion rules for this problem:

```javascript
/**
 * Given two arrays nums and index, creates a target array according to the rules:
 * Insert nums[i] at index index[i] in target array.
 *
 * @param {number[]} nums
 * @param {number[]} index
 * @returns {number[]} target
 */
export function createTargetArray(nums, index) {
  const target = [];

  for (let i = 0; i < nums.length; i++) {
    // Array.prototype.splice(start, deleteCount, item1)
    // Inserts nums[i] at position index[i] without deleting any existing elements
    target.splice(index[i], 0, nums[i]);
  }

  return target;
}

````

---

### Step-by-Step Example Execution

#### Input:

```javascript
const nums = [0, 1, 2, 3, 4];
const index = [0, 1, 2, 2, 1];

console.log(createTargetArray(nums, index));
```

#### Step-by-Step Trace:

| Step (`i`) | `nums[i]` | `index[i]` | Action                                           | Target Array State    |
| ---------- | --------- | ---------- | ------------------------------------------------ | --------------------- |
| **0**      | `0`       | `0`        | Insert `0` at index `0`                          | `[0]`                 |
| **1**      | `1`       | `1`        | Insert `1` at index `1`                          | `[0, 1]`              |
| **2**      | `2`       | `2`        | Insert `2` at index `2`                          | `[0, 1, 2]`           |
| **3**      | `3`       | `2`        | Insert `3` at index `2` _(shifts `2` right)_     | `[0, 1, 3, 2]`        |
| **4**      | `4`       | `1`        | Insert `4` at index `1` _(shifts `1,3,2` right)_ | **`[0, 4, 1, 3, 2]`** |

**Output:** `[0, 4, 1, 3, 2]`

---

### One-Liner Version (`Array.prototype.reduce`)

If you prefer a concise functional approach:

```javascript
export const createTargetArray = (nums, index) =>
  nums.reduce(
    (target, num, i) => (target.splice(index[i], 0, num), target),
    [],
  );
```

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(n^2)$ — Iterating through $n$ elements takes $\mathcal{O}(n)$, and `splice()` requires shifting up to $n$ elements in memory on each insertion, leading to $\mathcal{O}(n^2)$ overall time.
- **Space Complexity:** $\mathcal{O}(n)$ — Space needed to store the resulting `target` array of size $n$.
  const target = []; // Initialize the target array
  for (let i = 0; i < nums.length; i++) {
  // Insert the element nums[i] at the position index[i] in the target array
  target.splice(index[i], 0, nums[i]);
  }
  return target; // Return the final target array
  }

````

### `main.js`

```javascript
import { createTargetArray } from "./createTargetArray.js";

// Example 1
const nums1 = [0, 1, 2, 3, 4];
const index1 = [0, 1, 2, 2, 1];
console.log(createTargetArray(nums1, index1)); // Output: [0, 4, 1, 3, 2]

// Example 2
const nums2 = [1, 2, 3, 4, 0];
const index2 = [0, 1, 2, 3, 0];
console.log(createTargetArray(nums2, index2)); // Output: [0, 1, 2, 3, 4]

// Example 3
const nums3 = [1];
const index3 = [0];
console.log(createTargetArray(nums3, index3)); // Output: [1]
````

### Explanation of Code:

1. **`createTargetArray.js`**:
   - The function `createTargetArray` takes two arguments: `nums` and `index`.
   - It initializes an empty `target` array.
   - It loops through the `nums` array and inserts each element into the `target` array at the position specified by the corresponding value in the `index` array using `splice`.

2. **`main.js`**:
   - The examples demonstrate how the function works with different inputs.
   - For each example, it prints the result of calling `createTargetArray` with different `nums` and `index` arrays.

### Example Outputs:

1. **Example 1**:
   - Input: `nums = [0, 1, 2, 3, 4]`, `index = [0, 1, 2, 2, 1]`
   - Output: `[0, 4, 1, 3, 2]`

2. **Example 2**:
   - Input: `nums = [1, 2, 3, 4, 0]`, `index = [0, 1, 2, 3, 0]`
   - Output: `[0, 1, 2, 3, 4]`

3. **Example 3**:
   - Input: `nums = [1]`, `index = [0]`
   - Output: `[1]`

### Time and Space Complexity:

- **Time Complexity**: The time complexity is **O(n \* m)** where `n` is the length of the `nums` array, and `m` is the number of elements that need to be shifted for each insertion. `splice` performs this operation, and it can take linear time based on the array's length.
- **Space Complexity**: The space complexity is **O(n)** because the target array is built based on the size of the `nums` array.

This solution works correctly for moderate-sized inputs.

Here's my take: This snippet is the signature for **LeetCode 1389: Create Target Array in the Given Order**.

You are given two integer arrays, `nums` and `index`. Your goal is to insert each element `nums[i]` into a target array at index `index[i]`. In JavaScript, this is cleanly solved using `Array.prototype.splice()`.

---

### Optimal JavaScript Implementation ($\mathcal{O}(n^2)$)

Because `splice` shifts elements to the right when inserting at an existing index, it natively handles all insertion rules for this problem:

```javascript
/**
 * Given two arrays nums and index, creates a target array according to the rules:
 * Insert nums[i] at index index[i] in target array.
 *
 * @param {number[]} nums
 * @param {number[]} index
 * @returns {number[]} target
 */
export function createTargetArray(nums, index) {
  const target = [];

  for (let i = 0; i < nums.length; i++) {
    // Array.prototype.splice(start, deleteCount, item1)
    // Inserts nums[i] at position index[i] without deleting any existing elements
    target.splice(index[i], 0, nums[i]);
  }

  return target;
}
```

---

### Step-by-Step Example Execution

#### Input:

```javascript
const nums = [0, 1, 2, 3, 4];
const index = [0, 1, 2, 2, 1];

console.log(createTargetArray(nums, index));
```

#### Step-by-Step Trace:

| Step (`i`) | `nums[i]` | `index[i]` | Action                                           | Target Array State    |
| ---------- | --------- | ---------- | ------------------------------------------------ | --------------------- |
| **0**      | `0`       | `0`        | Insert `0` at index `0`                          | `[0]`                 |
| **1**      | `1`       | `1`        | Insert `1` at index `1`                          | `[0, 1]`              |
| **2**      | `2`       | `2`        | Insert `2` at index `2`                          | `[0, 1, 2]`           |
| **3**      | `3`       | `2`        | Insert `3` at index `2` _(shifts `2` right)_     | `[0, 1, 3, 2]`        |
| **4**      | `4`       | `1`        | Insert `4` at index `1` _(shifts `1,3,2` right)_ | **`[0, 4, 1, 3, 2]`** |

**Output:** `[0, 4, 1, 3, 2]`

---

### One-Liner Version (`Array.prototype.reduce`)

If you prefer a concise functional approach:

```javascript
export const createTargetArray = (nums, index) =>
  nums.reduce(
    (target, num, i) => (target.splice(index[i], 0, num), target),
    [],
  );
```

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(n^2)$ — Iterating through $n$ elements takes $\mathcal{O}(n)$, and `splice()` requires shifting up to $n$ elements in memory on each insertion, leading to $\mathcal{O}(n^2)$ overall time.
- **Space Complexity:** $\mathcal{O}(n)$ — Space needed to store the resulting `target` array of size $n$.
