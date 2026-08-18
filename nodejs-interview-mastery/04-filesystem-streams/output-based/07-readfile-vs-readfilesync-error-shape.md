# readFile vs readFileSync Error Handling Shape

```js
const fs = require('node:fs');

try {
  fs.readFile('/path/does/not/exist.txt', 'utf8', (err, data) => {
    if (err) console.log('callback error:', err.code);
  });
  console.log('after readFile call, no error thrown here');
} catch (e) {
  console.log('this catch never runs for the async call');
}

try {
  fs.readFileSync('/path/does/not/exist.txt', 'utf8');
} catch (e) {
  console.log('sync error caught:', e.code);
}
```

**Answer:** `after readFile call, no error thrown here`, `sync error caught: ENOENT`, then later (once the event loop reaches poll) `callback error: ENOENT`.

**Why:** Async `fs.readFile` never throws synchronously for I/O errors — it always reports them via the callback's first (`err`) argument, so wrapping the call itself in `try/catch` is pointless. `fs.readFileSync` throws synchronously, so a `try/catch` around it correctly catches the error immediately, and (since it's synchronous) its log line appears before the still-pending async callback fires.
