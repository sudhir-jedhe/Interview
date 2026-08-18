# Output-Based: `cluster.fork()` spawns real processes

```js
const cluster = require('cluster');

if (cluster.isPrimary) {
  console.log('primary', process.pid);
  cluster.fork();
  cluster.fork();
} else {
  console.log('worker', process.pid);
}
```

**Answer:** One line `primary <pid>` printed once, followed by two `worker <pid>` lines with two *different* PIDs.

**Why:** The primary process runs this file once, calling `fork()` twice. Each `fork()` spawns a brand-new OS process that re-executes the same file from scratch — since `cluster.isPrimary` is `false` in those child processes, they take the `else` branch. Three total process instances run this script.
