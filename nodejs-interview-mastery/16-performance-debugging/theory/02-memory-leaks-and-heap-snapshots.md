# Performance & Debugging — Memory Leaks and Heap Snapshots

## Finding memory leaks with heap snapshots

A memory leak in Node means objects that should be garbage-collected are still reachable from some root (a variable, a closure, an array, a Map) that outlives its intended purpose. The standard workflow: take a heap snapshot via DevTools (`chrome://inspect` → Memory tab → "Take snapshot"), let the app run under representative load for a while, take a second snapshot, and use the **comparison view** to see which object types grew and didn't shrink back — that's your leak candidate.

```js
// Programmatic snapshot (useful for automated leak-hunting in CI or scripts)
const v8 = require('v8');
v8.writeHeapSnapshot('heap-before.heapsnapshot');
// ... run workload ...
v8.writeHeapSnapshot('heap-after.heapsnapshot');
```

## Common leak sources in long-running servers

**Unbounded caches** — a plain `Map`/object used as a cache with no eviction policy grows forever as new keys accumulate.

```js
// LEAK: grows without bound
const cache = new Map();
app.get('/user/:id', (req, res) => {
  if (!cache.has(req.params.id)) cache.set(req.params.id, expensiveLookup(req.params.id));
  res.json(cache.get(req.params.id));
});
// FIX: bound it (LRU eviction) — e.g. the `lru-cache` package with a `max` option
```

**Global arrays that grow** — logging, metrics, or "recent events" arrays pushed to on every request without ever trimming.

```js
// LEAK
const recentRequests = [];
app.use((req, res, next) => { recentRequests.push(req.url); next(); }); // never trimmed

// FIX
const MAX = 1000;
app.use((req, res, next) => {
  recentRequests.push(req.url);
  if (recentRequests.length > MAX) recentRequests.shift();
  next();
});
```

**Forgotten event listeners / timers** — registering a listener or `setInterval` per request (or per connection) without ever removing it means each one holds a closure referencing everything it captured, and none of that memory is ever released.

```js
// LEAK: a new listener added on every call, never removed
function subscribe(emitter) {
  emitter.on('data', (chunk) => process(chunk)); // accumulates forever if subscribe() is called repeatedly
}

// FIX: remove listeners when done, or use { once: true } for one-shot cases
function subscribe(emitter) {
  const handler = (chunk) => process(chunk);
  emitter.on('data', handler);
  return () => emitter.off('data', handler); // caller invokes this to clean up
}
```

The same underlying mechanism as JS closures in general — a listener callback closes over its enclosing scope, so anything referenced there (large buffers, request objects) stays alive as long as the listener is registered. `EventEmitter` even warns you: exceeding 10 listeners on the same event triggers a `MaxListenersExceededWarning`, which is often your first hint of a leak.
