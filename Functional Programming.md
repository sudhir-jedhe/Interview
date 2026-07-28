### 31. Memoize a function taking a single argument

Memoization is a technique that stores the result of expensive function calls and returns the cached result when the same inputs occur again.

```javascript
function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    } else {
      const result = fn(arg);
      cache.set(arg, result);
      return result;
    }
  };
}
```

- `memoize`: Caches the result of a function call for a single argument.

---

### 32. Write a pipe function that chains N functions

A `pipe` function takes multiple functions as arguments and returns a new function where the result of one function is passed as input to the next.

```javascript
function pipe(...functions) {
  return function (initialValue) {
    return functions.reduce((value, fn) => fn(value), initialValue);
  };
}
```

- `pipe`: Chains a sequence of functions, passing the result of each to the next.

Example usage:

```javascript
const addOne = (x) => x + 1;
const double = (x) => x * 2;
const pipeResult = pipe(addOne, double);
console.log(pipeResult(3)); // Output: 8 ((3 + 1) * 2)
```

---

### 33. Write a curried function supporting placeholders

Currying transforms a function that takes multiple arguments into a sequence of functions that each take one argument. You can also support placeholders to allow partial application.

```javascript
function curry(fn) {
  const placeholder = Symbol("placeholder");

  function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }

    return function (...nextArgs) {
      const allArgs = args.map((arg) =>
        arg === placeholder ? nextArgs.shift() : arg,
      );
      return curried(...allArgs, ...nextArgs);
    };
  }

  curried.placeholder = placeholder;
  return curried;
}
```

- `curry`: Curries a function and supports placeholders (represented by `Symbol('placeholder')`).

Example usage:

```javascript
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // Output: 6
console.log(curriedAdd(1, curry.placeholder, 3)(2)); // Output: 6 (supports placeholders)
```

---

### 34. Create a polyfill for `Object.assign`

`Object.assign` copies all enumerable properties from one or more source objects to a target object.

```javascript
if (!Object.assign) {
  Object.assign = function (target, ...sources) {
    if (target == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }

    target = Object(target); // Ensure the target is an object

    sources.forEach((source) => {
      if (source != null) {
        // Skip null or undefined
        Object.keys(source).forEach((key) => {
          target[key] = source[key];
        });
      }
    });

    return target;
  };
}
```

- `Object.assign`: Copies properties from one or more source objects to a target object.

---

### 35. Write a polyfill for Lodash's `memoize` function

Lodash's `memoize` function caches results based on arguments. Here’s how you can implement it:

```javascript
function memoize(fn, resolver) {
  const cache = new Map();
  return function (...args) {
    const key = resolver ? resolver(...args) : args[0];
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }
  };
}
```

- `memoize`: Caches results using the function's arguments. Optionally, a custom resolver can be provided to generate a unique key.

---

### 36. Calculate factorial using recursion

A factorial is the product of all positive integers less than or equal to a given number. Here’s a recursive implementation:

```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

- `factorial`: Computes the factorial of `n` using recursion.

Example usage:

```javascript
console.log(factorial(5)); // Output: 120 (5 * 4 * 3 * 2 * 1)
```

---

### 37. Generate Fibonacci numbers up to N

The Fibonacci sequence starts with 0, 1, and each subsequent number is the sum of the two preceding ones. Here’s an implementation to generate Fibonacci numbers up to `N`.

```javascript
function fibonacci(n) {
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result.slice(0, n);
}
```

- `fibonacci`: Generates an array of Fibonacci numbers up to `N`.

Example usage:

```javascript
console.log(fibonacci(5)); // Output: [0, 1, 1, 2, 3]
```

---

### 38. Implement a custom `_chunk` function like Lodash

The `_chunk` function splits an array into smaller arrays of a specified size.

```javascript
function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
```

- `chunk`: Splits an array into subarrays of size `size`.

Example usage:

```javascript
console.log(chunk([1, 2, 3, 4, 5], 2)); // Output: [[1, 2], [3, 4], [5]]
```

---

### 39. Implement `compose`, combining functions from right to left

`compose` combines functions from right to left, meaning the rightmost function is called first.

```javascript
function compose(...fns) {
  return function (value) {
    return fns.reverse().reduce((acc, fn) => fn(acc), value);
  };
}
```

- `compose`: Composes a series of functions, executing from right to left.

Example usage:

```javascript
const addOne = (x) => x + 1;
const double = (x) => x * 2;
const composed = compose(double, addOne);
console.log(composed(3)); // Output: 8 ((3 + 1) * 2)
```

---

### 40. Implement lazy evaluation for a chain of functions

Lazy evaluation means deferring computation until the result is needed. Here's a way to implement it with a function chain:

```javascript
function lazy(fn) {
  let value;
  let isEvaluated = false;

  const evaluate = () => {
    if (!isEvaluated) {
      value = fn();
      isEvaluated = true;
    }
    return value;
  };

  return {
    run: evaluate,
    map: (mapper) => lazy(() => mapper(evaluate())),
  };
}
```

- `lazy`: Allows you to chain functions lazily.

Example usage:

```javascript
const lazyValue = lazy(() => 5)
  .map((x) => x * 2)
  .map((x) => x + 1);
console.log(lazyValue.run()); // Output: 11
```

---

### 41. Flatten an array of arrays using `reduce`

You can flatten a nested array using `reduce` by iterating through each subarray and concatenating them.

```javascript
function flatten(array) {
  return array.reduce(
    (acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item),
    [],
  );
}
```

- `flatten`: Flattens a nested array using recursion and `reduce`.

Example usage:

```javascript
console.log(flatten([1, [2, [3, 4]], 5])); // Output: [1, 2, 3, 4, 5]
```

---

These implementations cover a variety of important functional programming concepts in JavaScript, from currying and memoization to higher-order functions like `pipe`, `compose`, and lazy evaluation.
