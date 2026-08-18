# Async Error Handling

Node.js is built around asynchronous I/O, and getting error handling wrong in async code is one of the most common sources of production incidents — silently swallowed errors, unhandled promise rejections that crash the process, or requests that hang forever because an error was thrown but never caught. This topic covers the evolution from error-first callbacks to promises to async/await, the classic Express bug where a thrown error inside an async handler doesn't reach your error middleware, and the process-level safety nets (`unhandledRejection`, `uncaughtException`) you need to understand even if you rarely rely on them directly. Getting this right is what separates an API that fails loudly and recoverably from one that hangs, leaks, or crashes under load.

## Folder structure

```
10-async-error-handling/
  theory/          Core concepts, one focused file per topic
  snippets/         Standalone, runnable code snippets with explanations
  output-based/     "What does this code print/return?" questions with answers
  scenarios/         Real-world problem scenarios with worked approaches
  interview-qa/     Themed Q&A pairs for verbal interview prep
  problems/          Practice problems with full worked solutions
  assets/            Images/PDFs from original notes (placeholder)
```

## theory/
1. `01-error-first-callbacks-and-promisify.md` — The `(err, data)` convention, `util.promisify`, callbacks vs promises vs async/await
2. `02-express-async-handler-bug.md` — Why Express 4 doesn't catch async throws, and the fixes
3. `03-process-level-safety-nets.md` — `unhandledRejection`, `uncaughtException`, why you don't resume after either
4. `04-centralized-error-middleware-and-custom-errors.md` — Error middleware arity, `ApiError` hierarchies
5. `05-batch-operations-and-cleanup-pitfalls.md` — `Promise.all` vs `Promise.allSettled`, the `finally`-overrides-error trap

## snippets/
Seven standalone code snippets: promisifying `dns.lookup`, a custom `ApiError` class, the `asyncHandler` wrapper, centralized error middleware, manual promise-wrapping for a stream-based API, process-level safety nets, and retry-with-exponential-backoff.

## output-based/
Seven "what does this print?" questions covering the hanging async route bug, sync vs async throws inside try/catch, the ordering of `unhandledRejection` vs `uncaughtException`, `asyncHandler` catching a rejection, calling `next()` after a response is sent, `promisify` with a non-error-first callback, and a `finally` block overriding the original error.

## scenarios/
Four real-world scenarios with worked approaches: diagnosing hanging Express 4 requests, fixing a batch job that dies on one bad record, standardizing async error handling across a team, and recovering visibility into silent production crashes.

## interview-qa/
Eleven Q&A pairs grouped into three themed files: callbacks/promises/async-await, Express error handling, and process safety nets & custom error classes.

## problems/
Three practice problems with full worked solutions: implementing a `catchAsync` wrapper from scratch (and showing what breaks without it), building a retry-with-exponential-backoff utility, and implementing `util.promisify` from scratch.

> No `projects/` folder for this topic — see the task scope in the parent README for which topics include a full project.
