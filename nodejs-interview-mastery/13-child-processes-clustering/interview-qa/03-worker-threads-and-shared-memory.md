# Interview Q&A: worker_threads and Shared Memory

**Q: What is `worker_threads` and how is it different from `cluster`?**

`worker_threads` runs additional JS execution contexts as threads inside the *same* process, as opposed to `cluster`'s separate OS processes. Threads can share memory directly through `SharedArrayBuffer`, avoiding the serialization and IPC overhead of message passing, and have lower per-unit overhead than full processes — making them well-suited to CPU-bound computation rather than to scaling a network server across cores.

**Q: What is a `SharedArrayBuffer` and why does it matter for `worker_threads`?**

It's a fixed-length binary buffer that multiple threads (main thread + workers) can read and write directly, without copying — changes made on one thread are immediately visible on another once you're accessing the shared memory. This is what makes `worker_threads` meaningfully different from `cluster`, where processes have entirely separate memory and can only communicate by passing (copied/serialized) messages.

**Q: Why would you avoid using `cluster` to parallelize a single CPU-heavy computation?**

Each `cluster` worker is a full OS process with its own memory space, module cache, and startup cost — heavyweight for what is really just "run this function on 4 cores." `worker_threads` accomplishes the same parallel CPU work with lower overhead and, critically, the ability to share the input/output data via `SharedArrayBuffer` instead of copying it into each process.
