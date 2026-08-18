# Interview Q&A: Promises, Timers, and Rendering

**Q: Why does `setTimeout(fn, 0)` not run `fn` immediately?**
Because `setTimeout` callbacks are macrotasks, and a macrotask can only run once the call stack is empty AND the entire microtask queue has been drained. Even with a 0ms delay, the callback still has to wait its turn behind any remaining synchronous code and every pending microtask.

**Q: Does the executor function passed to `new Promise((resolve, reject) => {...})` run synchronously or asynchronously?**
Synchronously — it runs immediately, inline, at the moment the `Promise` constructor is called, before the constructor even returns. Only code registered via `.then()`/`.catch()`/`.finally()` (or an `await`) is deferred; the setup code inside the executor is not.

**Q: If you have a `setTimeout(fn, 0)` and a `Promise.resolve().then(fn2)` both scheduled in the same synchronous block, which runs first, and why?**
`fn2` always runs first. It's queued as a microtask, and the entire microtask queue is guaranteed to drain completely before the event loop proceeds to the next macrotask (the `setTimeout` callback), regardless of the specified delay or the order in which they were scheduled in the code.

**Q: Why might chaining many `.then()` calls be worse for UI responsiveness than using `setTimeout` in between, even though microtasks run "sooner"?**
Because microtasks never yield to the browser's rendering step — the browser only gets a chance to paint or process input *after* the microtask queue is fully empty. A long or continuously-replenished chain of microtasks can starve rendering entirely, causing visible jank, whereas `setTimeout` (a macrotask) genuinely yields control back to the event loop, letting the browser render and handle input between each scheduled step.
