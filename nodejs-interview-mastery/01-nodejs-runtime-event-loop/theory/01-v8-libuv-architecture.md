# V8, libuv, and the Threading Model

Node.js is V8 (Chrome's JS engine) embedded in a C program that links against **libuv**, a C library providing an event loop, async file/network I/O, and a thread pool. V8 itself has no concept of I/O — it just executes JavaScript synchronously on the thread it's given. Everything you think of as "Node's async magic" (timers, `fs`, `net`, `dns`) is libuv scheduling work and invoking JS callbacks when that work completes.

Your JavaScript runs on **one thread**. Node is single-threaded for *your code*, but multi-threaded under the hood via libuv's thread pool and OS-level async I/O (epoll/kqueue/IOCP).

## Non-blocking I/O on one thread

For network sockets, pipes, and TTYs, Node relies on the OS's async I/O facilities (epoll on Linux, kqueue on macOS, IOCP on Windows) — no extra threads needed; the OS notifies libuv when data is ready, and libuv invokes your callback on the main thread.

For APIs that have no true async OS primitive — most of the `fs` module, `dns.lookup`, `crypto.pbkdf2`, `zlib` — libuv uses a **thread pool** (default size 4) to run the blocking work off the main thread and deliver the result back via the event loop.

## Thread pool work vs main-thread (event loop) work

| Aspect | libuv thread pool | Main JS thread (event loop) |
|---|---|---|
| Runs | `fs` (most ops), `dns.lookup`, `crypto.pbkdf2`/`randomBytes`, `zlib` | All your JS callbacks, timers, Promise resolution |
| Default concurrency | 4 (`UV_THREADPOOL_SIZE`) | 1 |
| Blocked by | Nothing in your JS — it's separate OS threads | Any synchronous CPU-heavy JS |
| Tunable | Yes, via `UV_THREADPOOL_SIZE` (max 128) | No — always one thread (use `worker_threads` for more) |

Increase `UV_THREADPOOL_SIZE` when you have many concurrent `fs`/`crypto`/`dns.lookup` calls queuing up; it does nothing for CPU-bound JS logic, which always runs on the single main thread. A common mistake is bumping thread pool size to "fix" slow request handling caused by synchronous JS loops — that requires `worker_threads`, not a bigger pool.

## UV_THREADPOOL_SIZE

Set via environment variable before Node starts (`UV_THREADPOOL_SIZE=8 node app.js`), default 4, max 128. If you have many concurrent `fs` or `crypto` calls, they queue behind the pool size — increasing it can relieve that bottleneck, but it doesn't help CPU-bound JS since that runs on the main thread, not the pool. It must be set before the process starts (or at the very top of the entry file before requiring anything that touches libuv), since libuv reads it once at initialization.

```bash
UV_THREADPOOL_SIZE=8 node app.js
```

```js
// demonstrating the thread pool with concurrent fs/crypto calls
const crypto = require('crypto');

console.time('4 pbkdf2 calls');
let done = 0;
for (let i = 0; i < 4; i++) {
  crypto.pbkdf2('secret', 'salt', 100000, 64, 'sha512', () => {
    if (++done === 4) console.timeEnd('4 pbkdf2 calls');
  });
}
// With default UV_THREADPOOL_SIZE=4 these run in parallel;
// a 5th concurrent call would queue behind these.
```
