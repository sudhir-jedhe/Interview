# Interview Q&A: Microtask Priority & Starvation

**Q: Do process.nextTick callbacks run before or after Promise .then() callbacks?**
Before. Node maintains a separate `nextTick` queue that's fully drained before the Promise microtask queue is processed, every time the call stack empties. This is a Node-specific extension to the microtask model.

**Q: What happens if you recursively call process.nextTick without a terminating condition?**
It starves the event loop — because the `nextTick` queue must be fully drained (including newly added entries) before the loop can proceed to any phase, an infinite recursive chain prevents timers, I/O callbacks, and even incoming connections from ever being processed. This is sometimes called "I/O starvation" and is a classic footgun — see `../scenarios/03-nexttick-polling-starves-connections.md` for a production incident caused by exactly this pattern.

**Q: Why might a `process.nextTick`-based "setup" callback appear to run before an I/O callback that was triggered earlier in wall-clock time?**
Because `process.nextTick` schedules a microtask that runs as soon as the current synchronous script finishes — before the event loop even reaches the poll phase where I/O callbacks (like a database query response) fire. This holds regardless of which one was "started" first in the code; microtask priority, not registration order, determines the outcome. See `../scenarios/04-nexttick-setup-vs-db-callback-order.md` for a full worked trace.
