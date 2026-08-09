# Filter Elements from Array without using Array.prototype.filter

Here is the complete guide and solution for LeetCode #2634: **Filter Elements from Array** (implementing a custom `filter` function without using the built-in `Array.prototype.filter`).

---

### Solution

```javascript
/**
 * Custom function that filters elements from an array based on a callback predicate.
 *
 * @param {number[]} arr - The input array.
 * @param {Function} fn - The truthy test function taking (element, index).
 * @return {number[]} A new array containing only truthy-evaluated elements.
 */
var filter = function(arr, fn) {
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (Boolean(fn(arr[i], i))) {
      result.push(arr[i]);
    }
  }
  
  return result;
};

```

---

### Alternative Implementation Approaches

#### 1. Concise `for...of` Loop

If index manipulation isn't required manually, `for...of` with `arr.entries()` provides clean iteration:

```javascript
var filter = function(arr, fn) {
  const result = [];
  let index = 0;
  
  for (const element of arr) {
    if (fn(element, index)) {
      result.push(element);
    }
    index++;
  }
  
  return result;
};

```

#### 2. Using `reduce` (Functional Approach)

Implementing filter using array reduction:

```javascript
var filter = function(arr, fn) {
  return arr.reduce((acc, curr, index) => {
    if (fn(curr, index)) {
      acc.push(curr);
    }
    return acc;
  }, []);
};

```

---

### Usage Examples

#### Example 1: Filter Greater Than 10

```javascript
const arr = [0, 10, 20, 30];
const greaterThan10 = (n) => n > 10;

console.log(filter(arr, greaterThan10)); 
// Output: [20, 30]

```

#### Example 2: Filter Using Index (First Element Only)

```javascript
const arr = [1, 2, 3];
const firstIndex = (n, i) => i === 0;

console.log(filter(arr, firstIndex)); 
// Output: [1]

```

#### Example 3: Truthy Value Check (Filtering Truthy Expression Results)

```javascript
const arr = [-2, -1, 0, 1, 2];
const plusOne = (n) => n + 1; // Evaluates to false (0) when n === -1

console.log(filter(arr, plusOne)); 
// Output: [-2, 0, 1, 2]

```

---

### Key Takeaways

1. **Truthy Evaluation:** In JavaScript, the callback function `fn` doesn't always return an explicit boolean. Any **truthy** value (like non-zero numbers, non-empty strings, objects) should keep the element, while **falsy** values (`0`, `false`, `null`, `undefined`, `NaN`, `""`) should reject it.
2. **Parameters Pass Order:** The callback function `fn(arr[i], i)` expects the element value as the first argument and the array index as the second argument.
