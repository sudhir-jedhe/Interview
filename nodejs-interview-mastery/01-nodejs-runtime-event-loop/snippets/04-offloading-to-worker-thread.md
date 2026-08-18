# Offloading CPU-Bound Work to a Worker Thread Instead of Blocking Main

`worker_threads` gives you a real OS thread to run JS on, so CPU-heavy computation doesn't stall the main event loop.

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

Running this file directly launches a `Worker` pointed at itself (`__filename`) — when that worker instance runs, `isMainThread` is `false`, so it takes the `else` branch, computes the expensive recursive Fibonacci, and posts the result back via `parentPort.postMessage`. Meanwhile the main thread's `console.log('Main thread stays responsive...')` runs immediately, without waiting for the computation — the entire point of moving CPU-bound work off the main thread. See `../theory/04-cpu-bound-vs-io-bound.md` for why this is the correct fix (and `setImmediate`/Promises are not).
