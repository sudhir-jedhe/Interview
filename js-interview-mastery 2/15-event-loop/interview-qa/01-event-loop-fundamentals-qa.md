# Interview Q&A: Event Loop Fundamentals

**Q: What is the event loop, in one sentence?**
It's the mechanism that continuously checks whether the call stack is empty and, if so, pulls the next pending callback from a queue (microtask or macrotask) and pushes it onto the stack to execute — this is how single-threaded JavaScript handles asynchronous work without ever running two pieces of JS at the same instant.

**Q: What's the exact rule governing the order between microtasks and macrotasks?**
After the currently executing task (script or callback) finishes and the call stack empties, the event loop fully drains the microtask queue — running every microtask, including new ones scheduled by earlier microtasks — before it's allowed to dequeue and run the next macrotask. This repeats for every single macrotask, not just the first one.

**Q: Give an example of something that's a microtask and something that's a macrotask.**
`Promise.then/catch/finally` callbacks and `queueMicrotask()` are microtasks. `setTimeout`, `setInterval`, and I/O callbacks (like a file read completing) are macrotasks. In Node, `process.nextTick` callbacks form a separate, even higher-priority queue than Promise microtasks.

**Q: Why can a synchronous `while(true) {}` loop freeze an entire browser tab?**
Because JavaScript is single-threaded and the call stack must be empty before the event loop can process the next queued task — a non-terminating synchronous loop never returns control, so the stack is permanently occupied, blocking all rendering, all input handling, and all queued callbacks indefinitely.
