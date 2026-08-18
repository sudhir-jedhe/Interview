# Output-Based: try/catch with a Synchronous Throw vs Async Throw

```js
function riskySync() {
  throw new Error('sync boom');
}
async function riskyAsync() {
  throw new Error('async boom');
}

try {
  riskySync();
  riskyAsync(); // no await
  console.log('after both calls');
} catch (err) {
  console.log('caught:', err.message);
}
```

**Answer:** `caught: sync boom` — then, separately, an unhandled promise rejection warning for `"async boom"` is printed (or crashes the process if `unhandledRejection` isn't handled), and `"after both calls"` is never logged.

**Why:** `riskySync()` throws synchronously, so the surrounding `try/catch` catches it immediately and control jumps to `catch` — `console.log('after both calls')` is never reached. `riskyAsync()` is never awaited, so its rejection happens asynchronously, completely outside the synchronous `try/catch`'s window — a `try/catch` can only catch a promise rejection if you `await` (or `.catch`) it *inside* the `try` block.
