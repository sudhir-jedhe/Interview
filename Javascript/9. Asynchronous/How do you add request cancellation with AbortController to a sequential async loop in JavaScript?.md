To add cancellation using `AbortController` to a sequential `async` loop, you need to handle two checkpoints:

1. **Before each iteration:** Call `signal.throwIfAborted()` so the loop immediately stops and does not start the next task if cancellation was requested.
2. **During the active task:** Pass the `AbortSignal` directly to the underlying async operation (such as `fetch()`) so that an in-flight operation aborts immediately rather than waiting to complete.

---

### Implementation

```javascript
/**
 * Runs an array of task-generating functions sequentially with cancellation support.
 *
 * @param {Array<(signal: AbortSignal) => Promise<any>>} tasks
 * @param {Object} options
 * @param {AbortSignal} options.signal
 * @returns {Promise<Array<any>>}
 */
async function runSequenceWithAbort(tasks, { signal } = {}) {
  const results = [];

  for (let i = 0; i < tasks.length; i++) {
    // 1. Guard check: Bail out before starting the next item
    signal?.throwIfAborted();

    const task = tasks[i];

    // 2. Pass signal down to the task for in-flight cancellation
    const result = await task(signal);
    results.push(result);
  }

  return results;
}

```

---

### Usage Example

```javascript
// Simulated async task supporting AbortSignal
function makeRequest(id, durationMs, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      console.log(`Task ${id} completed`);
      resolve({ id, status: "ok" });
    }, durationMs);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        console.log(`Task ${id} interrupted in-flight`);
        reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

// Prepare list of lazy task factories
const taskList = [
  (signal) => makeRequest(1, 400, signal),
  (signal) => makeRequest(2, 400, signal),
  (signal) => makeRequest(3, 400, signal),
  (signal) => makeRequest(4, 400, signal),
];

const controller = new AbortController();

// Cancel execution after 600ms (during Task 2)
setTimeout(() => {
  console.log("--> Triggering cancellation...");
  controller.abort(new DOMException("User cancelled sequence", "AbortError"));
}, 600);

runSequenceWithAbort(taskList, { signal: controller.signal })
  .then((results) => {
    console.log("All tasks succeeded:", results);
  })
  .catch((err) => {
    if (err.name === "AbortError") {
      console.warn("Sequence halted gracefully:", err.message);
    } else {
      console.error("Sequence failed with an error:", err);
    }
  });

```

---

### Execution Output

```text
Task 1 completed
--> Triggering cancellation...
Task 2 interrupted in-flight
Sequence halted gracefully: User cancelled sequence

```

* **Task 1** runs to completion ($400\text{ms}$).
* **Task 2** begins execution at $400\text{ms}$.
* At $600\text{ms}$, `controller.abort()` fires, canceling **Task 2** mid-execution via its event listener.
* **Task 3** and **Task 4** are never called.

---

### Handling Intermittent Errors (Continue on Failure, Stop on Abort)

If you want the loop to continue when a task encounters a standard error, but stop immediately when an abort occurs:

```javascript
async function runSequenceSettledWithAbort(tasks, { signal } = {}) {
  const outcomes = [];

  for (const task of tasks) {
    // Stop immediately on abort
    signal?.throwIfAborted();

    try {
      const value = await task(signal);
      outcomes.push({ status: "fulfilled", value });
    } catch (err) {
      // Re-throw aborts immediately so the sequence halts
      if (signal?.aborted || err.name === "AbortError") {
        throw err;
      }

      // Record standard runtime failures and keep going
      outcomes.push({ status: "rejected", reason: err });
    }
  }

  return outcomes;
}

```

---

### Key Mechanics

* **`signal.throwIfAborted()`:** Standardized in modern runtimes (browsers, Node.js 18+). It synchronously throws the `signal.reason` (defaulting to an `AbortError`) if the signal has already been triggered.
* **Avoid Pre-Calling Promises:** The array must consist of functions `(sig) => fetch(url, { signal: sig })`, rather than resolved/pending promises. Invoking tasks upfront begins execution in parallel before the loop can regulate or abort them.
