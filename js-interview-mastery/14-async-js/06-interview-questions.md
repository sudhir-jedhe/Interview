# Interview Questions: Asynchronous JavaScript

**Q: What are the three states of a Promise, and can a promise change state after settling?**
Pending, fulfilled, and rejected. A promise starts pending and can transition to fulfilled or rejected exactly once — once settled, its state and value are permanently locked; calling `resolve`/`reject` again afterward has no effect.

**Q: What's the difference between `Promise.all` and `Promise.allSettled`?**
`Promise.all` resolves with an array of values only if every input promise fulfills, and rejects immediately with the first rejection it encounters, discarding all other results. `Promise.allSettled` always resolves (never rejects) once every promise has settled, returning an array describing each outcome individually (`{status: 'fulfilled', value}` or `{status: 'rejected', reason}`), so partial failures don't erase successful results.

**Q: What's the difference between `Promise.race` and `Promise.any`?**
`Promise.race` settles with whichever promise settles first, whether it fulfills or rejects — a fast rejection "wins" the race and causes `race` to reject. `Promise.any` specifically waits for the first *fulfillment*, ignoring rejections along the way, and only rejects if every single promise rejects (with an `AggregateError` collecting all the reasons).

**Q: Is `async`/`await` a replacement for Promises?**
No — it's syntax sugar built directly on top of Promises. An `async` function always returns a promise, and `await` internally works by attaching a `.then` handler and pausing. You still need promise combinators like `Promise.all` to run things concurrently; `async`/`await` alone, used naively in a loop, produces sequential execution.

**Q: What happens if you `await` inside a `for` loop over an array of independent async calls?**
Each iteration blocks on the previous one finishing before starting the next, running all the async operations strictly sequentially even though they don't depend on each other — this is a common performance bug. The fix, when the operations are independent, is to start them all first (e.g., via `.map` without awaiting inside it) and then `await Promise.all(...)` on the resulting array of promises.

**Q: How does error propagation work in a `.then()` chain?**
A thrown error (or a rejected promise) at any point in the chain skips over all subsequent `.then()` success handlers and jumps straight to the nearest downstream `.catch()`. If that `.catch()` handles the error without re-throwing, the chain is considered "recovered" and continues normally into any further `.then()` calls after it.

**Q: What does `.finally()` do, and does it receive the resolved value or rejection reason?**
`.finally()` runs a callback regardless of whether the promise fulfilled or rejected, useful for cleanup logic (like hiding a loading spinner) that should happen either way. Its callback receives no arguments at all — it can't inspect the value or reason — and by default it passes through whatever the promise before it resolved/rejected with, unchanged (unless the `.finally` callback itself throws or returns a rejected promise).

**Q: What is "callback hell" and what specifically about Promises fixes it?**
Callback hell is the deeply nested pyramid structure that results from chaining dependent async operations via nested callbacks, each needing its own error handling. Promises fix this by making `.then()` chains flat rather than nested (each `.then` returns a new promise you chain off of, not nest inside), and by centralizing error handling in one `.catch()` instead of repeating error checks at every level.

**Q: If an `async` function has no explicit `return` statement, what does calling it return?**
It still returns a Promise — specifically, a promise that resolves to `undefined`, since `async` functions always wrap their return value (or lack thereof) in a promise automatically.

**Q: What's the difference between a synchronous `throw` inside a regular function versus inside an `async` function?**
Inside a regular (non-async) function, `throw` propagates as an actual synchronous exception that must be caught by a surrounding `try`/`catch` in the same call stack, or it crashes the program. Inside an `async` function, a `throw` is automatically converted into a *rejected promise* — it never propagates synchronously to the caller; the caller must use `.catch()` or `await` it inside a `try`/`catch` to observe the failure.

**Q: How would you implement a timeout for a promise that might never resolve (e.g., a hung network request)?**
Race it against a promise that rejects after a timer: `Promise.race([fetchPromise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))])`. Whichever settles first — the real fetch or the timeout — determines the outcome; note this doesn't cancel the underlying request (use `AbortController` for that), it just stops waiting for it.

**Q: Why does `Promise.resolve(x).then(cb)` run `cb` asynchronously even though `x` is already available synchronously?**
Because the Promise spec guarantees `.then()` callbacks are *always* scheduled as microtasks, never invoked synchronously, regardless of whether the promise was already settled at the time `.then()` was called. This consistency prevents "sometimes sync, sometimes async" bugs that would otherwise depend on timing.
