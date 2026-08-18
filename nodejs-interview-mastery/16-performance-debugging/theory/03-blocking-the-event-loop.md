# Performance & Debugging — Blocking the Event Loop

## A concrete example

Node handles concurrency by interleaving async callbacks on one thread — nothing else runs while your synchronous code is executing. A single expensive synchronous call stalls *every* other in-flight request, not just the one that triggered it.

```js
const express = require('express');
const app = express();

app.get('/health', (req, res) => res.send('ok')); // trivial, should always be fast

app.get('/heavy', (req, res) => {
  // synchronous, CPU-bound — blocks the ENTIRE process for its duration
  let sum = 0;
  for (let i = 0; i < 5e9; i++) sum += i;
  res.json({ sum });
});

app.listen(3000);
```

While one client is hitting `/heavy`, every other request — including `/health` — queues behind it and gets no response until the loop is free again, even though `/health` does essentially no work. This is the single most important mental model for Node performance: I/O-bound work is cheap and concurrent, CPU-bound synchronous work is exclusive and blocking.

## The fix: clustering / worker_threads

Move CPU-bound work off the main thread. `cluster` scales an HTTP server across multiple processes/cores so one slow request only blocks the worker handling it, not the whole fleet; `worker_threads` offloads a specific CPU-bound computation to a separate thread within the process, keeping the main event loop free. See topic 13 for the full comparison — the short version: use `cluster` to scale throughput of a server, use `worker_threads` to isolate a specific expensive computation.

## `cluster` vs `worker_threads` as the fix for event-loop blocking

| Aspect | cluster | worker_threads |
|---|---|---|
| What it isolates | Whole server across processes — one worker per core | A specific CPU-bound computation, within one process |
| Blast radius of a blocking call | Only the worker process handling that request stalls; others keep serving | Only the worker thread stalls; the main thread (and its event loop) stays responsive |
| Setup cost | Moderate — fork workers, distribute the listening socket | Low for a single task, but requires structuring the work as a discrete unit to hand off |

Use `cluster` when the blocking risk is spread across many endpoints/handlers and you want overall server resilience/throughput; use `worker_threads` when you can pinpoint one specific expensive operation (image processing, a big JSON parse, cryptographic hashing) and want to isolate just that. They're complementary, not mutually exclusive — many production setups use `cluster` for horizontal scaling and `worker_threads` inside each worker for specific CPU-bound tasks. The common mistake is reaching for `cluster` to fix a single slow function when `worker_threads` would be lighter-weight and keep the fix localized.
