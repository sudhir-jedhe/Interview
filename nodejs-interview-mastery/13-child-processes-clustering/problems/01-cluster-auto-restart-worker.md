# Problem: Cluster Setup with One Worker Per Core and Auto-Restart

## Problem statement

Implement a basic `cluster.js` entry point for an HTTP server that:

1. Forks exactly one worker per available CPU core.
2. Automatically restarts any worker that dies (crash, `process.exit()`, or being killed), so capacity never silently degrades.
3. Logs when a worker starts and when a worker exits (with its exit code) so the behavior is observable.
4. Avoids an infinite restart loop if a worker crashes immediately on startup (a common real-world failure mode — e.g., a bad deploy where the app can't even boot).

## Requirements

- Use only Node core modules (`cluster`, `http`, `os`) — no external process manager.
- The primary process should not itself handle HTTP requests.
- Each worker should run an HTTP server that responds with its own PID, so you can verify requests are being distributed.
- Guard against "crash loop" by tracking rapid repeated restarts and giving up (or backing off) after a threshold, rather than forking forever in a tight loop.

## Solution

```js
// cluster.js
const cluster = require('cluster');
const os = require('os');

const MAX_RESTARTS_PER_WINDOW = 5;
const RESTART_WINDOW_MS = 10_000;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} starting ${numCPUs} workers`);

  const restartTimestamps = [];

  function forkWorker() {
    const worker = cluster.fork();
    console.log(`Worker ${worker.process.pid} started`);
  }

  for (let i = 0; i < numCPUs; i++) forkWorker();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited (code=${code}, signal=${signal})`);

    const now = Date.now();
    restartTimestamps.push(now);
    // drop timestamps outside the sliding window
    while (restartTimestamps.length && now - restartTimestamps[0] > RESTART_WINDOW_MS) {
      restartTimestamps.shift();
    }

    if (restartTimestamps.length > MAX_RESTARTS_PER_WINDOW) {
      console.error(
        `Too many worker restarts (${restartTimestamps.length}) within ${RESTART_WINDOW_MS}ms — ` +
          `refusing to keep restarting. Likely a boot-time crash; check logs.`
      );
      return; // stop forking — don't spin forever on a broken deploy
    }

    forkWorker(); // replace the dead worker
  });
} else {
  // Worker process: run the actual server
  require('./server');
}
```

```js
// server.js — runs inside each worker
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ handledBy: process.pid, path: req.url }));
});

server.listen(3000, () => {
  console.log(`Worker ${process.pid} listening on :3000`);
});
```

**How it works:** The primary forks `os.cpus().length` workers up front, each of which independently binds an HTTP server to port 3000 (Node's cluster module handles distributing connections among them). The `exit` handler always re-forks a replacement worker to keep capacity constant — but it tracks restart timestamps in a sliding window and stops re-forking if restarts happen too rapidly, which is the signature of a worker that crashes immediately on every boot (e.g., a missing environment variable or syntax error) rather than an occasional runtime crash. Without that guard, a broken deploy would burn CPU in an infinite fork-crash-fork loop instead of failing loudly.
