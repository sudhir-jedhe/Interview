# Problem: Offload a CPU-Bound Prime Computation to a `worker_thread`

## Problem statement

Implement a function `computePrimesBelow(n)` that computes all prime numbers below `n` using the Sieve of Eratosthenes, but runs the computation in a `worker_thread` so it doesn't block the caller's event loop. The result should be returned via a Promise that resolves with the array of primes once the worker finishes.

## Requirements

- The main-thread API should be a simple async function: `await computePrimesBelow(1_000_000)`.
- The actual sieve computation must run entirely inside the worker, not on the main thread.
- Handle worker errors (reject the returned Promise) as well as success.
- Demonstrate that the main thread stays responsive while the worker computes (e.g., a `setInterval` heartbeat keeps ticking on the main thread during the computation).

## Solution

```js
// prime-worker.js — runs entirely inside the worker thread
const { parentPort, workerData } = require('worker_threads');

function sieveOfEratosthenes(limit) {
  const isComposite = new Uint8Array(limit + 1);
  const primes = [];

  for (let i = 2; i <= limit; i++) {
    if (!isComposite[i]) {
      primes.push(i);
      for (let multiple = i * i; multiple <= limit; multiple += i) {
        isComposite[multiple] = 1;
      }
    }
  }
  return primes;
}

try {
  const primes = sieveOfEratosthenes(workerData.n - 1);
  parentPort.postMessage({ ok: true, primes });
} catch (err) {
  parentPort.postMessage({ ok: false, error: err.message });
}
```

```js
// prime-service.js — main-thread API wrapping the worker
const { Worker } = require('worker_threads');
const path = require('path');

function computePrimesBelow(n) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'prime-worker.js'), {
      workerData: { n },
    });

    worker.on('message', (result) => {
      if (result.ok) resolve(result.primes);
      else reject(new Error(result.error));
    });

    worker.on('error', reject); // uncaught exception inside the worker itself
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

module.exports = { computePrimesBelow };
```

```js
// demo.js — proves the main thread stays responsive during the computation
const { computePrimesBelow } = require('./prime-service');

const heartbeat = setInterval(() => console.log('main thread heartbeat:', Date.now()), 200);

computePrimesBelow(5_000_000)
  .then((primes) => {
    console.log(`Found ${primes.length} primes. Last few:`, primes.slice(-5));
    clearInterval(heartbeat);
  })
  .catch((err) => {
    console.error('prime computation failed:', err);
    clearInterval(heartbeat);
  });
```

**How it works:** `prime-worker.js` runs the Sieve of Eratosthenes entirely on a separate thread and reports the result (or an error) via `parentPort.postMessage`. `computePrimesBelow` wraps worker creation and message handling in a Promise so callers get a normal async/await interface without needing to know `worker_threads` exists. In `demo.js`, the `setInterval` heartbeat keeps printing on schedule throughout the multi-second sieve computation — proof the main event loop was never blocked, unlike running the same sieve synchronously in the request handler itself would produce.
