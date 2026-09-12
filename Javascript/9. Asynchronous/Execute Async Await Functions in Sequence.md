To execute asynchronous functions strictly in sequence using `async/await`, the standard approach is to iterate over an array of **task factory functions** (e.g., `() => asyncOperation()`) using a `for...of` loop.

---

### Basic Pattern: `for...of` Loop

Always store the tasks as **functions returning promises** rather than executing them upfront. If you call the async function before iterating, all tasks will trigger immediately in parallel.

```javascript
// Simulated async task
const waitAndLog = (id, ms) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log(`Completed task ${id} after ${ms}ms`);
      resolve(`Result ${id}`);
    }, ms)
  );

// Define tasks as unexecuted functions
const tasks = [
  () => waitAndLog(1, 1000),
  () => waitAndLog(2, 500),
  () => waitAndLog(3, 800),
];

async function runInSequence(taskList) {
  const results = [];

  for (const task of taskList) {
    // Execution pauses here until the current task resolves
    const result = await task();
    results.push(result);
  }

  return results;
}

runInSequence(tasks).then((allResults) => {
  console.log("All tasks finished:", allResults);
});

```

---

### Alternative Pattern: `Array.prototype.reduce`

You can also sequence async functions by chaining them sequentially over a Promise accumulator:

```javascript
async function runWithReduce(taskList) {
  return taskList.reduce(async (previousPromise, currentTask) => {
    const results = await previousPromise;
    const currentResult = await currentTask();
    return [...results, currentResult];
  }, Promise.resolve([]));
}

runWithReduce(tasks).then((res) => console.log(res));

```

---

### Sequencing When Transforming an Array of Items

When you have a data array and want to run an async operation on each item one at a time:

```javascript
const userIds = [101, 102, 103, 104];

async function fetchUserSequentially(ids) {
  const users = [];

  for (const id of ids) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const user = await response.json();
    users.push(user);
  }

  return users;
}

```

---

### Handling Errors in the Sequence

#### Option A: Stop on First Failure (Default `try/catch`)

Wrapping in a standard `try/catch` stops subsequent tasks if any task throws:

```javascript
async function runWithBailout(taskList) {
  try {
    for (const task of taskList) {
      await task();
    }
  } catch (error) {
    console.error("Sequence aborted due to error:", error.message);
  }
}

```

#### Option B: Continue Despite Failures (All-Settled Style)

Catching errors inside the loop allows remaining tasks to continue executing:

```javascript
async function runSafely(taskList) {
  const outcomes = [];

  for (const task of taskList) {
    try {
      const value = await task();
      outcomes.push({ status: "fulfilled", value });
    } catch (reason) {
      outcomes.push({ status: "rejected", reason });
    }
  }

  return outcomes;
}

```

---

### Common Pitfalls

* **Do not use `forEach` or `map`:**

```javascript
// ❌ Broken: forEach ignores returned promises; operations run concurrently
tasks.forEach(async (task) => {
  await task();
});

```

* **Do not pre-call tasks:**

```javascript
// ❌ Broken: Promises start running immediately upon definition
const tasks = [fetch(url1), fetch(url2)]; 

// ✅ Fixed: Defer invocation using functions
const tasks = [() => fetch(url1), () => fetch(url2)];

```
