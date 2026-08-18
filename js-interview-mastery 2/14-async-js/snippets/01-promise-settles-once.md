# A promise is locked into its first settled state forever

```js
const p = new Promise((resolve, reject) => {
  resolve('A');
  resolve('B'); // ignored
  reject('C');  // ignored
});
p.then(console.log);
// A
```

Once `resolve('A')` runs, the promise is fulfilled with `'A'` permanently — every subsequent call to `resolve` or `reject` on the same promise is a no-op.
