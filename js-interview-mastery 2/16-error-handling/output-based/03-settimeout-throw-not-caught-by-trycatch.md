```js
try {
  setTimeout(() => { throw new Error("late"); }, 0);
} catch (e) {
  console.log("caught");
}
console.log("after try");
```
**Answer:**
```
after try
Uncaught Error: late
```
**Why:** The `setTimeout` callback runs on a later event loop tick, long after the synchronous `try`/`catch` has already exited. `catch` can only intercept errors thrown synchronously while the `try` block is executing on the call stack, so "caught" never logs and the error surfaces as uncaught.
