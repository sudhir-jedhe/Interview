```js
console.log('start');
Promise.resolve()
  .then(() => console.log('micro 1'))
  .finally(() => console.log('finally'))
  .then(() => console.log('micro 2'));
setTimeout(() => console.log('macro'), 0);
console.log('end');
```
**Answer:** `start end micro 1 finally micro 2 macro`
**Why:** `.finally()` behaves like a `.then()` for scheduling purposes — it's still queued as a microtask in the chain, running after `micro 1` resolves and before the next `.then`. All three chained microtask steps (`micro 1`, `finally`, `micro 2`) fully drain in sequence before the event loop even glances at the macrotask queue for `macro`.
