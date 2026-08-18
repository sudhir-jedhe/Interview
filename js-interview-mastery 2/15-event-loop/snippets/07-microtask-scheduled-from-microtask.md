# A microtask scheduled from WITHIN a microtask still runs before the next macrotask

```js
setTimeout(() => console.log('macrotask'), 0);
Promise.resolve().then(() => {
  console.log('micro A');
  Promise.resolve().then(() => console.log('micro B (scheduled from within micro A)'));
});
// micro A
// micro B (scheduled from within micro A)
// macrotask
```

The microtask queue keeps draining even as new microtasks are added mid-drain — the event loop only proceeds to the macrotask queue once the microtask queue is genuinely empty, however many rounds that takes.
