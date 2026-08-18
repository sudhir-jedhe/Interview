# Global Handlers as a Last Resort

These are not a substitute for local error handling — they're a safety net for logging/reporting errors you missed, or for cleanup before a crash.

## Browser

- `window.onerror` fires for uncaught synchronous runtime errors (and syntax errors in some cases), giving you the message, filename, line/column, and error object.
- `window.addEventListener('unhandledrejection', handler)` fires specifically for promises that reject with nobody handling them; it does not fire for synchronous throws.

## Node.js

- `process.on('uncaughtException', handler)` is the Node equivalent of `window.onerror` — a last-resort listener for synchronous exceptions that escaped all `try`/`catch` blocks.
- `process.on('unhandledRejection', handler)` is the Node equivalent of `unhandledrejection`.

The Node docs explicitly recommend using `uncaughtException` only to log and then gracefully shut down the process, because after an uncaught exception the application state may be corrupted; attempting to "resume" normal operation is unsafe. See `problems/03-global-unhandled-rejection-uncaught-exception-handlers.md` in this topic for a full worked example of wiring both handlers up with a graceful, logged exit.

## Uncaught exception vs. unhandled promise rejection

An uncaught exception is a synchronous `throw` that no `try`/`catch` intercepts, and it crashes the current execution (in Node, the process, unless a global handler intervenes). An unhandled promise rejection is a promise that settles as rejected with no `.catch()` (or second argument to `.then`) ever attached to it; it's detected asynchronously and reported separately (`unhandledrejection` event in browsers, `unhandledRejection` event in Node) rather than crashing the current stack immediately.
