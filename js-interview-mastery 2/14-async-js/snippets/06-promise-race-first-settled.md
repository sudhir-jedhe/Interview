# Promise.race settles with whichever promise finishes first, win or lose

```js
Promise.race([
  new Promise((_, reject) => setTimeout(() => reject('slow-fail'), 50)),
  new Promise(resolve => setTimeout(() => resolve('fast-win'), 10)),
]).then(console.log).catch(console.log);
// fast-win
```

`race` adopts the outcome (fulfilled or rejected) of whichever promise settles first by wall-clock time — here the 10ms fulfillment wins over the 50ms rejection, so `.then` runs rather than `.catch`.
