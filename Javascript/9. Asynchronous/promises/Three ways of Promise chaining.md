Here are the three primary ways to chain promises sequentially in JavaScript:

---

### 1. Explicit `.then()` Method Chaining (Classic Style)

The direct way to chain promises is linking `.then()` handlers sequentially. Each handler explicitly returns either a value or a new promise, which the subsequent `.then()` consumes.

```javascript
fetchUser(userId)
  .then((user) => {
    console.log("User fetched:", user.name);
    return fetchOrders(user.id); // Returns a new Promise
  })
  .then((orders) => {
    console.log("Orders fetched:", orders.length);
    return processPayment(orders[0]); // Returns another Promise
  })
  .then((receipt) => {
    console.log("Receipt generated:", receipt.id);
  })
  .catch((error) => {
    console.error("Chain interrupted by error:", error.message);
  });

```

* **Best for:** Functional pipelines and straightforward sequences without local state sharing across steps.
* **Key detail:** If an error throws anywhere in the chain, execution skips straight to the nearest `.catch()`.

---

### 2. Dynamic Chaining via Array Reduction (`Array.prototype.reduce`)

When you have a dynamic list of async tasks whose length isn't known ahead of time, you can chain them by accumulating a Promise using `Array.prototype.reduce`.

```javascript
const tasks = [
  (val) => Promise.resolve(val + 10),
  (val) => Promise.resolve(val * 2),
  (val) => Promise.resolve(`Final Value: ${val}`),
];

// Chain the tasks sequentially over an initial resolved promise
tasks
  .reduce((chain, currentTask) => {
    return chain.then((result) => currentTask(result));
  }, Promise.resolve(5))
  .then((finalResult) => {
    console.log(finalResult); // "Final Value: 30" ((5 + 10) * 2)
  })
  .catch((err) => console.error(err));

```

* **Best for:** Dynamic pipelines, middleware chains, or plugin architectures where functions must execute strictly one after another.
* **Key detail:** Tasks must be factory functions `(acc) => Promise`, not pre-instantiated promises, to ensure they run sequentially rather than concurrently.

---

### 3. Procedural Chaining via `async/await` Loops

Modern JavaScript allows chaining promises sequentially in a linear, readable procedural structure using `async/await` paired with a standard `for...of` loop.

```javascript
const steps = [
  () => fetchProfile(),
  () => fetchPermissions(),
  () => fetchPreferences(),
];

async function executeSequence(taskList) {
  const results = [];

  for (const task of taskList) {
    // Execution pauses here until the current step's promise settles
    const res = await task();
    results.push(res);
  }

  return results;
}

executeSequence(steps)
  .then((results) => console.log("All steps complete:", results))
  .catch((err) => console.error("Stopped at failure:", err));

```

* **Best for:** Complex workflows needing conditional branches, loops, or shared local variables across multiple steps.
* **Key detail:** Standard `try...catch` blocks handle errors naturally, matching standard synchronous code ergonomics.

---

### Summary Comparison

| Approach               | Readability                                                       | Best Use Case                           | Dynamic Length Support |
| ---------------------- | ----------------------------------------------------------------- | --------------------------------------- | ---------------------- |
| **Explicit `.then()**` | High for linear flows; drops if variables need cross-step sharing | Fixed sequences of operations           | ❌ Difficult            |
| **Array `reduce()**`   | Moderate (requires accumulator mental model)                      | Middleware chains, dynamic task lists   | Native                 |
| **`async/await` loop** | Highest (reads synchronously)                                     | Complex control flow, conditional steps | Native                 |
