```js
Promise.resolve('one')
  .then(val => {
    console.log(val);
    return 'two';
  })
  .then(val => {
    throw new Error(val + '-error');
  })
  .catch(err => console.log(err.message))
  .then(() => console.log('finally-ish'));
```
**Answer:**
```
one
two-error
finally-ish
```
**Why:** The chain flows sequentially: the first `.then` logs `'one'` and returns `'two'`. The second `.then` receives `'two'` and throws, which converts the chain to a rejected state, skipping straight to `.catch`. The `.catch` handles it and logs the message, and — critically — a `.catch` handler that doesn't re-throw returns a *fulfilled* promise, so the final `.then` runs normally.
