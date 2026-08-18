# Snippet: `SharedArrayBuffer` — true shared memory between threads

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

**Explanation:** Unlike `workerData`/`postMessage`, which structured-clone (copy) data between threads, a `SharedArrayBuffer` is genuinely shared memory — both the main thread's `view` and the worker's `view` point at the *same* underlying bytes. The worker's write to `view[0]` is visible from the main thread without any explicit message being sent. This makes coordination your responsibility (use `Atomics` for safe concurrent access) since there's no automatic locking.
