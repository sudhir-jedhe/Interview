### **What is Memoization?**

Memoization is an optimization technique used primarily to speed up applications by storing the results of expensive function calls and returning the cached result when the same inputs occur again. In simpler terms, it allows functions to "remember" the results of previous calls based on their input arguments, so they don't need to repeat the computation for the same inputs.

### **Use of Memoization**

Memoization is particularly useful for:
- **Performance Optimization**: It avoids recalculating values for the same inputs, which is especially helpful in recursive or computationally expensive functions (like Fibonacci, factorials, etc.).
- **Avoiding Redundant Computation**: It reduces the need to redo the work if the result was already computed earlier with the same inputs.
- **Improved Efficiency**: Especially for dynamic programming problems or problems with overlapping subproblems.

### **Basic Implementation of Memoization in JavaScript**

Below are various implementations of the `memoize` function based on different use cases.

---

### **1. Memoize a Function with One Argument**

This version of `memoize` is designed to handle functions that take only a single argument. If the result for a given argument is already in the cache, it returns that result; otherwise, it computes the result and stores it in the cache.

```js
function memoize(func) {
  const cache = {};

  return function (arg) {
    if (cache[arg] !== undefined) {
      console.log('cached');
      return cache[arg]; // Return cached result
    } else {
      const result = func(arg); // Compute the result
      cache[arg] = result; // Store result in cache
      console.log('not cached');
      return result;
    }
  };
}

// Example usage:
const toUpper = (str = "") => str.toUpperCase();

const toUpperMemoized = memoize(toUpper);
toUpperMemoized("abcdef"); // "not cached"
toUpperMemoized("abcdef"); // "cached"
```

### **2. Memoize a Function with Multiple Arguments**

For functions that accept multiple arguments, we modify the `memoize` function to handle more complex key generation. One way is to use `JSON.stringify` to create a unique key for the cache based on the arguments passed.

```js
function memoize(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args); // Create a unique key for the cache
    if (cache[key]) {
      console.log('cached');
      return cache[key]; // Return cached result
    } else {
      const result = fn(...args); // Compute the result
      cache[key] = result; // Store result in cache
      console.log('not cached');
      return result;
    }
  };
}

// Example usage:
const makeFullName = (fName, lName) => `${fName} ${lName}`;

const memoizedMakeFullName = memoize(makeFullName);
memoizedMakeFullName("Marko", "Polo"); // "not cached"
memoizedMakeFullName("Marko", "Polo"); // "cached"
```

### **3. Memoize with Custom Key Generation (Resolver Function)**

In some cases, you may want to use a custom key generation strategy for caching. You can provide a `resolver` function as an optional parameter to the `memoize` function.

```js
function memo(func, resolver) {
  const cache = {};

  return function (...args) {
    const key = resolver ? resolver(...args) : args.join("_"); // Use custom resolver if provided
    if (!cache[key]) {
      cache[key] = func.apply(this, args); // Compute and store result
    }
    return cache[key];
  };
}

// Example usage:
const add = (a, b) => a + b;

// Using a custom resolver that concatenates arguments
const customMemoize = memo(add, (a, b) => `${a}_${b}`);
console.log(customMemoize(1, 2)); // "not cached"
console.log(customMemoize(1, 2)); // "cached"
```

### **4. Memoize a Recursive Function (e.g., Factorial)**

Memoization is particularly useful for recursive functions to avoid redundant calculations, such as in the case of calculating factorials.

```js
function memoize(fn) {
  const cache = new Map();
  return function(arg) {
      if (cache.has(arg)) {
          return cache.get(arg); // Return cached result
      } else {
          const result = fn(arg); // Compute the result
          cache.set(arg, result); // Store in cache
          return result;
      }
  };
}

// Example usage: Memoize factorial function
let factorial = memoize(function fact(value) {
  return value > 1 ? value * fact(value - 1) : 1;
});

console.log(factorial(5)); // 120 (calculated)
console.log(factorial(5)); // 120 (cached)
```

### **5. Memoize a Function that Accepts Arrays (e.g., `reduce`)**

When dealing with arrays or more complex arguments, we can use `JSON.stringify` or any custom strategy to cache results based on the array or object passed.

```js
function memoize(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args); // Unique key for array or object
    if (cache[key]) {
      return cache[key]; // Return cached result
    } else {
      const result = fn(...args); // Compute the result
      cache[key] = result; // Store result in cache
      return result;
    }
  };
}

// Example usage: Memoize reduce function
const reduceAdd = (numbers, startingValue = 0) => numbers.reduce((total, cur) => total + cur, startingValue);

const memoizedReduceAdd = memoize(reduceAdd);

console.log(memoizedReduceAdd([1, 2, 3, 4, 5], 5)); // "not cached"
console.log(memoizedReduceAdd([1, 2, 3, 4, 5], 5)); // "cached"
```

---

### **Final Solution (Memoizing with Arrays)**

Here's the final `memoize` function that works for both single and multiple arguments, including handling more complex use cases like arrays or objects:

```js
const slice = Array.prototype.slice;
function memoize(fn) {
  const cache = {};
  return (...args) => {
    const params = slice.call(args); // Convert arguments into an array
    const key = JSON.stringify(params); // Create a unique cache key
    if (cache[key]) {
      console.log('cached');
      return cache[key]; // Return cached result
    } else {
      let result = fn(...args); // Compute the result
      cache[key] = result; // Store in cache
      console.log('not cached');
      return result;
    }
  };
}

// Example usage:
const makeFullName = (fName, lName) => `${fName} ${lName}`;
const memoizedMakeFullName = memoize(makeFullName);
memoizedMakeFullName("Marko", "Polo"); // "not cached"
memoizedMakeFullName("Marko", "Polo"); // "cached"
```

---

### **Conclusion**

Memoization is a powerful technique that can greatly enhance the performance of functions that are called multiple times with the same arguments. By caching results, you can avoid redundant computations and make your applications more efficient. The provided solutions cover different use cases, from simple functions with one argument to more complex scenarios involving arrays or custom caching strategies.