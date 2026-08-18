# Interview Q&A: Callbacks, Promises, and async/await

**Q: What is the error-first callback convention, and why does Node use it?**
The convention is that a callback's first parameter is reserved for an error (`null` if none occurred) and subsequent parameters carry the result: `fn(err, data)`. Node uses it because a callback fires asynchronously, after the code that invoked it has already returned — a `throw` inside the callback can't be caught by a `try/catch` wrapped around the original call, so the error has to be passed as a value instead.

**Q: How do you convert a callback-based function into one that returns a promise?**
Use `util.promisify` for functions that already follow the error-first convention: `const readFileAsync = util.promisify(fs.readFile)`. For functions that don't follow that convention (multiple callback invocations, non-standard argument order), wrap manually: `new Promise((resolve, reject) => { fn((err, data) => err ? reject(err) : resolve(data)) })`.

**Q: Why is `try { ... } catch (err) { ... }` around an `await` different from wrapping a `.then()` chain in try/catch?**
`try/catch` only catches a promise rejection if the `await` for that promise is textually inside the `try` block — if you kick off an async call without `await`-ing it inside the try, its rejection escapes untouched and becomes an unhandled rejection. A `.then().catch()` chain, by contrast, explicitly attaches error handling to the specific promise regardless of surrounding sync code structure. Both are correct when used properly; the common bug is forgetting `await` and assuming the surrounding try/catch will still catch the later rejection.

**Q: `Promise.all` vs `Promise.allSettled` — which would you use for processing a batch job, and why?**
`Promise.all` rejects as soon as any single promise rejects, discarding the results/status of every other item in the batch — fine when you genuinely want "all-or-nothing" semantics. `Promise.allSettled` waits for every promise to settle and returns an array of `{status, value|reason}` for each, which is what you want for batch/background jobs where one bad record shouldn't abort processing of the rest — you can inspect the settled results and retry only the failed items.
