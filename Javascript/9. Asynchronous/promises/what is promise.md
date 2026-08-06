Here is a clean, well-formatted, and comprehensive modern JavaScript reference guide based on your notes. The syntax error in your initial promise creation snippet has been fixed, and the examples have been organized for clarity and scannability.

---

# JavaScript Promises: The Complete Guide

A **Promise** is a built-in JavaScript object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It acts as a placeholder for a value that is not necessarily known when the promise is created.

---

## 1. What is a Promise?

A promise can produce a single resolved value or a reason for rejection (such as a network error).

### The 3 States of a Promise

At any given moment, a promise exists in one of three mutually exclusive states:

* **Pending:** Initial state, neither fulfilled nor rejected. The operation is still in progress.
* **Fulfilled:** The asynchronous operation completed successfully, producing a result value.
* **Rejected:** The operation failed, throwing an error or reason for failure.

```text
               ┌─────────────┐
               │   Pending   │
               └──────┬──────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│   Fulfilled   │           │   Rejected    │
│  (Resolved)   │           │  (Failed/Err) │
└───────────────┘           └───────────────┘

```

### Guarantees & Rules

* A pending promise can transition **only** to `Fulfilled` or `Rejected`.
* Once a promise is **settled** (either fulfilled or rejected), its state and value become immutable and cannot change.
* Promises supply a standardized `.then()` method to register callbacks.

---

## 2. Syntax & Basic Usage

### Creating a Promise

Pass a single executor function with `resolve` and `reject` parameters to the `Promise` constructor:

```javascript
// Definition
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  setTimeout(() => {
    if (success) {
      resolve("Operation completed successfully!");
    } else {
      reject(new Error("Operation failed."));
    }
  }, 1000);
});

// Consuming the Promise
myPromise
  .then((value) => console.log(value))
  .catch((error) => console.error(error));

```

### Fetch API Example

Fetching remote data is a classic real-world use case for promises:

```javascript
fetch('https://my.api.com/items/1')
  .then((response) => response.json())
  .then((json) => console.log(json))
  .catch((err) => console.error(`Failed with error: ${err}`));

```

---

## 3. Promise Chaining

Executing a sequence of asynchronous tasks one after another is known as **Promise Chaining**. Each `.then()` handler receives the return value of the previous handler and wraps it in a new promise.

```javascript
new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000);
})
  .then((result) => {
    console.log(result); // Logs: 1
    return result * 2;   // Returns 2
  })
  .then((result) => {
    console.log(result); // Logs: 2
    return result * 3;   // Returns 6
  })
  .then((result) => {
    console.log(result); // Logs: 6
    return result * 4;   // Returns 24
  });

```

---

## 4. Key Promise Combinators

### `Promise.all()`

Takes an iterable (array) of promises and resolves when **all** promises resolve, returning an array of their results in the exact same input order. If **any single promise rejects**, the entire `Promise.all` immediately rejects with that error.

```javascript
const p1 = Promise.resolve("Data 1");
const p2 = Promise.resolve("Data 2");
const p3 = Promise.resolve("Data 3");

Promise.all([p1, p2, p3])
  .then((results) => console.log(results)) // Output: ["Data 1", "Data 2", "Data 3"]
  .catch((error) => console.error(`Error in promises: ${error}`));

```

### `Promise.race()`

Takes an array of promises and returns a promise that fulfills or rejects **as soon as the first promise settles** (whichever is faster).

```javascript
const promise1 = new Promise((resolve) => setTimeout(resolve, 500, "one"));
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, "two"));

Promise.race([promise1, promise2])
  .then((value) => console.log(value)); // Output: "two" (because promise2 resolved faster)

```

---

## 5. Pros & Cons: Promises vs. Callbacks

| Feature / Aspect      | Callbacks                                                       | Promises                                                     |
| --------------------- | --------------------------------------------------------------- | ------------------------------------------------------------ |
| **Readability**       | ❌ Prone to "Callback Hell" (Pyramid of Doom)                    | ✅ Clean linear syntax using `.then()` or `async/await`       |
| **Error Handling**    | ❌ Must handle errors inside every nested function               | ✅ Centralized error handling using `.catch()`                |
| **Parallel Logic**    | ❌ Difficult to track when multiple tasks finish                 | ✅ Built-in helpers like `Promise.all()` and `Promise.race()` |
| **Execution Control** | ❌ Callback can be called too late, too early, or multiple times | ✅ Promises settle exactly once with immutable results        |
| **Complexity**        | 🟢 Simple for single one-off actions                             | 🟡 Mild conceptual overhead and setup                         |
