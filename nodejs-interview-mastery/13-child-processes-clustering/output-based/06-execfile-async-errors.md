# Output-Based: `execFile()` errors are async, not throwable

```js
const { execFile } = require('child_process');
try {
  execFile('nonexistent-binary', (err) => {
    console.log('callback err:', !!err);
  });
  console.log('after execFile call');
} catch (e) {
  console.log('caught synchronously');
}
```

**Answer:** `after execFile call`, then `callback err: true`. `caught synchronously` never prints.

**Why:** Spawn errors (like "command not found") are asynchronous — Node can't know the binary is missing until it actually tries to launch it, which happens off the main thread's synchronous execution. The error is delivered to the callback, not thrown, so wrapping the call in `try/catch` does nothing useful here.
