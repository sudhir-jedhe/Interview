Here is the complete guide and solution for LeetCode #2666: **Allow One Function Call** (implementing a higher-order function that ensures a target function is executed at most once).

---

### Solution

```javascript
/**
 * Accepts a function and returns a new function that can be called at most once.
 *
 * @param {Function} fn - The target function to wrap.
 * @return {Function} A wrapped function that executes fn on first call and returns undefined on subsequent calls.
 */
var once = function(fn) {
  let called = false;
  let result;

  return function(...args) {
    if (!called) {
      called = true;
      result = fn(...args);
      return result;
    }
    return undefined;
  };
};

```

---

### Alternative Implementation Approaches

#### 1. Nullifying the Reference (Garbage Collection Friendly)

Instead of keeping a boolean flag and cached result, nullify the function reference after execution to free up memory:

```javascript
var once = function(fn) {
  return function(...args) {
    if (fn) {
      const result = fn(...args);
      fn = null; // Mark as called and free reference
      return result;
    }
    return undefined;
  };
};

```

#### 2. Preserving `this` Context

If the wrapped function relies on object context (`this`), bind the invocation explicitly using `.apply()` or `.call()`:

```javascript
var once = function(fn) {
  let called = false;

  return function(...args) {
    if (!called) {
      called = true;
      return fn.apply(this, args);
    }
    return undefined;
  };
};

```

---

### Usage Examples

#### Example 1: Basic Addition Function

```javascript
const fn = (a, b, c) => a + b + c;
const onceFn = once(fn);

console.log(onceFn(1, 2, 3)); // Output: 6
console.log(onceFn(2, 3, 6)); // Output: undefined
console.log(onceFn(4, 5, 6)); // Output: undefined

```

#### Example 2: Multiplication Function

```javascript
const fn = (a, b) => a * b;
const onceFn = once(fn);

console.log(onceFn(5, 7)); // Output: 35
console.log(onceFn(10, 10)); // Output: undefined

```

---

### Key Takeaways

1. **Closure State Preservation:** The outer variable (`called` or `fn`) lives inside a closure retained by the returned inner function.
2. **Rest Parameter (`...args`):** Using spread/rest syntax ensures the wrapped function forwards all incoming arguments dynamically regardless of arity.
