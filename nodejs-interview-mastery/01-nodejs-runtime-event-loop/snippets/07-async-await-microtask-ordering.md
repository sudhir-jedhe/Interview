# Async/Await Desugars to Promise Microtasks — Same Queue Priority

`async`/`await` is syntax sugar over Promises; code after an `await` runs as a Promise continuation, obeying the same microtask priority as `.then()`.

```js
async function example() {
  console.log('1: sync start of async fn');
  await null; // schedules continuation as a microtask
  console.log('3: after await, runs as a microtask');
}
example();
console.log('2: sync code after calling example()');
// Output order: 1, 2, 3
```

Calling `example()` runs synchronously up to the `await null` line (`1` logs immediately), at which point the rest of the function is suspended and its continuation is scheduled as a microtask. Control returns to the caller, which logs `2` synchronously. Only once the current synchronous script finishes does the microtask queue drain, running the rest of `example()` and logging `3`. See `../theory/03-microtasks-nexttick-promises.md` for how this interacts with `process.nextTick` and other Promises scheduled around it.
