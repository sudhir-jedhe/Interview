```js
async function getValue() {
  return 42;
}
getValue().then(v => console.log(v));
console.log('sync');
```
**Answer:** `sync 42`
**Why:** An `async function` always returns a promise, even when the body has no explicit `await` — the returned value `42` is automatically wrapped as a resolved promise. Because promise resolution always happens asynchronously (via the microtask queue), the `.then` callback can't run until the current synchronous execution (`console.log('sync')`) finishes first.
