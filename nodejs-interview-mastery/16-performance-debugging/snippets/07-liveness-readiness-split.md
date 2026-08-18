# Snippet: A minimal liveness + readiness health check split

```js
const express = require('express');
const app = express();
let dbConnected = true; // toggled by your real DB connection logic

app.get('/healthz', (req, res) => res.status(200).send('ok')); // liveness: process is alive
app.get('/readyz', (req, res) => {
  if (!dbConnected) return res.status(503).json({ ready: false, reason: 'db unavailable' });
  res.status(200).json({ ready: true }); // readiness: can actually serve traffic
});
```

**Explanation:** `/healthz` does no dependency checks at all — it just confirms the process is responsive, so it should only fail if the process is genuinely stuck (justifying a restart). `/readyz` checks `dbConnected` and reports `503` when the database is unavailable, which an orchestrator (Kubernetes, a load balancer) uses to pull the instance out of rotation without restarting it — a transient DB blip resolves on its own once `dbConnected` flips back to `true`.
