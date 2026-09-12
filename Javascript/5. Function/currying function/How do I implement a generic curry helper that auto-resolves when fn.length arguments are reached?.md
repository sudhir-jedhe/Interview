To implement a generic `curry` function that auto-resolves when `fn.length` arguments are collected, compare the total accumulated arguments against the target function's arity (`fn.length`). If enough arguments have been gathered, execute `fn`; otherwise, return a new function that continues accumulating arguments.

---

### Implementation

```javascript
function curry(fn) {
  return function curried(...args) {
    // If accumulated arguments are greater than or equal to the function's arity
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    // Otherwise, return a function that collects the remaining arguments
    return function (...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

```

---

### Usage & Verification

```javascript
function multiply(a, b, c, d) {
  return a * b * c * d;
}

const curriedMultiply = curry(multiply);

// All these invocations resolve to the same result (24):
console.log(curriedMultiply(1)(2)(3)(4));    // 24
console.log(curriedMultiply(1, 2)(3)(4));    // 24
console.log(curriedMultiply(1)(2, 3, 4));    // 24
console.log(curriedMultiply(1, 2, 3, 4));    // 24
console.log(curriedMultiply(1, 2)(3, 4));    // 24

// Reusing partially applied functions:
const doubleAndTriple = curriedMultiply(2)(3); // Fixed first 2 args
console.log(doubleAndTriple(4)(5)); // 2 * 3 * 4 * 5 = 120
console.log(doubleAndTriple(1)(2)); // 2 * 3 * 1 * 2 = 12

```

---

### Preserving `this` Context

Using `.apply(this, ...)` inside both layers ensures that if the curried function is executed as an object method, `this` is preserved properly:

```javascript
const calculator = {
  multiplier: 10,
  compute(a, b) {
    return (a + b) * this.multiplier;
  },
};

calculator.curriedCompute = curry(calculator.compute);

console.log(calculator.curriedCompute(2)(3)); // 50

```

---

### Critical Edge Cases with `fn.length`

`fn.length` counts the number of formal parameters **before the first parameter with a default value**, and **excludes rest parameters**:

1. **Default parameters:**

```javascript
function foo(a, b = 2, c) {}
console.log(foo.length); // 1 (stops at the first default parameter)

```

1. **Rest parameters:**

```javascript
function bar(a, ...rest) {}
console.log(bar.length); // 1 (rest parameter is omitted from length)

```

#### Allowing Explicit Arity Override

To handle functions with default parameters or rest parameters, allow an optional `arity` argument:

```javascript
function curryWithArity(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

// Example with default parameter:
function addThree(a, b = 10, c = 20) {
  return a + b + c;
}

const curriedAddThree = curryWithArity(addThree, 3);
console.log(curriedAddThree(1)(2)(3)); // 6

```
