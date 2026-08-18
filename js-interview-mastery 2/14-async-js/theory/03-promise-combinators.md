# `Promise.all`, `allSettled`, `race`, `any`

These four combinators handle multiple promises at once, with distinct rejection semantics — this is one of the most commonly tested async topics.

- **`Promise.all(promises)`** — resolves with an array of all values, in order, only if *every* promise fulfills. Rejects immediately with the *first* rejection reason it sees ("fail fast"), even if other promises haven't settled yet.
- **`Promise.allSettled(promises)`** — always resolves (never rejects), with an array of `{ status, value }` or `{ status, reason }` objects describing every promise's outcome. Use this when you want results from everything regardless of individual failures.
- **`Promise.race(promises)`** — settles (fulfills or rejects) as soon as the *first* promise settles, adopting whichever outcome (success or failure) happens first.
- **`Promise.any(promises)`** — resolves with the first *fulfillment*; ignores rejections unless *all* promises reject, in which case it rejects with an `AggregateError` containing all the individual errors.

## Comparison table

| Combinator | Resolves when | Rejects when | Result shape |
|---|---|---|---|
| `Promise.all` | All promises fulfill | First promise rejects (fail-fast) | Array of values, in input order |
| `Promise.allSettled` | Always resolves once all settle | Never rejects | Array of `{status, value\|reason}` |
| `Promise.race` | First promise to settle (fulfill or reject) | Same — adopts whichever comes first | The winning value/reason directly |
| `Promise.any` | First promise to *fulfill* | Only if *all* reject | The winning value, or `AggregateError` |

## When to use which

Use `Promise.all` when every result is required and any single failure should abort the whole operation; use `allSettled` when you want to know the outcome of every operation regardless of individual failures (e.g., batch uploads where partial success is acceptable). `Promise.race` is for timeouts/first-response-wins scenarios; `Promise.any` is for "try several sources, use whichever succeeds first" (e.g., hitting multiple mirrors of an API). The most common mistake is using `Promise.all` when partial failure should be tolerated — one rejected promise silently discards all the other results you already had, even the successful ones.

See `problems/01-promise-all-race-allsettled-from-scratch.md` in this topic for hand-rolled implementations of `all`, `race`, and `allSettled` using only the `Promise` constructor — a very common interview follow-up.
