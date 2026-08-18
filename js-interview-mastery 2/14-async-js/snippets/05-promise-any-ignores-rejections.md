# Promise.any ignores rejections unless everything rejects

```js
Promise.any([
  Promise.reject('err1'),
  Promise.resolve('winner'),
  Promise.reject('err2'),
]).then(console.log);
// winner
```

`Promise.any` resolves with the first *fulfillment* it sees, silently skipping over rejections along the way — it would only itself reject (with an `AggregateError`) if every single input promise rejected.
