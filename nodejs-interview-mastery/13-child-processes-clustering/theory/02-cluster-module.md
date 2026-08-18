# Child Processes & Clustering — The `cluster` Module

## What `cluster` does

`cluster` lets a single Node process fork multiple copies of itself (workers), all listening on the same port. The OS (or Node's internal round-robin scheduler on most platforms) distributes incoming connections across workers, so you effectively use every CPU core instead of just one.

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork());
  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died, restarting`);
    cluster.fork(); // auto-restart
  });
} else {
  http.createServer((req, res) => res.end('handled by ' + process.pid)).listen(3000);
}
```

Each worker is a **fully separate process** with its own memory and event loop — no memory is shared. If you need cross-worker state (session cache, rate-limit counters), you need an external store like Redis, not in-process variables.

**Important:** `cluster` does **not** auto-restart crashed workers by default — you must listen for the `exit` event and call `cluster.fork()` again yourself, as shown above. A common interview trap is assuming cluster is self-healing out of the box.

## `cluster` vs `worker_threads`

| Aspect | cluster | worker_threads |
|---|---|---|
| Isolation unit | Separate OS processes | Threads within one process |
| Memory sharing | None (must use Redis/DB for shared state) | Direct, via `SharedArrayBuffer` |
| Overhead per unit | Higher (full process: memory, startup) | Lower (thread) |
| Best for | Scaling an HTTP server across CPU cores | CPU-bound computation (image processing, parsing, crypto) inside one process |
| Crash blast radius | One worker dying doesn't take down others | An uncaught exception in a worker thread can still be isolated, but shared-memory bugs can corrupt state across threads |

Use `cluster` to scale a network server across cores (each worker independently accepts connections on the shared port); use `worker_threads` to parallelize a CPU-bound computation without paying full-process overhead or losing the ability to share memory. The common mistake is using `cluster` for a single heavy computation (wasteful — spins up N full processes for one task) or using `worker_threads` to scale a whole HTTP server (unnecessary complexity when `cluster` already solves that problem cleanly).
