# Your Express API Becomes Unresponsive Under Load Whenever a Specific Endpoint Is Hit

You have a `/report` endpoint that synchronously transforms a large JSON payload (parsing, filtering, aggregating ~50MB of data) before responding. Under load, *every* endpoint on the server — not just `/report` — starts timing out.

**Approach:** This is CPU-bound work blocking the single JS thread, so it stalls the entire event loop, including unrelated requests waiting in the poll phase. Confirm with `console.time`/event loop lag monitoring, or `perf_hooks.monitorEventLoopDelay()`. Fix by moving the heavy transform off the main thread using `worker_threads`:

```js
// worker.js
const { parentPort, workerData } = require('worker_threads');
function heavyTransform(data) { /* CPU-heavy aggregation */ return data; }
parentPort.postMessage(heavyTransform(workerData));
```

```js
// server.js
const { Worker } = require('worker_threads');
app.post('/report', (req, res) => {
  const worker = new Worker('./worker.js', { workerData: req.body });
  worker.on('message', (result) => res.json(result));
  worker.on('error', (err) => res.status(500).json({ error: err.message }));
});
```

If the transform must stay on the main thread for simplicity, chunk it and yield with `setImmediate` between chunks so other callbacks get a chance to run — but `worker_threads` is the correct fix for true parallelism. See `../theory/04-cpu-bound-vs-io-bound.md` for why `setImmediate`/Promises alone can't fix this.
