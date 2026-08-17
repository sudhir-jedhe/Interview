# Comparisons: Asynchronous JavaScript

## `Promise.all` vs. `Promise.allSettled` vs. `Promise.race` vs. `Promise.any`

| Combinator | Resolves when | Rejects when | Result shape |
|---|---|---|---|
| `Promise.all` | All promises fulfill | First promise rejects (fail-fast) | Array of values, in input order |
| `Promise.allSettled` | Always resolves once all settle | Never rejects | Array of `{status, value\|reason}` |
| `Promise.race` | First promise to settle (fulfill or reject) | Same — adopts whichever comes first | The winning value/reason directly |
| `Promise.any` | First promise to *fulfill* | Only if *all* reject | The winning value, or `AggregateError` |

Use `Promise.all` when every result is required and any single failure should abort the whole operation; use `allSettled` when you want to know the outcome of every operation regardless of individual failures (e.g., batch uploads where partial success is acceptable). `Promise.race` is for timeouts/first-response-wins scenarios; `Promise.any` is for "try several sources, use whichever succeeds first" (e.g., hitting multiple mirrors of an API). The most common mistake is using `Promise.all` when partial failure should be tolerated — one rejected promise silently discards all the other results you already had, even the successful ones.

## Callback-Style vs. Promise-Style vs. `async`/`await`

| Aspect | Callbacks | Promises (`.then`) | `async`/`await` |
|---|---|---|---|
| Error handling | Manual, per-callback `(err, data)` checks | Centralized via `.catch()` | Standard `try`/`catch` |
| Composition (parallel/sequential) | Manual, error-prone nesting | Combinators (`Promise.all`, etc.) | Combinators + linear-looking code |
| Readability for sequential steps | Deeply nested ("callback hell") | Flatter, but chain can still get long | Reads like synchronous code |
| Return value | None (side-effect based) | A promise object | A promise (implicitly wrapped) |

`async`/`await` is generally preferred for its readability, but it's still built entirely on promises underneath — you still need `Promise.all` for genuine parallelism, and `.catch()`/`try-catch` are equivalent error-handling mechanisms, not alternatives. The common mistake is thinking `async`/`await` is a *replacement* for promises rather than sugar on top of them, leading to accidentally-sequential code when parallel execution was intended.

## `.catch()` vs. `try`/`catch` with `await`

| Aspect | `.catch()` | `try`/`catch` around `await` |
|---|---|---|
| Syntax style | Chained onto the promise | Wraps the `await` expression(s) |
| Scope of error handling | Only errors within the chain up to that point | Any synchronous or awaited error inside the `try` block |
| Mixing sync and async errors | Only catches promise rejections | Catches both a thrown synchronous error AND a rejected awaited promise, uniformly |

They're functionally equivalent for catching rejected promises, but `try`/`catch` is often preferable in `async` functions because it can also catch synchronous throws in the same block (e.g., a `JSON.parse` error alongside an `await fetch(...)` call) without needing separate handling paths. The common mistake is wrapping an `await` in `try`/`catch` but forgetting that a `.catch()` placed on a promise *before* it's awaited will swallow the rejection, causing the surrounding `try`/`catch` to never see an error at all (since the promise no longer rejects — it resolved to whatever `.catch()` returned).

## Sequential `await` in a Loop vs. `Promise.all` with `.map`

| Aspect | `for` loop with `await` inside | `Promise.all(items.map(async ...))` |
|---|---|---|
| Execution | Strictly sequential — one at a time | All started concurrently |
| Total time | Sum of all individual durations | Roughly the duration of the *slowest* one |
| Use when | Each step depends on the previous step's result, or rate-limiting is required | Steps are independent of each other |
| Error behavior | Stops at the first error (loop halts) | `Promise.all` fails fast; consider `allSettled` if partial failure is fine |

The common and costly mistake is defaulting to a `for...of` loop with `await` inside for a batch of independent async calls (e.g., fetching 20 unrelated URLs) — this makes 20 sequential round trips instead of 1 concurrent batch, needlessly multiplying total latency by 20x in the worst case.
