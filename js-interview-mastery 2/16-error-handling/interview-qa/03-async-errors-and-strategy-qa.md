# Interview Q&A: Async Errors, Global Handlers, and Strategy

**Q: What's the difference between an uncaught exception and an unhandled promise rejection?**
An uncaught exception is a synchronous `throw` that no `try`/`catch` intercepts, and it crashes the current execution (in Node, the process, unless a global handler intervenes). An unhandled promise rejection is a promise that settles as rejected with no `.catch()` (or second argument to `.then`) ever attached to it; it's detected asynchronously and reported separately (`unhandledrejection` event in browsers, `unhandledRejection` event in Node) rather than crashing the current stack immediately.

**Q: What does `window.onerror` catch, and what does `unhandledrejection` catch?**
`window.onerror` fires for uncaught synchronous runtime errors (and syntax errors in some cases), giving you the message, filename, line/column, and error object. `unhandledrejection` fires specifically for promises that reject with nobody handling them; it does not fire for synchronous throws. Both are global safety nets for logging/monitoring, not substitutes for local error handling.

**Q: How is error handling different in Node's `process.on('uncaughtException')`?**
It's the Node equivalent of `window.onerror` — a last-resort listener for synchronous exceptions that escaped all `try`/`catch` blocks. The Node docs explicitly recommend using it only to log and then gracefully shut down the process, because after an uncaught exception the application state may be corrupted; attempting to "resume" normal operation is unsafe.

**Q: How would you make sure a chain of `.then()` calls doesn't produce unhandled rejections?**
Attach a `.catch()` at the end of the chain (or use `try`/`catch` with `await`), since a rejection in any `.then()` in the chain propagates forward to the next `.catch()` handler, skipping intermediate `.then()`s. Forgetting the trailing `.catch()` — especially on a promise chain that's fired and not returned/awaited — is the most common source of unhandled rejections.

**Q: What's the difference between fail-fast and graceful degradation, and when would you choose each?**
Fail-fast means throwing/crashing immediately when an invariant is violated, so bugs are caught early and loudly rather than silently corrupting data — appropriate for programmer errors, invalid configuration, or unrecoverable states. Graceful degradation means catching the error and falling back to a safe default so the user experience isn't blocked — appropriate for expected, recoverable failures like a flaky network call or an optional third-party widget failing to load.
