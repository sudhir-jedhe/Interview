# Sequential await vs Promise.all — timing difference

```js
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

`sequential()` starts the second `delay` only after the first has fully resolved, so the total is additive (~200ms). `parallel()` starts both timers at the same moment via `Promise.all`, so the total is roughly the duration of the slower one (~100ms).
