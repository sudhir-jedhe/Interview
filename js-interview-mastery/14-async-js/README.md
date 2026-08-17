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

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
