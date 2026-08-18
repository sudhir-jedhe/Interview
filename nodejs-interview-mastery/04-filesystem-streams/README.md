# Filesystem & Streams

Node's `fs` module offers three API styles — synchronous, callback-based async, and Promise-based — and choosing the wrong one in a server context can silently block every concurrent request. Streams are the complementary abstraction: instead of loading an entire file (or response body) into memory, you process data in chunks as it arrives, which is essential for large files, network responses, and pipelines that transform data on the fly. This topic covers the four stream types, why `pipeline()` from `stream/promises` should replace raw `.pipe()` chains for production code, and the backpressure mechanism that keeps memory bounded when a writable destination can't keep up with a readable source.

> Looking for your original flat notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — core concepts, split by subject:
  - `01-fs-api-styles.md` — sync/callback/Promise `fs` APIs, when to use each, error handling shape
  - `02-why-streams-exist.md` — memory/latency motivation, consuming streams via `for await`
  - `03-stream-types-and-pipeline.md` — Readable/Writable/Duplex/Transform, `.pipe()` vs `pipeline()`, `'finish'` vs `'end'`
  - `04-backpressure.md` — what backpressure is, `highWaterMark`, manual vs automatic handling
  - `05-watching-files.md` — `fs.watch`, platform caveats, `chokidar`
  - `06-atomic-writes.md` — write-to-temp-then-rename for crash-safe writes
- **`snippets/`** — 7 runnable code snippets, one per file (three ways to read a file, streaming to an HTTP response, gzip with `pipeline()`, a custom uppercase Transform, manual backpressure handling, `readline` line counting, async iteration over a Readable)
- **`output-based/`** — 8 "predict the output" questions with full traces (sync-blocks-timer, async callback ordering, raw `.pipe()` error-cleanup gap, the same case fixed with `pipeline()`, ignored backpressure, `for await` respecting backpressure, `readFile` vs `readFileSync` error shape, `'finish'` vs `'end'`)
- **`scenarios/`** — 4 real-world scenarios (streaming a 10GB CSV without OOM, upload progress reporting, tailing a log file like `tail -f`, atomic config writes)
- **`interview-qa/`** — 12 Q&A pairs grouped into 4 themed files: fs API basics, why streams & stream types, pipe/pipeline & backpressure, and consuming streams & watching files
- **`problems/`** — 4 hands-on coding challenges: a file-copy utility with progress reporting, a custom UTF-8-safe uppercase Transform, a line-by-line file reader (callback and async-generator variants), and a naive `cat` CLI
- **`projects/log-tailer/`** — a complete runnable `tail -f`-style CLI (`index.js` + `package.json` with a `bin` entry + its own `README.md`) built on `fs.watch` and streams
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`)

## What's covered

- `fs.readFileSync` vs `fs.readFile` vs `fs.promises.readFile`, and why sync APIs are dangerous in servers
- The four stream types: Readable, Writable, Duplex, Transform
- Why streams matter for memory efficiency with large files/payloads
- `.pipe()` and its error-handling gaps vs `pipeline()` from `stream/promises`
- Backpressure: what it is, how it's signaled, and what happens if you ignore it
- Practical patterns for reading, writing, and transforming data as streams
- Watching files for changes with `fs.watch`, and writing files atomically
