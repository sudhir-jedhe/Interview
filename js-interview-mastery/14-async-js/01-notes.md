# Notes: Asynchronous JavaScript

## Callbacks and "callback hell"

The earliest async pattern is passing a function to be invoked later, once an operation finishes:

```js
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    getInvoice(orders[0].id, (invoice) => {
      console.log(invoice);
    });
  });
});
```

Nesting callbacks like this ("callback hell" or "pyramid of doom") makes error handling inconsistent (each level needs its own error check), control flow hard to follow, and composition (running things in parallel, racing them) awkward to hand-roll. Promises were introduced specifically to fix this.

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

`.catch(fn)` is shorthand for `.then(undefined, fn)` — it catches a rejection from *any* earlier point in the chain, not just the immediately preceding `.then`. This is a key mental model: **errors propagate down the chain** until a `.catch` handles them, skipping intermediate `.then` success handlers entirely.

```js
Promise.reject(new Error('boom'))
  .then(v => console.log('never runs'))
  .then(v => console.log('never runs either'))
  .catch(err => console.log('caught:', err.message)); // caught: boom
```

## `Promise.all`, `allSettled`, `race`, `any`

These four combinators handle multiple promises at once, with distinct rejection semantics — this is one of the most commonly tested async topics:

- **`Promise.all(promises)`** — resolves with an array of all values, in order, only if *every* promise fulfills. Rejects immediately with the *first* rejection reason it sees ("fail fast"), even if other promises haven't settled yet.
- **`Promise.allSettled(promises)`** — always resolves (never rejects), with an array of `{ status, value }` or `{ status, reason }` objects describing every promise's outcome. Use this when you want results from everything regardless of individual failures.
- **`Promise.race(promises)`** — settles (fulfills or rejects) as soon as the *first* promise settles, adopting whichever outcome (success or failure) happens first.
- **`Promise.any(promises)`** — resolves with the first *fulfillment*; ignores rejections unless *all* promises reject, in which case it rejects with an `AggregateError` containing all the individual errors.

## `async`/`await`

`async`/`await` is syntax sugar over promises: an `async function` always returns a promise, and `await` pauses execution of that function (without blocking the thread) until the awaited promise settles, then either returns the resolved value or throws the rejection reason.

```js
async function getInvoiceTotal(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    return orders.reduce((sum, o) => sum + o.total, 0);
  } catch (err) {
    console.error('failed to compute total:', err.message);
    throw err; // re-throw so callers know it failed
  }
}
```
`try`/`catch` around `await` is the direct equivalent of `.catch()` in the chain style — a rejected awaited promise throws synchronously (from the async function's perspective) at the `await` line.

## Sequential vs. parallel `await`

Awaiting inside a `for` loop runs requests **sequentially** — each iteration waits for the previous one to fully finish before starting the next, even when the requests have no dependency on each other:

```js
// SLOW — sequential, ~300ms total if each call takes 100ms
for (const id of ids) {
  const result = await fetchItem(id);
  results.push(result);
}

// FAST — parallel, ~100ms total
const results = await Promise.all(ids.map(id => fetchItem(id)));
```
Use sequential `await` only when each step genuinely depends on the previous step's result; otherwise, kick off all the promises first (without awaiting inside the loop) and use `Promise.all` to wait for them together.

## Promisifying a callback API

Wrap the callback-based call in a `new Promise`, calling `resolve`/`reject` from inside the original callback:

```js
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```
