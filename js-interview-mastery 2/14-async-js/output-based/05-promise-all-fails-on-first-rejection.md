```js
Promise.all([
  Promise.resolve(1),
  new Promise((res) => setTimeout(() => res(2), 10)),
  Promise.reject('early fail'),
]).then(vals => console.log('all resolved:', vals))
  .catch(err => console.log('all rejected:', err));
```
**Answer:** `all rejected: early fail`
**Why:** `Promise.reject('early fail')` rejects synchronously (immediately), which is before the 10ms-delayed second promise resolves. `Promise.all` rejects as soon as it sees the *first* rejection among its inputs, regardless of whether other promises are still pending — it doesn't wait for the slow one to finish before failing.
