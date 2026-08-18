```js
async function asyncFn() {
  console.log('async start');
  await new Promise(resolve => setTimeout(resolve, 0));
  console.log('async end');
}
console.log('script start');
asyncFn();
console.log('script end');
```
**Answer:** `script start async start script end async end`
**Why:** `asyncFn()` runs synchronously up to the `await`, logging `async start`. The awaited expression is a promise that resolves only after a `setTimeout` macrotask fires — so execution of `asyncFn` is suspended until that timer completes, well after the surrounding synchronous code (`script end`) finishes. Once the timer's macrotask runs and resolves the inner promise, the `await` resumes (via a microtask) and logs `async end`.
