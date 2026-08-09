Here is the complete guide and solution for LeetCode #2625: **Flatten Deeply Nested Array** (flattening a multi-dimensional array up to a specified depth $n$ without using the built-in `Array.prototype.flat`).

---

### Solution

```javascript
/**
 * Recursively flattens a multi-dimensional array up to n depth levels.
 *
 * @param {Array} arr - The multi-dimensional array.
 * @param {number} n - Maximum flattening depth.
 * @return {Array} Flattened array.
 */
var flat = function (arr, n) {
  if (n <= 0) return arr;

  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result.push(...flat(arr[i], n - 1));
    } else {
      result.push(arr[i]);
    }
  }

  return result;
};

```

---

### Alternative Implementation Approaches

#### 1. Iterative Approach using a Stack (Avoids Call Stack Overflow)

If an array is deeply nested (e.g., $10^5$ levels deep), recursive calls can throw a `Maximum call stack size exceeded` error. Using an explicit stack handles arbitrarily deep recursion safely:

```javascript
var flat = function (arr, n) {
  if (n <= 0) return arr;

  const stack = arr.map((item) => [item, n]);
  const result = [];

  while (stack.length > 0) {
    const [item, depth] = stack.pop();

    if (Array.isArray(item) && depth > 0) {
      // Push items in reverse order to maintain correct original sequence
      for (let i = item.length - 1; i >= 0; i--) {
        stack.push([item[i], depth - 1]);
      }
    } else {
      result.push(item);
    }
  }

  return result.reverse();
};

```

#### 2. Functional `reduce` with Recursion

A functional implementation using `Array.prototype.reduce`:

```javascript
var flat = function (arr, n) {
  if (n <= 0) return arr;

  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flat(item, n - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
};

```

---

### Usage Examples

#### Example 1: Flatten Depth $n = 1$

```javascript
const arr = [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11]], 12];
const n = 1;

console.log(flat(arr, n));
// Output: [1, 2, 3, 4, 5, 6, 7, 8, [9, 10, 11], 12]

```

#### Example 2: Depth $n = 0$ (No Flattening)

```javascript
const arr = [[1, 2, 3], [4, 5, 6], [7, 8, [9, 10, 11]], 12];
const n = 0;

console.log(flat(arr, n));
// Output: [[1, 2, 3], [4, 5, 6], [7, 8, [9, 10, 11]], 12]

```

#### Example 3: Full Flattening ($n \ge \text{max depth}$)

```javascript
const arr = [[1, 2, 3], [4, 5, 6], [7, 8, [9, 10, 11]], 12];
const n = 2;

console.log(flat(arr, n));
// Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

```

---

### Key Takeaways

1. **Base Case:** When $n \le 0$, return `arr` immediately because no further levels should be unpacked.
2. **Spread Operator Trade-off:** `result.push(...flat(item, n - 1))` is very concise, but for huge arrays with hundreds of thousands of elements, `for` loops or pushing elements individually avoids potential argument limit issues with the JavaScript engine.
