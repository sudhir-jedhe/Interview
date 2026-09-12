To execute asynchronous functions concurrently in parallel while processing or consuming their outputs **strictly in their original sequence as soon as the prior task is ready**, use **`for await...of`** over an array of pre-instantiated promises, or use an **async generator**.

---

### Pattern 1: `for await...of` on Pre-Fired Promises (Direct & Clean)

Start all async operations immediately so they run in parallel in the background, then iterate over the array of promises sequentially.

```javascript
// Simulated async task with variable durations
const fetchTask = (id, ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`  [Background Finished] Task ${id} (${ms}ms)`);
      resolve(`Result ${id}`);
    }, ms);
  });

async function runParallelOutputSequential() {
  const taskFactories = [
    () => fetchTask(1, 1000), // Slowest: 1000ms
    () => fetchTask(2, 200),  // Fastest: 200ms
    () => fetchTask(3, 500),  // Medium:  500ms
  ];

  console.log("Starting tasks in parallel...\n");

  // 1. Kick off all promises concurrently (Non-blocking)
  const pendingPromises = taskFactories.map((fn) => fn());

  // 2. Iterate and await each promise in order
  for await (const result of pendingPromises) {
    // Execution pauses here ONLY if the current item is not yet settled.
    // Subsequent items that already settled in background log instantly.
    console.log(`--> Processed sequentially: ${result}`);
  }
}

runParallelOutputSequential();

```

#### Execution Output

```text
Starting tasks in parallel...

  [Background Finished] Task 2 (200ms)
  [Background Finished] Task 3 (500ms)
  [Background Finished] Task 1 (1000ms)
--> Processed sequentially: Result 1
--> Processed sequentially: Result 2
--> Processed sequentially: Result 3

```

* Tasks run concurrently. Task 2 finishes first at 200ms, Task 3 at 500ms, and Task 1 at 1000ms.
* The loop waits for **Task 1**. Once Task 1 settles at 1000ms, it outputs **Result 1**, and then **instantly outputs Result 2 and Result 3** without waiting another millisecond because their promises have already resolved in memory.

---

### Pattern 2: Generator Stream (For Dynamic Pipelines)

If you want to stream results out through an async iterator interface to a consumer:

```javascript
async function* parallelSequentialStream(taskFns) {
  // Fire all operations
  const inFlight = taskFns.map((fn) => fn());

  // Yield in exact original sequence
  for (const promise of inFlight) {
    yield await promise;
  }
}

// Consuming the generator:
async function consumer() {
  const stream = parallelSequentialStream([
    () => fetchTask("A", 800),
    () => fetchTask("B", 100),
    () => fetchTask("C", 300),
  ]);

  for await (const data of stream) {
    console.log("Received in stream order:", data);
  }
}

```

---

### Pattern 3: Event-Driven Buffer (Without Blocking the Event Loop)

If you cannot block or await inside a loop (for example, in a callback-based architecture or reactive UI), buffer early responses in a Map and flush contiguous results as preceding indices finish:

```javascript
function runParallelSequentialCallback(taskFns, onNext) {
  const buffer = new Map();
  let expectedIndex = 0;

  taskFns.forEach((taskFn, originalIndex) => {
    // All tasks launch simultaneously
    taskFn().then((result) => {
      buffer.set(originalIndex, result);

      // Drain buffer strictly in sequential order
      while (buffer.has(expectedIndex)) {
        onNext(buffer.get(expectedIndex), expectedIndex);
        buffer.delete(expectedIndex);
        expectedIndex++;
      }
    });
  });
}

// Usage:
runParallelSequentialCallback(
  [
    () => fetchTask(1, 600),
    () => fetchTask(2, 100),
    () => fetchTask(3, 300)
  ],
  (res, idx) => console.log(`Dispatched [${idx}]:`, res)
);

```

---

### Comparison: Why Not Just `Promise.all`?

| Approach                                   | Parallel Execution? | Output Order | Time to First Output                                                        |
| ------------------------------------------ | ------------------- | ------------ | --------------------------------------------------------------------------- |
| **Sequential `await` in loop**             | ❌ No (serial)       | Sequential   | $t_1$                                                                       |
| **`Promise.all`**                          | Yes                 | Sequential   | $\max(t_1, t_2, \dots)$ (Waits for all to finish before returning anything) |
| **`for await...of` on pre-fired promises** | Yes                 | Sequential   | $t_1$ (Outputs each task as soon as predecessors are cleared)               |
