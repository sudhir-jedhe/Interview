To execute asynchronous tasks concurrently in parallel while collecting or consuming their results **in their original sequence**, you have two main approaches depending on your use case:

1. **Wait for the full batch (Batch Collection):** All promises start simultaneously; when all finish, an array is returned matching the original input order.
2. **Stream/Process in sequence as early as possible (Streaming In-Order):** All tasks start simultaneously, but results are yielded or processed sequentially one-by-one the moment the preceding task is ready.

---

### 1. Batch Collection (`Promise.all` / `Promise.allSettled`)

`Promise.all` launches all tasks in parallel and naturally guarantees that the returned array preserves the original input order, regardless of which task finishes first.

```javascript
const waitAndReturn = (id, ms) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log(`[Background] Task ${id} finished in ${ms}ms`);
      resolve(`Result ${id}`);
    }, ms)
  );

async function runParallelBatch() {
  const taskFactories = [
    () => waitAndReturn(1, 1000), // Slowest
    () => waitAndReturn(2, 200),  // Fastest
    () => waitAndReturn(3, 500),  // Medium
  ];

  // 1. Kick off all promises simultaneously
  const inFlightPromises = taskFactories.map((fn) => fn());

  // 2. Await full completion; order matches taskFactories array
  const orderedResults = await Promise.all(inFlightPromises);

  console.log("Ordered batch results:", orderedResults);
}

runParallelBatch();

```

**Output:**

```text
[Background] Task 2 finished in 200ms
[Background] Task 3 finished in 500ms
[Background] Task 1 finished in 1000ms
Ordered batch results: [ 'Result 1', 'Result 2', 'Result 3' ]

```

---

### 2. Streaming In-Order via `for await...of` (Process Results Incrementally)

If you don't want to wait for the entire batch to finish before processing initial results, kick off the promises in parallel and consume them with `for await...of`.

Each item is processed in strict sequence ($1 \rightarrow 2 \rightarrow 3$), but downstream tasks that finished ahead of time are consumed instantly without additional latency.

```javascript
async function* streamInSequence(taskFactories) {
  // Launch all async operations immediately in parallel
  const runningPromises = taskFactories.map((fn) => fn());

  // Yield sequentially in original order
  for (const promise of runningPromises) {
    yield await promise;
  }
}

async function runStreaming() {
  const stream = streamInSequence([
    () => waitAndReturn(1, 800), // Slow
    () => waitAndReturn(2, 100), // Fast (resolves while task 1 is running)
    () => waitAndReturn(3, 300), // Medium (resolves while task 1 is running)
  ]);

  for await (const result of stream) {
    // Task 1 logs at 800ms; Tasks 2 & 3 log immediately after because
    // their promises are already fulfilled in memory.
    console.log("--> Consumed in sequence:", result);
  }
}

runStreaming();

```

**Output:**

```text
[Background] Task 2 finished in 100ms
[Background] Task 3 finished in 300ms
[Background] Task 1 finished in 800ms
--> Consumed in sequence: Result 1
--> Consumed in sequence: Result 2
--> Consumed in sequence: Result 3

```

---

### 3. Fault-Tolerant Sequence (`Promise.allSettled`)

If any task could fail and you don't want an early rejection to wipe out the remaining results:

```javascript
async function runParallelSettled(taskFactories) {
  // Kick off concurrently
  const promises = taskFactories.map((fn) => fn());

  // Collect outcomes preserving index order
  const settled = await Promise.allSettled(promises);

  return settled.map((outcome, index) => {
    if (outcome.status === "fulfilled") {
      return { index, success: true, data: outcome.value };
    }
    return { index, success: false, error: outcome.reason };
  });
}

```

---

### Summary

* **Use `Promise.all(tasks.map(fn => fn()))**` when you need all results together at the end in an ordered array.
* **Use `for await (const res of promises)**` when you want to handle results one-by-one as soon as each predecessor finishes.
* **Always create promises via factory functions (`() => asyncFn()`)** so you maintain complete control over when they fire.
