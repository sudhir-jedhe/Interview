# Interview Q&A: Promise Fundamentals

**Q: What are the three states of a Promise, and can a promise change state after settling?**
Pending, fulfilled, and rejected. A promise starts pending and can transition to fulfilled or rejected exactly once — once settled, its state and value are permanently locked; calling `resolve`/`reject` again afterward has no effect.

**Q: How does error propagation work in a `.then()` chain?**
A thrown error (or a rejected promise) at any point in the chain skips over all subsequent `.then()` success handlers and jumps straight to the nearest downstream `.catch()`. If that `.catch()` handles the error without re-throwing, the chain is considered "recovered" and continues normally into any further `.then()` calls after it.

**Q: What does `.finally()` do, and does it receive the resolved value or rejection reason?**
`.finally()` runs a callback regardless of whether the promise fulfilled or rejected, useful for cleanup logic (like hiding a loading spinner) that should happen either way. Its callback receives no arguments at all — it can't inspect the value or reason — and by default it passes through whatever the promise before it resolved/rejected with, unchanged (unless the `.finally` callback itself throws or returns a rejected promise).

**Q: If an `async` function has no explicit `return` statement, what does calling it return?**
It still returns a Promise — specifically, a promise that resolves to `undefined`, since `async` functions always wrap their return value (or lack thereof) in a promise automatically.

**Q: What's the difference between a synchronous `throw` inside a regular function versus inside an `async` function?**
Inside a regular (non-async) function, `throw` propagates as an actual synchronous exception that must be caught by a surrounding `try`/`catch` in the same call stack, or it crashes the program. Inside an `async` function, a `throw` is automatically converted into a *rejected promise* — it never propagates synchronously to the caller; the caller must use `.catch()` or `await` it inside a `try`/`catch` to observe the failure.

**Q: Why does `Promise.resolve(x).then(cb)` run `cb` asynchronously even though `x` is already available synchronously?**
Because the Promise spec guarantees `.then()` callbacks are *always* scheduled as microtasks, never invoked synchronously, regardless of whether the promise was already settled at the time `.then()` was called. This consistency prevents "sometimes sync, sometimes async" bugs that would otherwise depend on timing.
