# (Node.js only) process.nextTick outranks even Promise microtasks

```js
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
// sync
// nextTick
// promise
```

Node drains the entire `process.nextTick` queue before processing any Promise microtask, making `nextTick` an even higher-priority queue than the standard microtask queue.
