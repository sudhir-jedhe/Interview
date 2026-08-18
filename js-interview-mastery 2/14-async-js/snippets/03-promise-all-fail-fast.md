# Promise.all fails fast on the first rejection

```js
Promise.all([
  Promise.resolve(1),
  Promise.reject('boom'),
  new Promise(res => setTimeout(() => res(3), 100)),
]).catch(err => console.log('all rejected with:', err));
// all rejected with: boom
```

`Promise.all` rejects as soon as any input promise rejects, without waiting for the still-pending third promise (which resolves 100ms later) — its eventual result is simply discarded.
