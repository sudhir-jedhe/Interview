# Snippets: Asynchronous JavaScript

```js
// 1. A promise is locked into its first settled state forever
const p = new Promise((resolve, reject) => {
  resolve('A');
  resolve('B'); // ignored
  reject('C');  // ignored
});
p.then(console.log);
// A
```

```js
// 2. .catch() catches a rejection from ANY earlier step in the chain
Promise.resolve()
  .then(() => { throw new Error('mid-chain failure'); })
  .then(() => console.log('skipped'))
  .catch(err => console.log('caught:', err.message));
// caught: mid-chain failure
```

```js
// 3. Promise.all fails fast on the first rejection
Promise.all([
  Promise.resolve(1),
  Promise.reject('boom'),
  new Promise(res => setTimeout(() => res(3), 100)),
]).catch(err => console.log('all rejected with:', err));
// all rejected with: boom
```

```js
// 4. Promise.allSettled never rejects — reports every outcome
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('boom'),
]).then(results => console.log(results));
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'boom' }
// ]
```

```js
// 5. Promise.any ignores rejections unless everything rejects
Promise.any([
  Promise.reject('err1'),
  Promise.resolve('winner'),
  Promise.reject('err2'),
]).then(console.log);
// winner
```

```js
// 6. Promise.race settles with whichever promise finishes first, win or lose
Promise.race([
  new Promise((_, reject) => setTimeout(() => reject('slow-fail'), 50)),
  new Promise(resolve => setTimeout(() => resolve('fast-win'), 10)),
]).then(console.log).catch(console.log);
// fast-win
```

```js
// 7. Sequential await vs Promise.all — timing difference
const delay = (ms, val) => new Promise(res => setTimeout(() => res(val), ms));

async function sequential() {
  console.time('sequential');
  const a = await delay(100, 'a');
  const b = await delay(100, 'b');
  console.timeEnd('sequential'); // ~200ms
}

async function parallel() {
  console.time('parallel');
  const [a, b] = await Promise.all([delay(100, 'a'), delay(100, 'b')]);
  console.timeEnd('parallel'); // ~100ms
}
```
