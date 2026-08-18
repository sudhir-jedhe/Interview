# Problem: A Health-Check Endpoint Reporting Uptime, Memory, and Event Loop Lag

## Problem statement

Implement a `GET /health` Express endpoint that reports the process's uptime, current memory usage, and current event loop lag — useful as a richer diagnostic endpoint (separate from a bare liveness probe) for dashboards or manual investigation during an incident.

## Requirements

- Report `uptimeSeconds` — how long the process has been running.
- Report memory usage via `process.memoryUsage()`, including at least `rss`, `heapUsed`, and `heapTotal`, converted to MB for readability.
- Report `eventLoopLagMs` — measured by scheduling a callback and timing how long it actually took to fire relative to when it was scheduled.
- The endpoint itself must stay fast and non-blocking — measuring lag should not itself introduce meaningful additional lag.
- Structure the response so a monitoring tool could reasonably poll it every few seconds without issue.

## Solution

```js
// health-metrics.js
function bytesToMb(bytes) {
  return Math.round((bytes / 1024 / 1024) * 100) / 100;
}

function getMemorySnapshot() {
  const mem = process.memoryUsage();
  return {
    rssMb: bytesToMb(mem.rss),
    heapUsedMb: bytesToMb(mem.heapUsed),
    heapTotalMb: bytesToMb(mem.heapTotal),
    externalMb: bytesToMb(mem.external),
  };
}

function measureEventLoopLag() {
  return new Promise((resolve) => {
    const scheduledAt = process.hrtime.bigint();
    setImmediate(() => {
      const firedAt = process.hrtime.bigint();
      const lagNs = firedAt - scheduledAt;
      resolve(Number(lagNs) / 1e6); // convert to ms
    });
  });
}

module.exports = { getMemorySnapshot, measureEventLoopLag };
```

```js
// server.js
const express = require('express');
const { getMemorySnapshot, measureEventLoopLag } = require('./health-metrics');

const app = express();

app.get('/health', async (req, res) => {
  const eventLoopLagMs = await measureEventLoopLag();

  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    memory: getMemorySnapshot(),
    eventLoopLagMs: Math.round(eventLoopLagMs * 100) / 100,
    timestamp: new Date().toISOString(),
  });
});

app.listen(3000, () => console.log('listening on :3000'));
```

```
// example response
{
  "status": "ok",
  "uptimeSeconds": 3721,
  "memory": { "rssMb": 84.32, "heapUsedMb": 41.05, "heapTotalMb": 60.13, "externalMb": 2.4 },
  "eventLoopLagMs": 0.87,
  "timestamp": "2026-08-17T12:00:00.000Z"
}
```

**How it works:** `getMemorySnapshot` reads `process.memoryUsage()` and converts each byte figure to a rounded MB value, giving a quick-to-read snapshot of the process's memory footprint at request time. `measureEventLoopLag` schedules a `setImmediate` callback and measures the elapsed time between scheduling and firing using `process.hrtime.bigint()` for nanosecond precision — a growing lag value under load is a direct, quantitative signal that something is occupying the event loop synchronously (as opposed to inferring it indirectly from request latency alone). Because the lag measurement itself only schedules one cheap callback rather than doing any blocking work, the health endpoint stays fast enough to poll frequently without becoming a load-bearing part of the problem it's meant to diagnose. Note this is a richer *diagnostic* endpoint, not a liveness probe — see `theory/05-health-check-endpoints.md` for why a bare liveness check should stay even simpler and dependency-free.
