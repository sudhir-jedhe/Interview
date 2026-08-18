# Interview Q&A: Profiling and Memory Diagnostics

**Q: What's the difference between `node --inspect` and `node --prof`?**

`--inspect` opens a debugging WebSocket that Chrome DevTools or VS Code can attach to live, giving you interactive breakpoints, a real-time CPU profiler you start/stop on demand, and heap snapshot tools — best for exploring a running process interactively. `--prof` writes a V8 tick log straight to disk with no live attachment required, which you post-process afterward with `node --prof-process`; it's the better fit for CI environments, headless servers, or short-lived scripts where attaching a debugger UI isn't practical.

**Q: How do you actually find a memory leak in a running Node process?**

Take a heap snapshot (via DevTools' Memory tab, or programmatically with `v8.writeHeapSnapshot()`), let the process run under representative load for a while, take a second snapshot, then use DevTools' comparison view to see which object type's retained size grew and didn't shrink back. That growing type points you toward the leak; from there you trace its retainer chain in DevTools to find what root reference (a closure, a Map, an event listener) is keeping it alive longer than intended.

**Q: What are the most common sources of memory leaks in a long-running Node server?**

Unbounded caches (a `Map`/object used as a cache with no eviction policy that grows with every unique key), growing global arrays (logging/metrics arrays pushed to on every request but never trimmed), and forgotten event listeners or timers (a listener added per-request/per-connection, or a `setInterval` whose ID is lost, that's never cleaned up). All three share the same root cause: something holds a reference longer than the object's actual useful lifetime, so V8's garbage collector can never reclaim it.

**Q: What does `process.memoryUsage()` report, and which field matters most for spotting a leak?**

It returns an object with `rss` (resident set size — total memory the process holds in physical RAM, including code and stack), `heapTotal` (V8 heap allocated), `heapUsed` (V8 heap actually in use), and `external` (memory used by C++ objects bound to JS, like Buffers). For tracking a JS-level leak over time, `heapUsed` sampled at regular intervals is usually the most direct signal — a steady upward trend that never comes back down after garbage collection runs is the classic leak fingerprint, as opposed to normal sawtooth growth-and-collection.
