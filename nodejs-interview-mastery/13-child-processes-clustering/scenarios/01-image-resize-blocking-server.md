# Scenario: Your API endpoint resizes uploaded images and the whole server slows down under load

You're building an image upload API. Resizing with a pure-JS library (or even a native binding that runs synchronously) takes 300-800ms per image, and under concurrent uploads, *all* requests — including unrelated ones like `GET /health` — start timing out.

**Approach:** The resize work is CPU-bound and is blocking the single event loop thread, so nothing else can be processed while it runs. Move it off the main thread with `worker_threads` (best if using a JS-based resize) or delegate to a separate process via `child_process` (if shelling out to something like `sharp`'s native bindings, which is actually async already — but assume synchronous work for this example):

```js
const { Worker } = require('worker_threads');
const path = require('path');

function resizeInWorker(buffer, options) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'resize-worker.js'), {
      workerData: { buffer, options },
    });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}

app.post('/upload', async (req, res) => {
  const resized = await resizeInWorker(req.body, { width: 800 });
  res.json({ ok: true, size: resized.length });
});
```

This keeps the main event loop free to keep accepting and completing other requests (including `/health`) while resize work happens on a separate thread. For heavier throughput, pair this with a worker pool (reuse threads instead of spawning one per request) or a job queue backed by Redis/BullMQ if resizing can tolerate being fully async/out-of-band.
