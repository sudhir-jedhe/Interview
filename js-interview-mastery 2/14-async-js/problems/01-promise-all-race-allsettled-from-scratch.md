# Problem: Implement `myPromiseAll`, `myPromiseRace`, and `myPromiseAllSettled`

**Goal:** Re-implement the three most commonly-asked promise combinators using only the `Promise` constructor. This is one of the single most frequent "write it live" async interview questions.

## `myPromiseAll`

Resolves with an array of values, in input order, once every promise fulfills; rejects immediately with the first rejection.

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const values = new Array(promises.length);
    let remaining = promises.length;

    if (remaining === 0) return resolve([]); // edge case: empty input resolves immediately

    promises.forEach((p, index) => {
      Promise.resolve(p) // handles non-promise values in the array too
        .then((value) => {
          values[index] = value; // preserve input order, not completion order
          remaining--;
          if (remaining === 0) resolve(values);
        })
        .catch(reject); // first rejection wins — reject() after the promise is already settled is a no-op
    });
  });
}
```

## `myPromiseRace`

Settles with whichever input promise settles first, adopting either its fulfillment or its rejection.

```js
function myPromiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      Promise.resolve(p).then(resolve, reject); // whichever calls first "wins" — later calls are no-ops
    });
  });
}
```

## `myPromiseAllSettled`

Always resolves, once every promise has settled, with an array describing each outcome.

```js
function myPromiseAllSettled(promises) {
  return new Promise((resolve) => {
    const results = new Array(promises.length);
    let remaining = promises.length;

    if (remaining === 0) return resolve([]);

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((value) => {
          results[index] = { status: 'fulfilled', value };
        })
        .catch((reason) => {
          results[index] = { status: 'rejected', reason };
        })
        .finally(() => {
          remaining--;
          if (remaining === 0) resolve(results); // never rejects, no matter what happened
        });
    });
  });
}
```

## Quick verification

```js
const delay = (ms, val, shouldReject = false) =>
  new Promise((res, rej) => setTimeout(() => (shouldReject ? rej(val) : res(val)), ms));

myPromiseAll([delay(10, 'a'), delay(5, 'b')]).then(console.log);
// ['a', 'b'] — in input order, after ~10ms

myPromiseRace([delay(50, 'slow'), delay(5, 'fast')]).then(console.log);
// 'fast' — after ~5ms

myPromiseAllSettled([delay(5, 'ok'), delay(5, 'fail', true)]).then(console.log);
// [{status:'fulfilled', value:'ok'}, {status:'rejected', reason:'fail'}]
```

## Key implementation details interviewers probe for

- **Preserving input order in `all`/`allSettled`**: results must be written to `values[index]`, not pushed, since promises can settle out of order relative to how they were passed in.
- **Wrapping each item in `Promise.resolve(p)`**: the input array may contain plain (non-promise) values, and real `Promise.all`/`race`/`allSettled` accept those too.
- **Empty array edge case**: `Promise.all([])` resolves immediately with `[]` — without the explicit check, `remaining === 0` would never trigger the countdown-based resolve.
- **`allSettled` never rejects**: note there's no `reject` branch reachable from the outside at all — every individual failure is captured into the results array instead of propagating.
