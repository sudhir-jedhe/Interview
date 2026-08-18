# Async Task Queue

A small, dependency-free Promise-based task queue that limits how many async tasks run **concurrently**. This is the pattern behind real-world concerns like "only 3 uploads in flight at once," "respect a third-party API's rate limit," or "avoid overwhelming a downstream service with 1,000 simultaneous requests." It's a natural, hands-on extension of the sequential-vs-parallel `await` and combinator material in the rest of this topic.

## How it works

- `queue.add(taskFn)` accepts a zero-argument function that returns a Promise (or any value — it's wrapped in `Promise.resolve()`), queues it, and immediately returns a **new Promise** that settles with that specific task's outcome.
- At most `concurrency` tasks run at the same time. Extra tasks wait in an internal FIFO array.
- As soon as a running task settles (success or failure), the queue automatically pulls the next pending task and starts it — see `_processQueue()` in `index.js`.
- A task rejecting does **not** stop the queue or affect other tasks — only the Promise `add()` returned for that specific task rejects.

## Usage

```js
const { TaskQueue } = require('./index');

const queue = new TaskQueue({ concurrency: 3 });

async function uploadFile(file) {
  return queue.add(() => fetch('/upload', { method: 'POST', body: file }));
}

// Adding 20 uploads only ever runs 3 at a time; the rest wait their turn.
const results = await Promise.all(files.map(uploadFile));
```

## Run the demo

The demo processes 10 fake API calls (random duration, occasional random failure) through a queue with `concurrency: 3`, logging exactly when each task starts and finishes so you can see the concurrency cap in action:

```bash
npm run demo
```

## Run the sanity checks

A small dependency-free check script (no test framework needed) verifies: results resolve with the correct per-task value, the configured concurrency limit is never exceeded, and one task rejecting doesn't break the rest of the queue.

```bash
npm test
```

## Design notes

- **Why wrap the task in `Promise.resolve().then(task)`**: this normalizes both synchronous throws and returned non-promise values into proper Promise rejection/resolution, so `task` doesn't need to be `async` itself.
- **Why `.finally()` drives the next task**: decrementing `running` and calling `_processQueue()` again happens regardless of success or failure, guaranteeing the queue always keeps moving even when tasks fail.
- **FIFO fairness**: tasks start in the order they were added (`queue.shift()`), not in the order they happen to finish — this matches most real-world expectations for a work queue.
