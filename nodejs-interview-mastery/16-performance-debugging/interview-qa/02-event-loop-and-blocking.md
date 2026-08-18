# Interview Q&A: Event Loop Behavior and Blocking

**Q: Why is Node.js particularly vulnerable to a single slow synchronous function, compared to a traditional multi-threaded server?**

A thread-per-request server (e.g. classic Java/PHP setups) can let one slow request occupy its own thread while other threads keep serving requests in parallel. Node runs all your JavaScript on a single thread, so a synchronous CPU-bound operation occupies that one thread completely — every other in-flight request, no matter how trivial, has to wait for it to finish before its callback can even start executing. Node's concurrency model is excellent for I/O-bound work (many requests can be "in flight" awaiting I/O simultaneously) but offers zero protection against one handler hogging the thread with synchronous computation.

**Q: How would you fix an endpoint that blocks the event loop with CPU-bound work?**

Move the CPU-bound computation off the main thread with `worker_threads`, passing the input via `workerData` and getting the result back via `postMessage` — the main event loop stays free to keep handling other requests while the worker computes. If the blocking risk is spread across many endpoints rather than isolated to one operation, `cluster` (forking one worker process per CPU core) is the complementary fix, since a slow request then only stalls the process handling it, not the whole fleet. The two aren't mutually exclusive — production setups commonly use `cluster` for horizontal scaling and `worker_threads` inside each worker for specific expensive operations.

**Q: Why might a `Promise.then()` callback not run "immediately" even though microtasks have higher priority than timers?**

Microtasks (promise callbacks) do jump the queue ahead of macrotasks like `setTimeout`, but that priority only applies *between* turns of the event loop — they still can't preempt currently-executing synchronous code. The microtask queue is only drained once the current synchronous call stack finishes completely, so a multi-second synchronous busy loop delays a `.then()` callback just as much as it delays a `setTimeout` callback, regardless of either one's queue priority.

**Q: What's "event loop lag" and how would you measure it?**

Event loop lag is the delay between when a callback is *scheduled* to run and when it actually *starts* running — a growing gap means the event loop is busy (usually with synchronous work) and can't get to queued callbacks promptly. A simple way to measure it: schedule a callback with `setImmediate` or a short `setTimeout`, record the timestamp before scheduling and again when it fires, and the difference beyond the expected delay is your lag. Rising lag under load is an early warning sign of event-loop blocking before it becomes visible as full request timeouts.
