# mplementing function composition where functions are evaluated from right to left)

Here is the complete guide and solution for LeetCode #2629: **Function Composition** (implementing function composition where functions are evaluated from **right to left**).

---

### Solution

```javascript
/**
 * Accepts an array of functions and returns a new composed function.
 * Evaluates functions from right to left.
 *
 * @param {Function[]} functions - An array of functions [f1, f2, f3, ..., fn].
 * @return {Function} A function that accepts an initial value x and returns composed result.
 */
var compose = function(functions) {
  return function(x) {
    let result = x;
    
    for (let i = functions.length - 1; i >= 0; i--) {
      result = functions[i](result);
    }
    
    return result;
  };
};

```

---

### Alternative Implementation Approaches

#### 1. Using `Array.prototype.reduceRight()` (Functional Style)

`reduceRight` iterates through the array from right to left, making it the idiomatic functional approach for function composition:

```javascript
var compose = function(functions) {
  return function(x) {
    return functions.reduceRight((acc, fn) => fn(acc), x);
  };
};

```

#### 2. Identity Function Optimization

An empty array of functions should simply return the input value unmodified (the identity function $f(x) = x$). We can handle that as a base case early:

```javascript
var compose = function(functions) {
  if (functions.length === 0) {
    return (x) => x;
  }
  
  return function(x) {
    return functions.reduceRight((acc, fn) => fn(acc), x);
  };
};

```

---

### Usage Examples

#### Example 1: Basic Composition

$$f(x) = x + 1, \quad g(x) = 2x, \quad h(x) = x \times x$$

Composition order: $f(g(h(x)))$ for $x = 4$:

1. $h(4) = 16$
2. $g(16) = 32$
3. $f(32) = 33$

```javascript
const fn = compose([
  x => x + 1,
  x => 2 * x,
  x => x * x
]);

console.log(fn(4)); // Output: 33

```

#### Example 2: Empty Array (Identity Function)

```javascript
const fn = compose([]);

console.log(fn(42)); // Output: 42

```

---

### Key Takeaways

1. **Right-to-Left Execution:** Mathematical composition $(f \circ g)(x) = f(g(x))$ executes the rightmost function $g$ first, feeding its return value into the next function to its left $f$.
2. **Identity Function Behavior:** When `functions` is empty `[]`, the returned composed function acts as an identity function and simply returns `x`.

Here is the complete guide and solution for LeetCode #2626: **Array Reduce Transformation** (implementing custom `reduce` logic without using the built-in `Array.prototype.reduce`).

---

### Solution

```javascript
/**
 * Custom function that reduces an array to a single value using a reducer function and an initial value.
 *
 * @param {number[]} nums - The input array.
 * @param {Function} fn - The reducer function taking (accumulator, currentValue).
 * @param {number} init - The initial accumulator value.
 * @return {number} The final reduced value.
 */
var reduce = function(nums, fn, init) {
  let accum = init;

  for (let i = 0; i < nums.length; i++) {
    accum = fn(accum, nums[i]);
  }

  return accum;
};

```

---

### Alternative Implementation Approaches

#### 1. Using `for...of` Loop

A clean alternative using modern `for...of` iteration over array elements:

```javascript
var reduce = function(nums, fn, init) {
  let accum = init;

  for (const num of nums) {
    accum = fn(accum, num);
  }

  return accum;
};

```

#### 2. Using `Array.prototype.forEach()`

Using `forEach` to iterate through elements sequentially:

```javascript
var reduce = function(nums, fn, init) {
  let accum = init;

  nums.forEach((num) => {
    accum = fn(accum, num);
  });

  return accum;
};

```

---

### Usage Examples

#### Example 1: Sum of Array Elements

```javascript
const nums = [1, 2, 3, 4];
const sum = (accum, curr) => accum + curr;
const init = 0;

console.log(reduce(nums, sum, init)); 
// Output: 10

```

#### Example 2: Sum of Squares

```javascript
const nums = [1, 2, 3, 4];
const sumOfSquares = (accum, curr) => accum + curr * curr;
const init = 100;

console.log(reduce(nums, sumOfSquares, init)); 
// Output: 130 (100 + 1 + 4 + 9 + 16)

```

#### Example 3: Empty Array Edge Case

```javascript
const nums = [];
const sum = (accum, curr) => accum + curr;
const init = 25;

console.log(reduce(nums, sum, init)); 
// Output: 25 (returns init directly)

```

---

### Key Takeaways

1. **Accumulator Updating:** The return value of `fn(accum, nums[i])` becomes the updated `accum` value for the next iteration.
2. **Empty Array Safety:** If `nums` is empty `[]`, the loop doesn't execute and `init` is immediately returned.
