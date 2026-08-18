# Scenario: Your Node API server only uses one CPU core in production while you have an 8-core box

You're deploying a stateless REST API. Load testing shows CPU usage pinned at 100% on one core while seven sit idle, and throughput plateaus well below what the hardware should support.

**Approach:** This is the textbook case for `cluster` — fork one worker per core, each independently accepting connections on the same port:

```js
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on('exit', (worker, code) => {
    console.error(`worker ${worker.process.pid} died (${code}), restarting`);
    cluster.fork();
  });
} else {
  require('./server'); // your existing app.listen(3000) code, unchanged
}
```

Since workers are separate processes with no shared memory, make sure any in-memory state (rate-limit counters, session data, caches) that needs to be consistent across workers lives in an external store like Redis — otherwise a client hitting different workers on different requests sees inconsistent state. In practice, most teams reach for PM2 (`pm2 start server.js -i max`) instead of hand-rolling this, since it also gives zero-downtime reloads for free.
