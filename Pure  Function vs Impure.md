A pure function is a function that always produces the same output for the same input and does not have any side effects.

---

**○ Explanation**

- Deterministic: A pure function guarantees consistent output for identical inputs. For example, `f(x) = x + 2` will always return the same result for a given `x`.

- No Side Effects: It doesn't modify external variables or states. It only works with inputs and returns a result without impacting anything outside the function.

○ Example:

**► Pure Function:**

```js
function add(a, b) {
  return a + b; // Deterministic and no side effects
}

console.log(add(2, 3)); // Output: 5
console.log(add(2, 3)); // Output: 5 (always consistent)
```

**► Impure Function:**

```js
let count = 0;

function incrementCounter() {
  count++; // Modifies external state (side effect)
  return count;
}

console.log(incrementCounter()); // Output: 1
console.log(incrementCounter()); // Output: 2 (not consistent)
```

---

**○ Key Characteristics of Pure Functions**

1.  Same Input, Same Output:

- No dependency on external variables.

2. Immutability:

- Pure functions work with new data rather than modifying existing data.

3. No Side Effects:

- Doesn't alter the external state or rely on external variables.

**○ Real-World Use Cases**

1. Functional Programming:

- Pure functions are core to functional programming paradigms like React's Redux.

```js
function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 }; // Does not mutate state
    default:
      return state;
  }
}
```

2. Unit Testing:

- Pure functions are easy to test since they don’t rely on external factors.

// Test the function
console.assert(add(2, 3) === 5, "Test failed!");

3. Performance Optimization:

- Results of pure functions can be memoized (cached) for performance boosts.

```javascript
const memoizedAdd = (function () {
  const cache = {};
  return function (a, b) {
    const key = `${a},${b}`;
    if (cache[key]) return cache[key];
    cache[key] = a + b;
    return cache[key];
  };
})();

console.log(memoizedAdd(2, 3)); // Output: 5
console.log(memoizedAdd(2, 3)); // Output: 5 (from cache)
```

○ Common Misconceptions

1. Logging as a Side Effect:

- Logging (e.g., `console.log()`) is often debated as a side effect. While it doesn’t change external application state, it interacts with external systems (console).

2. Dependency on Global Variables:

- Pure functions cannot rely on or change global variables.

In JavaScript, functions can be categorized into **pure** and **impure** based on how they interact with external states and data. Here’s a breakdown of each:

### **Pure Function**

A **pure function** is one that satisfies two main properties:

1. **Deterministic**: The output of the function is only determined by its input values. It will always return the same result given the same set of inputs, with no reliance on external state or variables.
2. **No side effects**: A pure function does not alter any external state or variables, such as modifying global variables, changing the state of passed objects, or interacting with external systems like APIs, files, or databases.

#### Example of a Pure Function:

```javascript
// A pure function example
function add(a, b) {
  return a + b; // Output only depends on input parameters
}
```

- If you call `add(2, 3)`, it will always return `5`, no matter how many times it is called or in what context.
- The function does not modify any external variables, states, or produce any side effects.

---

### **Impure Function**

An **impure function** has at least one of the following characteristics:

1. **Non-deterministic**: The output of the function may depend on external factors or states, which can vary each time the function is executed, even with the same input.
2. **Side effects**: Impure functions can have side effects, meaning they can alter the state outside the function, such as modifying global variables, changing properties of passed objects, logging to the console, or interacting with external systems (e.g., network calls, file system, etc.).

#### Example of an Impure Function:

```javascript
// An impure function example
let count = 0; // External state

function increment() {
  count += 1; // Alters external state
  return count;
}
```

- The `increment` function is **impure** because its output is not solely dependent on its inputs, but also on the external state (`count`). If `count` changes between calls, the result of the function will change.
- Additionally, the function modifies the `count` variable, which is a side effect.

---

### **Key Differences:**

| **Aspect**       | **Pure Function**                                         | **Impure Function**                                                              |
| ---------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Output**       | Determined only by input parameters.                      | May depend on or alter external states (variables, I/O).                         |
| **Side Effects** | No side effects (does not modify any external state).     | May have side effects (modifies variables, I/O, API calls).                      |
| **Consistency**  | Will always return the same result for the same inputs.   | Can return different results for the same inputs, depending on external factors. |
| **Testing**      | Easier to test (since they are predictable and isolated). | Harder to test due to reliance on external states.                               |
| **Performance**  | Typically easier to optimize and memoize.                 | May not be optimizable or memoizable due to external dependencies.               |

---

### **Why Use Pure Functions?**

- **Easier to reason about**: Since pure functions are deterministic and do not change any external state, they are easier to understand, debug, and test.
- **Can be memoized**: Since the output depends only on the input, pure functions can be optimized using techniques like memoization (caching the result of function calls).
- **Functional Programming**: Pure functions are a key principle in functional programming, enabling higher-order functions, composition, and immutability.

---

### **Why Impure Functions Are Sometimes Necessary?**

- **Interacting with external systems**: Impure functions are necessary when you need to work with I/O operations like database queries, file system operations, or network requests.
- **State management**: In JavaScript applications, especially with frameworks like React, you may need to update the state (which causes side effects) to re-render the UI, or change the state of the application over time.

---

### Conclusion

- **Pure functions** are great for predictability, testing, and optimization.
- **Impure functions** are often required for real-world applications that interact with external systems and change state.

Balancing the use of pure and impure functions is key in building reliable and maintainable applications.
