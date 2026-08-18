# queueMicrotask schedules explicitly, same priority as Promise callbacks

```js
console.log('sync');
queueMicrotask(() => console.log('microtask via queueMicrotask'));
setTimeout(() => console.log('macrotask'), 0);
// sync
// microtask via queueMicrotask
// macrotask
```

`queueMicrotask` is a direct way to schedule a microtask without needing a Promise wrapper — it has the exact same queue priority as a `.then()` callback.
