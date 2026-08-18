# try/catch does NOT catch errors thrown asynchronously in a callback

```js
try {
  setTimeout(() => {
    throw new Error("async boom");
  }, 0);
  console.log("try block finished");
} catch (e) {
  console.log("this never logs");
}
// logs: "try block finished"
// then, later: Uncaught Error: async boom (outside any catch)
```

The `setTimeout` callback runs on a later event loop turn, well after the `try`/`catch` block has already finished executing and been popped off the call stack, so `catch` never gets a chance to intercept it.
