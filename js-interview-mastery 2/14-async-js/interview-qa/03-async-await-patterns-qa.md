# Interview Q&A: async/await Patterns

**Q: Is `async`/`await` a replacement for Promises?**
No — it's syntax sugar built directly on top of Promises. An `async` function always returns a promise, and `await` internally works by attaching a `.then` handler and pausing. You still need promise combinators like `Promise.all` to run things concurrently; `async`/`await` alone, used naively in a loop, produces sequential execution.

**Q: What happens if you `await` inside a `for` loop over an array of independent async calls?**
Each iteration blocks on the previous one finishing before starting the next, running all the async operations strictly sequentially even though they don't depend on each other — this is a common performance bug. The fix, when the operations are independent, is to start them all first (e.g., via `.map` without awaiting inside it) and then `await Promise.all(...)` on the resulting array of promises.

**Q: What is "callback hell" and what specifically about Promises fixes it?**
Callback hell is the deeply nested pyramid structure that results from chaining dependent async operations via nested callbacks, each needing its own error handling. Promises fix this by making `.then()` chains flat rather than nested (each `.then` returns a new promise you chain off of, not nest inside), and by centralizing error handling in one `.catch()` instead of repeating error checks at every level.
