# Scenario: One slow synchronous operation is stalling all requests, including unrelated ones

Your team ships a `/report/export` endpoint that generates a large CSV synchronously. Under load, monitoring shows that during an export, `/health` and completely unrelated `/api/*` routes also spike in latency or time out, even though they don't touch the export code at all.

**Approach:** This is the classic single-threaded event-loop-blocking symptom: one handler's synchronous CPU-bound work occupies the only JS thread, so nothing else — including trivial handlers — can run until it finishes. Confirm it first (don't just assume) by profiling with `--inspect` while reproducing the load, and looking for one function dominating self-time in the flame chart. Then move the CPU-bound work off the main thread with `worker_threads`:

```js
// report-worker.js — runs the CPU-heavy CSV generation off the main thread
const { parentPort, workerData } = require('worker_threads');

function buildCsv(rows) {
  let out = 'id,name,total\n';
  for (const row of rows) out += `${row.id},${row.name},${row.total}\n`;
  return out;
}

parentPort.postMessage(buildCsv(workerData.rows));
```

```js
// server.js
const { Worker } = require('worker_threads');
const path = require('path');

function generateCsvInWorker(rows) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'report-worker.js'), { workerData: { rows } });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}

app.get('/report/export', async (req, res) => {
  const rows = await fetchReportRows(); // async DB call, doesn't block
  const csv = await generateCsvInWorker(rows); // CPU work isolated to a worker thread
  res.type('text/csv').send(csv);
});
```

With the heavy computation isolated to a worker thread, the main event loop stays free to keep serving `/health` and every other route while the export runs in the background. For an endpoint hit frequently under load, pool the workers (reuse a fixed set instead of spawning one per request) rather than paying worker-startup cost on every call.
