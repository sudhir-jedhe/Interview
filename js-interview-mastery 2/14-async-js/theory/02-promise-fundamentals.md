# Promise Fundamentals

## Promise states

A `Promise` is an object representing an eventual value. It has exactly one of three states: **pending** (initial), **fulfilled** (resolved successfully with a value), or **rejected** (failed with a reason). Critically, once a promise **settles** (fulfills or rejects), it is permanently locked into that state and value — calling `resolve`/`reject` again after the first call has no effect:

```js
const p = new Promise((resolve, reject) => {
  resolve('first');
  resolve('second'); // ignored — promise is already settled
  reject(new Error('nope')); // also ignored
});
p.then(console.log); // "first"
```

## Chaining with `.then`/`.catch`/`.finally`

Each `.then()` call returns a **new promise**, which is what makes chaining work. If the callback passed to `.then` returns a plain value, the next `.then` in the chain receives that value; if it returns a promise, the chain waits for it to settle first (auto-flattening, no manual unwrapping needed):

```js
fetchData()
  .then(data => data.value * 2)     // returns a plain number
  .then(doubled => console.log(doubled))
  .catch(err => console.error('failed:', err))
  .finally(() => console.log('done, regardless of outcome'));
```

## Error propagation through a chain

`.catch(fn)` is shorthand for `.then(undefined, fn)` — it catches a rejection from *any* earlier point in the chain, not just the immediately preceding `.then`. This is a key mental model: **errors propagate down the chain** until a `.catch` handles them, skipping intermediate `.then` success handlers entirely.

```js
Promise.reject(new Error('boom'))
  .then(v => console.log('never runs'))
  .then(v => console.log('never runs either'))
  .catch(err => console.log('caught:', err.message)); // caught: boom
```

If a `.catch` handles the error without re-throwing, the returned promise becomes fulfilled again, and any further `.then()` calls after it run normally — the chain has "recovered."

## `.finally()`

`.finally()` runs a callback regardless of whether the promise fulfilled or rejected, useful for cleanup logic (like hiding a loading spinner) that should happen either way. Its callback receives no arguments — it can't inspect the value or reason — and by default it passes through whatever the promise before it resolved/rejected with, unchanged (unless the `.finally` callback itself throws or returns a rejected promise).
