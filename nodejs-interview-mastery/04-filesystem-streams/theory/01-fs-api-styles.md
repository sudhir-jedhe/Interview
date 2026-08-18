# Three Flavors of the fs API

Node's `fs` module exposes the same operations three ways:

```js
const fs = require('node:fs');

// 1. Synchronous — blocks the entire event loop until the OS call returns
const dataSync = fs.readFileSync('./file.txt', 'utf8');

// 2. Callback-based async — non-blocking, error-first callback
fs.readFile('./file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 3. Promise-based — non-blocking, awaitable
const fsp = require('node:fs/promises');
const dataAsync = await fsp.readFile('./file.txt', 'utf8');
```

`readFileSync` blocks the single JS thread for the entire duration of the disk read — fine for one-off CLI scripts or startup-time config loading, but catastrophic in an HTTP server, where it would stall every in-flight request until the read completes. The callback and Promise forms delegate the actual I/O to libuv's thread pool (since `fs` lacks a true async OS primitive on most platforms) and invoke your callback once the operation completes, without blocking the main thread. Prefer `fs/promises` in modern code for cleaner `async/await` composition; use the callback API only in performance-critical hot paths where Promise allocation overhead has been measured to matter (rare).

## Comparison

| Aspect | fs.readFileSync | fs.readFile (callback) | fs.promises.readFile |
|---|---|---|---|
| Blocks the event loop | Yes, for the entire read | No | No |
| Error handling | Throws synchronously — wrap in `try/catch` | Error-first callback (`err` as first arg) | Rejects the returned Promise — use `try/catch` with `await` |
| Underlying mechanism | Direct blocking syscall on the main thread | Delegated to libuv thread pool, callback invoked on completion | Same thread pool delegation, wrapped in a Promise |
| Best for | One-off CLI scripts, startup-time config loading before the server starts accepting traffic | Legacy codebases, performance-critical hot paths where Promise allocation overhead was actually measured to matter | Modern application code — composes cleanly with `async/await` |

Use `readFileSync` only when nothing else is happening concurrently that the block would harm. Never use it inside a request handler. Use `fs.promises.readFile` as the default in modern code; fall back to the callback form only for legacy compatibility. The common mistake is reaching for `readFileSync` "because it's simpler" inside code that runs per-request, which serializes every concurrent request behind each disk read and turns a fast server into one that can only handle one I/O-bound request at a time.

## Error handling shape differs by API style

Async `fs.readFile` never throws synchronously for I/O errors — it always reports them via the callback's first (`err`) argument, so wrapping the call itself in `try/catch` is pointless. `fs.readFileSync` throws synchronously, so a `try/catch` around it correctly catches the error immediately:

```js
try {
  fs.readFile('/does/not/exist.txt', 'utf8', (err, data) => {
    if (err) console.log('callback error:', err.code); // this is how async errors surface
  });
} catch (e) {
  // never reached for the async call above
}

try {
  fs.readFileSync('/does/not/exist.txt', 'utf8');
} catch (e) {
  console.log('sync error caught:', e.code); // ENOENT
}
```
