To process tasks concurrently while yielding or returning each result **strictly in their original sequence as soon as the preceding one is ready**, you need **in-order streaming**.

If task $B$ finishes before task $A$, you must not block task $B$ from running in the background, but you must hold its output until task $A$ resolves and yields.

---

### Pattern 1: Async Generator (Streams in Sequence)

This pattern starts all asynchronous operations immediately (concurrent execution) but awaits their promises sequentially inside a `for await...of` loop or an async generator.

```javascript
/**
 * Starts tasks concurrently, but yields results in original order
 * as soon as previous items have yielded.
 */
async function* streamInSequence(tasks) {
  // 1. Kick off all promises immediately in parallel (non-blocking)
  const inFlightPromises = tasks.map((taskFn) => taskFn());

  // 2. Await them in original sequential order
  for (const promise of inFlightPromises) {
    yield await promise;
  }
}

// Simulated async operation with varying latencies
const fakeFetch = (id, delayMs) => () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log(`  [Done in background] Task ${id} (${delayMs}ms)`);
      resolve(`Result ${id}`);
    }, delayMs)
  );

async function run() {
  const tasks = [
    fakeFetch(1, 800), // Slowest: Task 1 finishes last
    fakeFetch(2, 200), // Fastest: Task 2 finishes first
    fakeFetch(3, 400), // Medium: Task 3 finishes second
  ];

  console.log("Starting tasks concurrently...\n");

  for await (const result of streamInSequence(tasks)) {
    // This logs in strict 1 -> 2 -> 3 order without blocking execution
    console.log(`--> Consumed: ${result}`);
  }
}

run();

```

**Execution Output:**

```text
Starting tasks concurrently...

  [Done in background] Task 2 (200ms)
  [Done in background] Task 3 (400ms)
  [Done in background] Task 1 (800ms)
--> Consumed: Result 1
--> Consumed: Result 2
--> Consumed: Result 3

```

* **Why it works:** Tasks 2 and 3 complete in memory while the loop awaits Task 1. As soon as Task 1 resolves, Tasks 2 and 3 resolve almost instantaneously because their promises are already fulfilled.

---

### Pattern 2: Bounded Concurrency with In-Order Streaming

If you have thousands of tasks, starting all promises simultaneously will overwhelm system resources. You can combine a sliding-window concurrency pool with an in-order consumer queue:

```javascript
/**
 * Executes tasks with limited concurrency, emitting results
 * strictly in the order they were provided.
 */
async function* mapConcurrentInOrder(items, limit, taskFn) {
  const activeQueue = [];
  let index = 0;

  for (const item of items) {
    // Start task and preserve its original position
    const promise = taskFn(item, index++);
    activeQueue.push(promise);

    // Once the concurrency limit is hit, yield the oldest in-flight promise
    if (activeQueue.length >= limit) {
      yield await activeQueue.shift();
    }
  }

  // Drain the remainder in sequential order
  while (activeQueue.length > 0) {
    yield await activeQueue.shift();
  }
}

// Example usage:
const ids = [1, 2, 3, 4, 5, 6];

async function main() {
  const stream = mapConcurrentInOrder(ids, 2, async (id) => {
    const delay = id % 2 === 0 ? 150 : 600; // Even IDs fast, odd IDs slow
    await new Promise((res) => setTimeout(res, delay));
    return `Processed ID ${id}`;
  });

  for await (const value of stream) {
    console.log("Received:", value);
  }
}

main();

```

---

### Pattern 3: Event-Driven Callback / Buffer Approach

If you cannot use `async generators` and prefer an event/callback-driven pipeline, buffer out-of-order completions and flush only sequential indices:

```javascript
function processInSequence(tasks, onNext) {
  const buffer = new Map();
  let nextExpectedIndex = 0;

  tasks.forEach((taskFn, originalIndex) => {
    taskFn().then((result) => {
      buffer.set(originalIndex, result);

      // Flush contiguous results from buffer in order
      while (buffer.has(nextExpectedIndex)) {
        onNext(buffer.get(nextExpectedIndex), nextExpectedIndex);
        buffer.delete(nextExpectedIndex);
        nextExpectedIndex++;
      }
    });
  });
}

// Usage:
processInSequence(
  [fakeFetch(1, 500), fakeFetch(2, 100), fakeFetch(3, 300)],
  (result, idx) => console.log(`Callback in order [${idx}]:`, result)
);

```

---

### Summary Checklist

| Strategy                        | Memory Footprint                                  | Concurrency Control        | Best For                                         |
| ------------------------------- | ------------------------------------------------- | -------------------------- | ------------------------------------------------ |
| **`tasks.map()` + `for await**` | Stores all promises in memory                     | Unbounded                  | Small-to-medium datasets (< 100 tasks)           |
| **Active Sliding Queue**        | Capped to `limit` items                           | Bounded (e.g. 5 at a time) | Large or streaming datasets (1,000+ tasks)       |
| **Buffer Map + Pointer**        | Stores early results until preceding items arrive | Unbounded (or custom)      | Reactive UI updates / event-driven architectures |
