# Snippets: The Event Loop

```js
// 1. Microtask (Promise) always beats a 0ms macrotask (setTimeout)
setTimeout(() => console.log('macrotask'), 0);
Promise.resolve().then(() => console.log('microtask'));
// microtask
// macrotask
```

```js
// 2. A blocking synchronous loop delays EVERYTHING, even "immediate" async work
console.log('start');
setTimeout(() => console.log('timeout fired'), 0);
const start = Date.now();
while (Date.now() - start < 100) {} // blocks the thread for 100ms
console.log('after blocking loop');
// start
// after blocking loop   <- runs ~100ms later, then...
// timeout fired          <- only now, even though it was "due" much earlier
```

```js
// 3. Chained microtasks all drain before the next macrotask
setTimeout(() => console.log('timeout'), 0);
Promise.resolve()
  .then(() => console.log('micro 1'))
  .then(() => console.log('micro 2'))
  .then(() => console.log('micro 3'));
// micro 1
// micro 2
// micro 3
// timeout
```

```js
// 4. queueMicrotask schedules explicitly, same priority as Promise callbacks
console.log('sync');
queueMicrotask(() => console.log('microtask via queueMicrotask'));
setTimeout(() => console.log('macrotask'), 0);
// sync
// microtask via queueMicrotask
// macrotask
```

```js
// 5. Multiple setTimeouts with the same delay run in scheduling order
setTimeout(() => console.log('first'), 0);
setTimeout(() => console.log('second'), 0);
setTimeout(() => console.log('third'), 0);
// first
// second
// third
```

```js
// 6. (Node.js only) process.nextTick outranks even Promise microtasks
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
// sync
// nextTick
// promise
```

```js
// 7. A microtask scheduled from WITHIN a microtask still runs before the next macrotask
setTimeout(() => console.log('macrotask'), 0);
Promise.resolve().then(() => {
  console.log('micro A');
  Promise.resolve().then(() => console.log('micro B (scheduled from within micro A)'));
});
// micro A
// micro B (scheduled from within micro A)
// macrotask
```
