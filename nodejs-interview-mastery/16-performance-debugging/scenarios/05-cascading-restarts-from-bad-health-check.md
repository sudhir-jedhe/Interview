# Scenario: Health checks are causing cascading pod restarts during a brief database blip

Your Kubernetes deployment uses a single `/health` endpoint for both liveness and readiness probes, and that endpoint calls `db.ping()`. During a 30-second database failover, every pod's `/health` starts failing, Kubernetes restarts the entire fleet simultaneously (liveness probe failure = restart), and the resulting connection storm as pods restart makes the outage worse and longer than the original blip.

**Approach:** Split the single endpoint into a liveness check (near-zero-cost, no dependencies — just "is this process alive and not deadlocked") and a separate readiness check (can actually verify dependencies, and failing it just pulls the pod out of load-balancer rotation instead of restarting it):

```js
const express = require('express');
const app = express();

let dbHealthy = true;
db.on('error', () => { dbHealthy = false; });
db.on('connect', () => { dbHealthy = true; });

// Liveness: cheap, dependency-free — restart only if THIS process is actually stuck
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// Readiness: checks dependencies — failing this removes the pod from rotation, no restart
app.get('/readyz', (req, res) => {
  if (!dbHealthy) return res.status(503).json({ ready: false, reason: 'db unavailable' });
  res.status(200).json({ ready: true });
});
```

```yaml
# kubernetes deployment snippet
livenessProbe:
  httpGet: { path: /healthz, port: 3000 }
readinessProbe:
  httpGet: { path: /readyz, port: 3000 }
```

With this split, a database blip fails `/readyz` (pods drain from the load balancer, no traffic sent to them, no restarts) while `/healthz` keeps passing (the process itself is fine), so Kubernetes never touches container lifecycle over a transient dependency issue — it recovers on its own once the DB comes back and `dbHealthy` flips true again.
