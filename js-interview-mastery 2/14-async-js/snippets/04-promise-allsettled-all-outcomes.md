# Promise.allSettled never rejects — reports every outcome

```js
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('boom'),
]).then(results => console.log(results));
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'boom' }
// ]
```

Unlike `Promise.all`, `allSettled` always resolves once every input has settled, describing each individual outcome instead of short-circuiting on the first failure.
