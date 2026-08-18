# Scenario: A long-running batch job needs to process a huge in-memory array without duplicating it across workers

You're building a data pipeline that loads a 500MB dataset into memory and needs multiple workers to crunch different slices of it in parallel. Using `cluster` would mean each forked process re-loads (or re-receives via IPC) its own 500MB copy.

**Approach:** Use `worker_threads` with a `SharedArrayBuffer` so all threads read the same memory without duplication:

```js
const { Worker, isMainThread, workerData } = require('worker_threads');

const SIZE = 125_000_000; // e.g. 500MB / 4 bytes per Float64... simplified
const shared = new SharedArrayBuffer(SIZE * 8);
const data = new Float64Array(shared);
// ... populate `data` once ...

if (isMainThread) {
  const numWorkers = 4;
  const chunkSize = Math.ceil(SIZE / numWorkers);
  for (let i = 0; i < numWorkers; i++) {
    new Worker(__filename, {
      workerData: { shared, start: i * chunkSize, end: (i + 1) * chunkSize },
    }).on('message', (partialSum) => console.log('partial:', partialSum));
  }
} else {
  const { shared, start, end } = workerData;
  const view = new Float64Array(shared);
  let sum = 0;
  for (let i = start; i < end; i++) sum += view[i];
  require('worker_threads').parentPort.postMessage(sum);
}
```

This is exactly the scenario `worker_threads` was built for — no copying, no IPC serialization cost for the dataset itself, just each thread reading its own slice of shared memory.
