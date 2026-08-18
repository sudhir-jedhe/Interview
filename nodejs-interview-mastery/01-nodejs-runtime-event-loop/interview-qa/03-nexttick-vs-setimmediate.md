# Interview Q&A: process.nextTick vs setImmediate

**Q: What's the difference between process.nextTick() and setImmediate()?**
`process.nextTick` schedules a microtask that runs before the event loop proceeds to any phase — it's drained immediately after the current operation finishes, ahead of Promises too. `setImmediate` schedules a callback for the check phase, which runs after the poll phase completes in that loop iteration. `nextTick` is "as soon as possible, before I/O," `setImmediate` is "after I/O this iteration."

```js
process.nextTick(() => console.log('nextTick'));
setImmediate(() => console.log('immediate'));
// nextTick always logs first
```

**Q: Why does setTimeout(fn, 0) not run immediately?**
`setTimeout` callbacks are only eligible to run once the event loop reaches the timers phase, and only after the specified delay (clamped to a minimum of ~1ms) has elapsed. It also can't preempt currently executing synchronous code or already-queued microtasks — it's scheduled, not immediate.

**Q: Can you use setImmediate and process.nextTick interchangeably?**
No. They have different priorities and different starvation characteristics: `nextTick` preempts everything, including Promises and I/O, and can starve the loop if abused recursively; `setImmediate` is tied to an actual loop phase (check), so it always yields back to poll/I/O each iteration, making it safer for iterative or "give I/O a chance" patterns.
