```js
// Example functions to be lazily evaluated
function add(a, b) {
  console.log("Adding:", a, "+", b);
  return a + b;
}

function multiply(c, d) {
  console.log("Multiplying:", c, "*", d);
  return c * d;
}

function divide(e, f) {
  console.log("Dividing:", e, "/", f);
  return e / f;
}

class LazyChain {
  constructor(value) {
    this.value = value;
    this.functions = [];
  }

  add(func) {
    this.functions.push(func);
    return this;
  }

  evaluate() {
    let result = this.value;
    this.functions.forEach((func) => {
      result = func(result);
    });
    return result;
  }
}

// Example usage
const lazyChain = new LazyChain(2);
lazyChain
  .add((value) => add(value, 3))
  .add((value) => multiply(value, 4))
  .add((value) => divide(value, 2));

// At this point, no computations have been performed

// Evaluate the lazy chain to get the final result
const finalResult = lazyChain.evaluate();
console.log("Final Result:", finalResult);

// Create a function that takes a function as an argument and returns a new function
// that delays the evaluation of the argument function until the result is needed.
const lazy = (fn) => {
  // Create a thunk, which is a function that returns the result of the argument function.
  const thunk = () => fn();

  // Return a new function that returns the result of the thunk.
  return () => thunk();
};

// Create a chain of functions.
const addOne = (x) => x + 1;
const multiplyByTwo = (x) => x * 2;
const square = (x) => x * x;

// Lazy evaluate the chain of functions.
const lazyChain = lazy(addOne)(lazy(multiplyByTwo)(lazy(square)));

// Evaluate the lazy chain and print the result.
console.log(lazyChain()); // 16
```

`lazyChain` usually refers to a classic JavaScript pattern or code challenge (popularized on platforms like Codewars).

The goal of `lazyChain` is to enable method chaining on an initial value—such as array operations like `.map()`, `.filter()`, or `.reverse()`—**without evaluating anything until a final `.value()` method is explicitly called**.

---

### Why Use `lazyChain`?

In standard JavaScript, method calls execute immediately:

```javascript
let result = [1, 2, 3].map((x) => x * 2).reverse(); // Immediately executed
```

With `lazyChain`, operations are queued as lightweight function calls. They only execute sequentially when requested.

---

### Implementation (JavaScript)

```javascript
/**
 * Wraps a value to allow delayed, chained method execution.
 * @param {any} initialValue
 */
function lazyChain(initialValue) {
  // Store pending transformation tasks
  const tasks = [];

  const wrapper = {
    /**
     * Enqueues a prototype method to be invoked lazily.
     * @param {string} methodName - Method name (e.g., 'map', 'filter', 'slice')
     * @param  {...any} args - Arguments to pass to the method
     */
    invoke(methodName, ...args) {
      tasks.push((val) => val[methodName](...args));
      return wrapper; // Return this wrapper to allow method chaining
    },

    /**
     * Executes all enqueued tasks sequentially on initialValue.
     * @returns {any} The final computed result
     */
    value() {
      return tasks.reduce(
        (currentValue, task) => task(currentValue),
        initialValue,
      );
    },
  };

  return wrapper;
}
```

---

### How to Use It

```javascript
const result = lazyChain([1, 2, 3])
  .invoke("map", (x) => x * 2) // Queued (not executed yet)
  .invoke("filter", (x) => x > 2) // Queued (not executed yet)
  .invoke("reverse"); // Queued (not executed yet)

console.log(result.value());
// Output: [6, 4] (Execution happens HERE when .value() is called)
```

---

### Modern ES6+ Proxy Alternative

If you want a cleaner API where you don't need to explicitly write `.invoke('map', ...)` and can instead call methods directly (e.g., `.map(...)`):

```javascript
function lazyChain(initialValue) {
  const tasks = [];

  return new Proxy(
    {},
    {
      get(target, prop) {
        // Terminal trigger
        if (prop === "value") {
          return () => tasks.reduce((acc, task) => task(acc), initialValue);
        }

        // Trap any method call and defer execution
        return (...args) => {
          tasks.push((currentVal) => currentVal[prop](...args));
          return target; // Return proxy for continued chaining
        };
      },
    },
  );
}

// Usage with direct method chaining:
const chained = lazyChain([1, 2, 3])
  .map((x) => x * 10)
  .filter((x) => x > 10)
  .reverse();

console.log(chained.value()); // Output: [30, 20]
```

---

### Complexity & Advantages

- **Deferred Execution**: Avoids unnecessary computations if the result is never consumed.
- **Immutability & Safety**: The original input isn't modified until `.value()` runs, eliminating intermediate state bugs.
- **Time Complexity**: Executing `value()` takes $\mathcal{O}(T \cdot f(n))$, where $T$ is the number of queued operations and $f(n)$ is the runtime of each chained method.
