# Notes: Error Handling

## try/catch/finally mechanics

`try` runs a block of code, `catch` runs if that block throws, and `finally` runs regardless of whether an error was thrown, caught, or even if the `try` or `catch` block returns early.

```js
function test() {
  try {
    return "from try";
  } finally {
    console.log("finally runs");
  }
}
console.log(test());
// logs: "finally runs"
// logs: "from try"
```

The `finally` block runs *before* the function actually returns, even though `try` already hit a `return` statement. This matters more than people expect: if `finally` itself contains a `return`, it **overrides** the value from `try` or `catch`, which is a common source of bugs.

```js
function trap() {
  try {
    return 1;
  } finally {
    return 2; // silently discards the "return 1"
  }
}
trap(); // 2
```

`finally` also runs when an error propagates out uncaught (there's no `catch`), right before the error continues up the call stack. Only things like `process.exit()` or an infinite loop inside `try` will prevent it from running.

## Custom Error subclasses

Plain `throw "something broke"` works but loses useful metadata. The convention is to throw `Error` instances (or subclasses), because they carry `message`, `name`, and `stack`.

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError"; // otherwise defaults to "Error"
    this.field = field;
    // Error.captureStackTrace(this, ValidationError) // V8-only, cleans the stack
  }
}

try {
  throw new ValidationError("Age must be positive", "age");
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.name, err.message, err.field);
    // "ValidationError" "Age must be positive" "age"
  }
}
```

Key gotcha: `err.name` is just a string property, not a distinct type. Use `instanceof` to branch on error type, not string comparisons on `name`, since `name` can be reassigned or spoofed.

`err.stack` is a non-standard but universally implemented string with the message plus a call-stack trace. It's for humans/logging, not for parsing programmatically — its format differs between engines.

## Error propagation and async code

Synchronous throws propagate up the call stack and can be caught by any enclosing `try/catch`. Callback-based async code breaks this because the callback runs on a **later turn of the event loop**, after the original `try/catch` has already finished executing.

```js
try {
  setTimeout(() => {
    throw new Error("boom"); // NOT caught below
  }, 0);
} catch (e) {
  console.log("caught:", e.message); // never runs
}
// The thrown error instead surfaces as an uncaught exception.
```

The fix is to handle the error *inside* the callback, or use promises, which have their own error channel (rejection) that survives the async gap:

```js
async function loadData() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log("handled:", err.message);
  }
}
```

`await` lets you use ordinary `try/catch` around asynchronous code because it suspends the function until the promise settles — a rejection becomes a thrown exception at the `await` point. But a `.then()` chain or a promise created and never awaited/returned can produce an **unhandled promise rejection** if nothing attaches a `.catch()`.

```js
Promise.reject(new Error("nobody's listening"));
// logs an "Unhandled promise rejection" warning, doesn't crash Node by default in most versions,
// but browsers fire an `unhandledrejection` event on window.
```

## Global handlers as a last resort

These are not a substitute for local error handling — they're a safety net for logging/reporting errors you missed, or for cleanup before a crash:

- Browser: `window.onerror` catches uncaught synchronous errors; `window.addEventListener('unhandledrejection', handler)` catches promise rejections nothing else caught.
- Node: `process.on('uncaughtException', handler)` and `process.on('unhandledRejection', handler)` serve the same purpose. Using them to keep the process alive after a genuinely corrupt state is discouraged — usually you log and exit.

## Fail-fast vs. graceful degradation

Fail-fast means throwing immediately when an invariant is violated (e.g., invalid config at startup) so bugs surface loudly and early, rather than corrupting data silently. Graceful degradation means catching an error and falling back to a safe default (e.g., render cached data if a network call fails) so the user isn't blocked by a non-critical failure. The right choice depends on blast radius: fail fast for programmer errors and unrecoverable state, degrade gracefully for expected, recoverable failures like a flaky network request.
