# Output-Based: `cluster` doesn't auto-restart crashed workers

```js
const cluster = require('cluster');
const http = require('http');

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code) => console.log('worker exited with', code));
} else {
  http.createServer((req, res) => res.end('ok')).listen(3000);
  setTimeout(() => process.exit(1), 50);
}
```

**Answer:** After ~50ms: `worker exited with 1`. No auto-restart happens.

**Why:** `cluster` gives you an `exit` event but does **not** automatically restart dead workers — you must call `cluster.fork()` again yourself inside the `exit` handler. This is a common interview trap: people assume `cluster` is self-healing by default, but the restart-on-crash behavior is something you (or a tool like PM2) implement explicitly.
