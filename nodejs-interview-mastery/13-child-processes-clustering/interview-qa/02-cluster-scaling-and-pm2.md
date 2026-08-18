# Interview Q&A: Cluster, Scaling, and Process Managers

**Q: How does `cluster` let multiple processes share one port?**

The primary process opens the listening socket and hands off (or, on most platforms, round-robins) incoming connections to worker processes, each of which believes it's independently listening on that port. Under the hood this uses OS-level socket handle passing via IPC — workers don't each bind their own separate socket.

**Q: Does `cluster` automatically restart a worker that crashes?**

No. `cluster.fork()` returns a worker whose `exit` event you must listen for yourself and explicitly call `cluster.fork()` again inside that handler to replace it. Without that, a crashed worker permanently reduces your available capacity. Process managers like PM2 provide this restart behavior out of the box.

**Q: What does a process manager like PM2 add on top of the `cluster` module?**

Automatic crash recovery with restart policies/backoff, zero-downtime reloads (spinning up new workers and draining old ones during a deploy instead of a hard restart that drops in-flight connections), centralized log capture/rotation, and monitoring tooling (CLI/dashboard, memory/CPU stats). Conceptually it's built on the same primary/worker model as `cluster`, but with the operational concerns already solved.
