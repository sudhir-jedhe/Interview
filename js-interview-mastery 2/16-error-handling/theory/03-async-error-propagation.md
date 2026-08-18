# Error Propagation and Async Code

Synchronous throws propagate up the call stack and can be caught by any enclosing `try`/`catch`. Callback-based async code breaks this because the callback runs on a **later turn of the event loop**, after the original `try`/`catch` has already finished executing.

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

`await` lets you use ordinary `try`/`catch` around asynchronous code because it suspends the function until the promise settles — a rejection becomes a thrown exception at the `await` point. But a `.then()` chain or a promise created and never awaited/returned can produce an **unhandled promise rejection** if nothing attaches a `.catch()`.

```js
Promise.reject(new Error("nobody's listening"));
// logs an "Unhandled promise rejection" warning, doesn't crash Node by default in most versions,
// but browsers fire an `unhandledrejection` event on window.
```

## `try`/`catch` around sync code vs. around `await`

| Aspect | `try`/`catch` around sync throw | `try`/`catch` around `await somePromise` |
|---|---|---|
| What it catches | Synchronous exceptions on the current call stack | Rejections of the awaited promise, converted to a throw |
| Timing | Immediate | Only after the promise settles (later event loop turn) |
| Catches `setTimeout` callback throws? | No | No (unless the callback itself is wrapped) |
| Requires | Nothing special | Function must be `async`; `await` must be used, not just calling the async function |

The common mistake is assuming `try`/`catch` around a function *call* automatically protects against errors that occur inside a `setTimeout`, event handler, or unawaited promise fired from within that function — it does not, because those run outside the synchronous stack frame the `try` is watching.

## Ensuring a `.then()` chain doesn't produce unhandled rejections

Attach a `.catch()` at the end of the chain (or use `try`/`catch` with `await`), since a rejection in any `.then()` in the chain propagates forward to the next `.catch()` handler, skipping intermediate `.then()`s. Forgetting the trailing `.catch()` — especially on a promise chain that's fired and not returned/awaited — is the most common source of unhandled rejections.
