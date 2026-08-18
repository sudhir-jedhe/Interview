# Output-Based: `SharedArrayBuffer` visibility across threads

```js
const worker_threads = require('worker_threads');
const shared = new SharedArrayBuffer(4);
const view = new Int32Array(shared);
view[0] = 1;

// imagine this array buffer is passed to a Worker which does: view[0] = 42;
// then, back on the main thread:
setTimeout(() => console.log(view[0]), 100);
```

**Answer:** `42` (assuming the worker has already written by the time the timeout fires)

**Why:** `SharedArrayBuffer` is genuinely shared memory — both the main thread and the worker thread read/write the *same* underlying bytes, no copying or message-passing involved. This is fundamentally different from `postMessage`, which structured-clones (copies) data. Note this makes it your job to coordinate access (e.g., with `Atomics`) to avoid races — there's no synchronization here for granted, this example just illustrates visibility, not safety.
