# .catch() catches a rejection from ANY earlier step in the chain

```js
Promise.resolve()
  .then(() => { throw new Error('mid-chain failure'); })
  .then(() => console.log('skipped'))
  .catch(err => console.log('caught:', err.message));
// caught: mid-chain failure
```

The `throw` inside the first `.then` converts the chain to rejected, which skips the second `.then`'s success handler entirely and jumps straight to the nearest downstream `.catch()`.
