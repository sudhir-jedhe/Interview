# Node.js Runtime & Event Loop

Node.js pairs the V8 JavaScript engine with libuv to run JavaScript on a single main thread while still handling thousands of concurrent I/O operations. This topic covers how that's possible: the event loop's phases, where microtasks (`process.nextTick`, Promises) fit relative to those phases, and how Node offloads work to a background thread pool for things V8 can't do asynchronously on its own. Understanding this ordering is the single most commonly tested Node.js concept in interviews, so we trace through concrete examples rather than just listing definitions. We also cover the practical consequence: CPU-bound synchronous code blocks everything, no matter how many pending I/O callbacks are waiting.

> Looking for your original flat notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — core concepts, split by subject:
  - `01-v8-libuv-architecture.md` — V8 + libuv, the threading model, the libuv thread pool, `UV_THREADPOOL_SIZE`
  - `02-event-loop-phases.md` — the six event loop phases, `setTimeout` vs `setImmediate`, timer accuracy
  - `03-microtasks-nexttick-promises.md` — `process.nextTick` and Promise microtask queues, priority, starvation
  - `04-cpu-bound-vs-io-bound.md` — why CPU-bound work blocks the loop, and the `worker_threads` fix
- **`snippets/`** — 7 runnable code snippets, one per file, each with its expected output explained (basic ordering, I/O-callback timing, lag measurement, worker offloading, thread pool concurrency, nextTick starvation, async/await desugaring)
- **`output-based/`** — 8 "predict the output" questions, each with the answer and a step-by-step trace through the queues/phases
- **`scenarios/`** — 5 real-world debugging/design scenarios (unresponsive API under load, serial-seeming password hashing, a hung HTTP server from recursive nextTick, confusing setup-callback ordering, an irregular heartbeat), each with a worked approach and code
- **`interview-qa/`** — 13 Q&A pairs grouped into 4 themed files: threading/runtime model, event loop phases & ordering, nextTick vs setImmediate, and microtask priority/starvation
- **`problems/`** — 3 hands-on coding challenges: a script with guaranteed log ordering, an event-loop-lag monitor built from scratch, and a naive callback-based `Promise.all()`
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`)

## What's covered

- V8 + libuv architecture and why Node is "single-threaded" but not single-threaded
- The six event loop phases (timers, pending callbacks, idle/prepare, poll, check, close callbacks)
- `process.nextTick` queue and the Promise microtask queue, and their priority relative to loop phases
- A full worked trace of `setTimeout` vs `setImmediate` vs `process.nextTick` vs Promises
- Non-blocking I/O without multithreaded JavaScript
- CPU-bound vs I/O-bound work, and why the former starves the event loop
- The libuv thread pool (`fs`, `dns.lookup`, `crypto`, `zlib`) and `UV_THREADPOOL_SIZE`
