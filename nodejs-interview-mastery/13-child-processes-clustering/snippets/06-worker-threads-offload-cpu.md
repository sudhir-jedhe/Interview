# Snippet: `worker_threads` — offload CPU-bound work

```js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

function heavySum(n) {
  let total = 0;
  for (let i = 0; i < n; i++) total += i;
  return total;
}

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 1e9 });
  worker.on('message', (sum) => console.log('sum:', sum));
} else {
  parentPort.postMessage(heavySum(workerData));
}
```

**Explanation:** Same self-referencing pattern as `fork()` — the file checks `isMainThread` to decide whether it's the entry point or the worker. The expensive summing loop runs entirely on the worker's own thread, so the main thread's event loop stays free to do other work (serve HTTP requests, respond to other events) while the computation is in flight. The result comes back via `postMessage`/`on('message', ...)`, structured-cloned rather than shared.
