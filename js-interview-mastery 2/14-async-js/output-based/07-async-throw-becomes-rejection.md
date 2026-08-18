```js
async function risky() {
  throw new Error('sync-looking throw');
}
risky().catch(err => console.log('caught:', err.message));
console.log('after call');
```
**Answer:** `after call caught: sync-looking throw`
**Why:** Even though `throw` inside an `async function` looks synchronous, an async function always returns a promise — a synchronous `throw` inside it is automatically converted into a *rejected* promise rather than propagating as a real synchronous exception. `.catch()`'s handler is scheduled as a microtask, so `'after call'` (remaining synchronous code) logs first.
