# Performance & Debugging

Node's single-threaded event loop makes it exceptionally good at I/O-bound concurrency and exceptionally fragile against a single slow synchronous operation, which can stall every in-flight request at once. This topic covers how to profile a Node process with `--inspect` and Chrome DevTools (or `node --prof`), how to find memory leaks using heap snapshots and recognize the common leak sources in long-running servers (unbounded caches, growing arrays, forgotten listeners/timers), and walks through a concrete example of the event loop getting blocked and why that's uniquely dangerous compared to other runtimes. We tie this back to clustering and worker threads (topic 13) as the actual fix for CPU-bound blocking, and close with production-facing concerns: structured logging, log levels, and health check endpoints.

## Folder guide

- **`theory/`** — core concepts, split by topic: profiling (`--inspect`/`--prof`), memory leaks and heap snapshots, blocking the event loop (and fixing it), structured logging, and health check endpoints.
- **`snippets/`** — one short, runnable code example per file, each with an explanation.
- **`output-based/`** — "what does this log?" questions with answers and reasoning, one per file.
- **`scenarios/`** — real-world problems (a slow memory leak, one operation stalling everything, diagnosing a slow endpoint without a live debugger, unstructured logs, cascading health-check restarts) each with a worked approach and code.
- **`interview-qa/`** — Q&A pairs grouped into themed files: profiling/memory diagnostics, event loop/blocking, logging/leaks/health checks.
- **`problems/`** — practice problems with full worked solutions: an event-loop-blocking demo fixed with `worker_threads`, a minimal structured JSON logger, and a health-check endpoint reporting uptime/memory/event-loop lag.
- **`assets/`** — placeholder for any images/PDFs from the original notes.

## What's covered

- Profiling with `--inspect` + Chrome DevTools, and CPU profiling with `--prof`
- Finding memory leaks — heap snapshots and comparing them over time
- Common leak sources in long-running servers: unbounded caches, growing globals, forgotten listeners/timers
- Blocking the event loop — a concrete worked example and why it stalls *everything*
- Clustering / worker_threads as the fix for CPU-bound blocking (cross-references topic 13)
- Structured logging, log levels, and why `console.log` doesn't scale to production
- Health check endpoints — what they should (and shouldn't) check

> Looking for your original notes on this? See `../../SOURCE-MAP.md`.
