# Interview Q&A: Threading & Runtime Model

**Q: Is Node.js single-threaded?**
Your JavaScript code runs on a single thread, but Node itself is not — libuv uses OS-level async I/O (epoll/kqueue/IOCP) for network operations and a background thread pool (default 4 threads) for things like `fs` and `crypto`. "Single-threaded" refers specifically to the JS execution context; the runtime underneath is multi-threaded.

**Q: How does Node achieve non-blocking I/O with only one JS thread?**
For network/pipe I/O, the OS itself provides async notification mechanisms (epoll, kqueue, IOCP); libuv registers interest and gets notified when data is ready, then invokes your JS callback — no thread is blocked waiting. For I/O without an async OS primitive (much of `fs`, `dns.lookup`, some `crypto`), libuv delegates to a background thread pool so the main thread stays free.

**Q: What is the libuv thread pool used for, and how do you configure its size?**
It runs blocking operations that lack true async OS support: most `fs` module functions, `dns.lookup`, `crypto.pbkdf2`/`randomBytes`/`scrypt`, and `zlib` compression. Default size is 4; configurable via the `UV_THREADPOOL_SIZE` environment variable (up to 128), which must be set before the process starts since libuv reads it once at initialization.

**Q: Why does a synchronous CPU-heavy operation "block the event loop," and what's the fix?**
Because all JS callbacks — timers, I/O callbacks, HTTP request handlers — run on the same single thread, a long synchronous computation occupies that thread and nothing else can run until it returns, including accepting new connections. The fix is to move the work off the main thread using `worker_threads` (real parallel JS execution) or a separate process/service, not `Promise`/`setImmediate`, which only reorder work rather than parallelize it.
