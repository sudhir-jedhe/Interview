# Problem: Demonstrate Event-Loop Blocking, Then Fix It With `worker_threads`

## Problem statement

Write a small HTTP server with two routes: `/health` (should always respond instantly) and `/heavy` (runs an intentionally expensive synchronous CPU-bound loop). Demonstrate that while `/heavy` is running, `/health` stalls too — then fix it by moving the heavy computation into a `worker_thread`, and show that `/health` now stays responsive during the same workload.

## Requirements

- The "vulnerable" server must run its heavy computation synchronously, directly in the request handler.
- Include a way to observe the effect: concurrent requests to `/health` while `/heavy` is in flight should visibly stall until `/heavy` completes.
- The "fixed" server must offload the same computation to a `worker_thread` so `/health` responds normally even while `/heavy` is being computed.
- Both versions should compute the same workload (so the comparison is fair) — a large but finite synchronous sum.

## Solution

```js
// vulnerable-server.js — blocks the event loop
const http = require('http');

function heavyComputation(iterations) {
  let sum = 0;
  for (let i = 0; i < iterations; i++) sum += Math.sqrt(i);
  return sum;
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', at: Date.now() }));
    return;
  }

  if (req.url === '/heavy') {
    const start = Date.now();
    const result = heavyComputation(5_000_000_000); // several seconds of sync work
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result, tookMs: Date.now() - start }));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(3000, () => console.log('vulnerable server on :3000'));

// Demonstration: fire a /heavy request, then immediately hammer /health.
// curl http://localhost:3000/heavy &
// for i in 1 2 3; do time curl http://localhost:3000/health; done
// Observation: every /health request's response is delayed until /heavy finishes —
// they all queue behind the single synchronous handler occupying the JS thread.
```

```js
// compute-worker.js — the same heavy computation, run on a worker thread
const { parentPort, workerData } = require('worker_threads');

function heavyComputation(iterations) {
  let sum = 0;
  for (let i = 0; i < iterations; i++) sum += Math.sqrt(i);
  return sum;
}

const start = Date.now();
const result = heavyComputation(workerData.iterations);
parentPort.postMessage({ result, tookMs: Date.now() - start });
```

```js
// fixed-server.js — offloads /heavy to a worker_thread; /health stays responsive
const http = require('http');
const { Worker } = require('worker_threads');
const path = require('path');

function runHeavyInWorker(iterations) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'compute-worker.js'), {
      workerData: { iterations },
    });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', at: Date.now() }));
    return;
  }

  if (req.url === '/heavy') {
    runHeavyInWorker(5_000_000_000).then((data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(3001, () => console.log('fixed server on :3001'));

// Same demonstration against port 3001:
// curl http://localhost:3001/heavy &
// for i in 1 2 3; do time curl http://localhost:3001/health; done
// Observation: /health now responds in milliseconds even while /heavy's worker
// thread is still crunching — the main event loop was never blocked.
```

**How it works:** In `vulnerable-server.js`, `heavyComputation` runs directly on the request-handling thread — Node has exactly one thread for all JS execution, so `/health` requests received while `/heavy` is computing simply can't be processed until that synchronous loop returns control to the event loop. In `fixed-server.js`, the identical computation runs inside `compute-worker.js` on a separate OS thread via `worker_threads`; the main thread only does trivial work (starting the worker, awaiting its `message` event), so it's free to accept and immediately respond to `/health` requests the entire time the worker is busy. Running both servers side by side and repeating the same curl-based test against each is the clearest way to demonstrate the mechanism, not just describe it.
