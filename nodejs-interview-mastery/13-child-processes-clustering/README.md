# Child Processes & Clustering

Node.js runs your JavaScript on a single thread, so scaling to use multiple CPU cores or running external programs both require spawning separate OS processes. This topic covers the `child_process` module (`exec`, `execFile`, `spawn`, `fork`) for running external commands and dedicated Node scripts, the `cluster` module for forking multiple worker processes that share a listening port, and `worker_threads` for true in-process threading with shared memory. We also compare `cluster` vs `worker_threads` head-to-head since interviewers love testing whether you know when to reach for which, and touch on process managers like PM2 that operationalize clustering (zero-downtime reloads, auto-restart, log management) so you don't have to hand-roll it.

## Folder guide

- **`theory/`** — core concepts, split by topic: `child_process` basics (exec/execFile/spawn/fork), the `cluster` module, `worker_threads` and shared memory, and process managers (PM2).
- **`snippets/`** — one short, runnable code example per file, each with an explanation.
- **`output-based/`** — "what does this log?" questions with answers and reasoning, one per file.
- **`scenarios/`** — real-world problems (a slow endpoint, shelling out safely, scaling across cores, sharing a huge dataset) each with a worked approach and code.
- **`interview-qa/`** — Q&A pairs grouped into themed files: fundamentals, cluster/PM2, worker_threads/shared memory, stdio/backpressure.
- **`problems/`** — practice problems with full worked solutions: a self-restarting cluster setup, offloading CPU work to a worker thread, and a concurrency-limited child-process task queue.
- **`projects/clustered-server/`** — a runnable demo: a small clustered HTTP server (`cluster.js` + `server.js`) with a README showing how to verify multiple workers are actually handling requests.
- **`assets/`** — placeholder for any images/PDFs from the original notes.

## What's covered

- `exec` vs `execFile` vs `spawn` vs `fork` — shell usage, buffering vs streaming, IPC
- Why and when to spawn child processes (shelling out, isolating CPU-heavy or untrusted work)
- The `cluster` module — master/worker model, shared port, round-robin scheduling
- `worker_threads` — shared memory via `SharedArrayBuffer`, `MessageChannel`, when threads beat processes
- Cluster vs worker_threads decision matrix
- PM2 and process managers — zero-downtime restarts, crash recovery, log aggregation

> Looking for your original notes on this? See `../../SOURCE-MAP.md`.
