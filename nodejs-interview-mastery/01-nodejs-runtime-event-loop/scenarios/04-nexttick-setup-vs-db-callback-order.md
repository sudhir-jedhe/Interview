# You're Debugging Why a Database Callback Appears to Run Before a "Setup" Step You Thought Happened Synchronously First

```js
function setup(cb) {
  process.nextTick(cb);
}
console.log('before setup');
setup(() => console.log('setup done'));
db.query('SELECT 1', () => console.log('query done'));
console.log('after setup call');
```

The team is confused why `query done` doesn't appear before `setup done` despite `db.query` seeming to "start" first in wall-clock terms.

**Approach:** Walk through the queues: synchronous code runs fully first (`before setup`, `after setup call`). `db.query`'s callback is I/O-bound (poll phase, likely via network socket or thread pool) so it can't fire until the event loop reaches a later phase — but `process.nextTick(cb)` is a microtask that fires as soon as the current synchronous script finishes, before any I/O phase runs. So the real order is `before setup`, `after setup call`, `setup done`, then `query done` once the DB responds. Explain that `nextTick`-based "async" setup functions are effectively synchronous-ish (same tick) and always preempt real I/O, which is often the point of using them for guaranteed-order initialization callbacks. See `../theory/03-microtasks-nexttick-promises.md` for the underlying priority rules.
