To execute three asynchronous functions in sequence using promise chaining without terminating on failure, attach a `.catch()` (or rejection handler) to each step. Returning a fallback value or error object allows the next `.then()` to execute regardless of prior rejections.

```javascript
// Mock async functions (task2 rejects to demonstrate error resilience)
const task1 = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("Task 1 completed successfully");
      resolve("Result 1");
    }, 500)
  );

const task2 = () =>
  new Promise((_, reject) =>
    setTimeout(() => {
      console.log("Task 2 failed");
      reject(new Error("Failure in Task 2"));
    }, 500)
  );

const task3 = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log("Task 3 completed successfully");
      resolve("Result 3");
    }, 500)
  );

// Promise chain executing sequentially without halting
const results = [];

task1()
  .then((res) => {
    results.push({ status: "fulfilled", value: res });
  })
  .catch((err) => {
    results.push({ status: "rejected", reason: err.message });
  })
  .then(() => task2())
  .then((res) => {
    results.push({ status: "fulfilled", value: res });
  })
  .catch((err) => {
    results.push({ status: "rejected", reason: err.message });
  })
  .then(() => task3())
  .then((res) => {
    results.push({ status: "fulfilled", value: res });
  })
  .catch((err) => {
    results.push({ status: "rejected", reason: err.message });
  })
  .then(() => {
    console.log("All tasks completed. Final report:", results);
  });

```

**Key Mechanics**

* **Error Recovery:** Each `.catch()` returns a normal resolved value (implicitly `undefined` if nothing is returned), which resets the state from rejected to resolved for the subsequent `.then()`.
* **Sequential Guarantee:** The next async task is returned inside the callback (e.g., `.then(() => task2())`), ensuring the runtime waits for each promise to settle before proceeding.
