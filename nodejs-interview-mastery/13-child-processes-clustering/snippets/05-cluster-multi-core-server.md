# Snippet: Minimal cluster server using all CPU cores

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) cluster.fork();
} else {
  http.createServer((_, res) => res.end(`Handled by worker ${process.pid}`)).listen(3000);
}
```

**Explanation:** The primary process forks one worker per CPU core; each worker runs the same file, sees `cluster.isPrimary` as `false`, and independently starts an HTTP server listening on the same port. Node's internal scheduler distributes incoming connections across the workers, so requests get spread across every core instead of pinning just one. Note this minimal version has no restart-on-crash logic — see the `problems/` folder for that addition.
