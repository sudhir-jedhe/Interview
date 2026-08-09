Here is the complete guide and solution for LeetCode #2623: **Memoize** (implementing a memoization higher-order function to cache function outputs based on inputs).

---

### Solution

```javascript
/**
 * Accepts a function and returns a memoized version of that function.
 * Caches outputs based on input arguments to avoid redundant computations.
 *
 * @param {Function} fn - The target function to memoize.
 * @return {Function} Memoized function.
 */
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    // Convert arguments array into a unique string key
    const key = args.join(',');

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

```

---

### Alternative Implementation Approaches

#### 1. Plain Object Cache (`{}`)

Instead of a `Map`, a standard JavaScript object can serve as the cache hash map:

```javascript
function memoize(fn) {
  const cache = {};

  return function(...args) {
    const key = JSON.stringify(args);

    if (key in cache) {
      return cache[key];
    }

    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

```

#### 2. Nested `Map` Strategy (Avoids String Serialization Overhead)

For functions with fixed arguments (like 2 arguments), nesting `Map` structures eliminates string formatting/parsing overhead:

```javascript
function memoize(fn) {
  const cache = new Map();

  return function(a, b) {
    let subMap = cache.get(a);
    if (!subMap) {
      subMap = new Map();
      cache.set(a, subMap);
    }

    if (subMap.has(b)) {
      return subMap.get(b);
    }

    const result = fn(a, b);
    subMap.set(b, result);
    return result;
  };
}

```

---

### Usage Examples

#### Example 1: Sum Function Call Counter

```javascript
let callCount = 0;
const sum = (a, b) => {
  callCount += 1;
  return a + b;
};

const memoizedSum = memoize(sum);

console.log(memoizedSum(2, 2)); // Returns 4. callCount = 1
console.log(memoizedSum(2, 2)); // Returns 4. callCount = 1 (cached!)
console.log(memoizedSum(1, 2)); // Returns 3. callCount = 2

```

#### Example 2: Recursive Fibonacci Computation

```javascript
const memoizedFib = memoize(function fib(n) {
  if (n <= 1) return 1;
  return memoizedFib(n - 1) + memoizedFib(n - 2);
});

console.log(memoizedFib(50)); // Computes instantly in O(n) instead of O(2^n)

```

---

### Key Takeaways

1. **Unique Key Generation:** Because inputs in this LeetCode problem are numbers or strings, `args.join(',')` or `JSON.stringify(args)` generates a reliable cache key.
2. **`Map.has()` vs Truthy Check:** Always use `cache.has(key)` (or `key in cache`) rather than checking `if (cache.get(key))` because cached values can be falsy (e.g., `0`, `false`, or `null`).
