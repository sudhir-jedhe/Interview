# Scenario: A Node service's memory usage grows steadily over days until it crashes

You're on call for a service that runs fine after every deploy but climbs in RSS memory hour over hour, eventually hitting the container's memory limit and getting OOM-killed after 3-5 days. Restarting temporarily "fixes" it, which is itself a red flag for a leak.

**Approach:** Don't guess — capture evidence. Take a heap snapshot under normal load, let the process run for a while (or drive synthetic traffic against it), take a second snapshot, and diff them in Chrome DevTools' comparison view to see which object type's retained size grew without shrinking back.

```js
// Add a debug-only endpoint (or a script) to trigger snapshots on demand
const v8 = require('v8');
const express = require('express');
const app = express();

app.post('/__debug/heap-snapshot', (req, res) => {
  const filename = v8.writeHeapSnapshot();
  res.json({ ok: true, filename });
});
```

Load both `.heapsnapshot` files into DevTools' Memory tab and use "Comparison" view between them. Common culprits to check first, since they account for the vast majority of real leaks:

```js
// 1. Unbounded cache — grows with every unique key, never evicts
const cache = new Map();
app.get('/user/:id', (req, res) => {
  if (!cache.has(req.params.id)) cache.set(req.params.id, loadUser(req.params.id));
  res.json(cache.get(req.params.id));
});
// FIX: cap it
const LRU = require('lru-cache');
const bounded = new LRU({ max: 5000 });

// 2. Listeners/timers registered per-request and never cleaned up
app.use((req, res, next) => {
  someEmitter.on('data', handleData); // never removed — one more listener per request, forever
  next();
});
```

Once the growing type is identified (usually closures, arrays, or Map/Set entries), trace its retainer chain in DevTools to find what root is holding it alive, fix the eviction/cleanup logic, and confirm with another snapshot pair that memory now plateaus under sustained load instead of climbing indefinitely.
