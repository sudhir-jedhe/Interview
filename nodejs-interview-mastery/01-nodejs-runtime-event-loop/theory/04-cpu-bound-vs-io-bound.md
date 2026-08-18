# CPU-Bound Work Blocks Everything

Because your JS callbacks all run on one thread (see `01-v8-libuv-architecture.md`), a synchronous CPU-heavy operation (a huge `JSON.parse`, a tight loop, synchronous crypto) blocks the entire event loop — no timers fire, no I/O callbacks run, no HTTP requests get served — until it returns:

```js
function blockFor(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {} // burns the event loop
}
```

The fix for CPU-bound work is `worker_threads` (real OS threads for JS execution) or offloading to a separate process/service — not `setImmediate` or promises, which don't create parallelism, only reordering.

## CPU-bound vs I/O-bound work

| Aspect | CPU-bound | I/O-bound |
|---|---|---|
| Example | `JSON.parse` on huge payload, image resizing in pure JS, tight loops | HTTP requests, DB queries, file reads |
| Blocks event loop? | Yes, for its entire duration | No, delegated to OS/thread pool |
| Fix for scaling | `worker_threads`, `child_process`, or a separate service | Already async — just avoid sync APIs |

I/O-bound work is what Node is built for; scale it with more concurrent async calls. CPU-bound work needs real parallelism via `worker_threads` or offloading to another process — the common mistake is trying to "async-ify" CPU work with Promises or `setImmediate`, which only reorders execution, it doesn't create parallelism.

## Offloading to worker_threads

```js
const { Worker, isMainThread, parentPort } = require('worker_threads');

function fib(n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', (result) => console.log('fib(35) =', result));
  console.log('Main thread stays responsive while worker computes');
} else {
  parentPort.postMessage(fib(35));
}
```

This is the correct fix for a scenario like an Express endpoint that synchronously transforms a large JSON payload and stalls every other in-flight request — see `../scenarios/01-cpu-bound-endpoint-blocking-server.md` for the full worked example.
