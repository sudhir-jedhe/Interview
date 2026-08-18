# Child Processes & Clustering — `worker_threads`

## Real threads, shared memory

`worker_threads` runs multiple JS execution contexts inside a *single* process, each on its own thread. Unlike cluster workers, threads can share memory directly via `SharedArrayBuffer`, and lightweight message passing via `MessageChannel`/`parentPort` avoids the serialization cost of IPC for most cases (structured clone, not JSON).

```js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { n: 40 } });
  worker.on('message', (result) => console.log('fib:', result));
} else {
  const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
  parentPort.postMessage(fib(workerData.n));
}
```

## `SharedArrayBuffer`

A fixed-length binary buffer that multiple threads (main thread + workers) can read and write directly, without copying. Once you're accessing the shared memory, changes made on one thread are visible on another immediately — this is fundamentally different from `postMessage`, which structured-clones (copies) data. It's your job to coordinate access (e.g., with `Atomics`) to avoid races; `SharedArrayBuffer` gives you visibility, not automatic synchronization.

```js
const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
  const shared = new SharedArrayBuffer(4);
  const view = new Int32Array(shared);
  const worker = new Worker(__filename, { workerData: shared });
  worker.on('exit', () => console.log('after worker wrote:', view[0])); // 99
} else {
  const { workerData } = require('worker_threads');
  const view = new Int32Array(workerData);
  view[0] = 99; // visible to the main thread immediately, no message passing needed
}
```

## When to reach for `worker_threads` over `cluster`

Each `cluster` worker is a full OS process with its own memory space, module cache, and startup cost — heavyweight for what is really just "run this function on N cores." `worker_threads` accomplishes the same parallel CPU work with lower overhead and, critically, the ability to share input/output data via `SharedArrayBuffer` instead of copying it into each process. Reach for `worker_threads` when you can pinpoint one specific expensive, synchronous, CPU-bound operation (image processing, a big JSON parse, cryptographic hashing, a large in-memory dataset multiple threads need to read) rather than when you're trying to scale an entire server's request-handling capacity — that's `cluster`'s job.
