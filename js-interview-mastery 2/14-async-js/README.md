# Asynchronous JavaScript

Async JS is how JavaScript handles operations that don't complete immediately — network requests, timers, file I/O — without blocking the single-threaded call stack. This topic traces the evolution from callback-based async (and the "callback hell" it produces) to Promises (a formal, chainable representation of an eventual value) to `async`/`await` (syntax sugar that makes promise-based code read like synchronous code). It covers the exact rejection/resolution semantics of `Promise.all`, `allSettled`, `race`, and `any` — a frequent interview differentiator — along with the classic sequential-vs-parallel `await` bug that quietly kills performance in real codebases.

## What's covered
- Callback-based async and "callback hell"
- Promise states (pending/fulfilled/rejected) and immutability once settled
- `.then`/`.catch`/`.finally` chaining and error propagation through a chain
- `Promise.all` vs. `allSettled` vs. `race` vs. `any` — exact rejection behavior for each
- `async`/`await` as sugar over promises
- `try`/`catch` with `await`
- Sequential vs. parallel `await` — the common loop-awaiting bug vs. `Promise.all`
- Converting a callback-based API into a promise-based one

## Folder structure
- `theory/` — concept-split reference notes (callbacks, promise fundamentals, combinators, async/await, sequential vs. parallel, promisifying)
- `snippets/` — one focused runnable snippet per file
- `output-based/` — one "predict the output" question per file, with the answer and reasoning
- `scenarios/` — one real-world design scenario per file, with a worked approach
- `interview-qa/` — quickfire Q&A grouped by theme
- `problems/` — hands-on "implement X" challenges with full solutions (`myPromiseAll`/`myPromiseRace`/`myPromiseAllSettled` from scratch, `promisify`, retry with backoff)
- `projects/async-task-queue/` — a runnable Promise-based task queue with a concurrency limit, plus a demo and sanity checks
- `assets/` — placeholder for images/PDFs from your original notes
- `from-your-notes/` — your original standalone notes, untouched

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
