# Interview Questions: The Event Loop

**Q: What is the event loop, in one sentence?**
It's the mechanism that continuously checks whether the call stack is empty and, if so, pulls the next pending callback from a queue (microtask or macrotask) and pushes it onto the stack to execute — this is how single-threaded JavaScript handles asynchronous work without ever running two pieces of JS at the same instant.

**Q: Why does `setTimeout(fn, 0)` not run `fn` immediately?**
Because `setTimeout` callbacks are macrotasks, and a macrotask can only run once the call stack is empty AND the entire microtask queue has been drained. Even with a 0ms delay, the callback still has to wait its turn behind any remaining synchronous code and every pending microtask.

**Q: What's the exact rule governing the order between microtasks and macrotasks?**
After the currently executing task (script or callback) finishes and the call stack empties, the event loop fully drains the microtask queue — running every microtask, including new ones scheduled by earlier microtasks — before it's allowed to dequeue and run the next macrotask. This repeats for every single macrotask, not just the first one.

**Q: Give an example of something that's a microtask and something that's a macrotask.**
`Promise.then/catch/finally` callbacks and `queueMicrotask()` are microtasks. `setTimeout`, `setInterval`, and I/O callbacks (like a file read completing) are macrotasks. In Node, `process.nextTick` callbacks form a separate, even higher-priority queue than Promise microtasks.

**Q: Does the executor function passed to `new Promise((resolve, reject) => {...})` run synchronously or asynchronously?**
Synchronously — it runs immediately, inline, at the moment the `Promise` constructor is called, before the constructor even returns. Only code registered via `.then()`/`.catch()`/`.finally()` (or an `await`) is deferred; the setup code inside the executor is not.

**Q: Why can a synchronous `while(true) {}` loop freeze an entire browser tab?**
Because JavaScript is single-threaded and the call stack must be empty before the event loop can process the next queued task — a non-terminating synchronous loop never returns control, so the stack is permanently occupied, blocking all rendering, all input handling, and all queued callbacks indefinitely.

**Q: How does `process.nextTick` in Node relate to the microtask queue?**
`process.nextTick` callbacks are queued in a separate, higher-priority queue than the Promise microtask queue, and Node drains the entire `nextTick` queue before processing the next Promise microtask (not just once per macrotask, but between individual microtasks too). This means `process.nextTick(fn)` scheduled alongside `Promise.resolve().then(fn2)` will always run `fn` before `fn2`.

**Q: What's the relationship between `requestAnimationFrame` and the event loop?**
`requestAnimationFrame` callbacks run after the microtask queue has drained but before the browser performs its next repaint, roughly synced to the display's refresh rate. It's not a macrotask or microtask in the traditional sense — it's tied specifically to the rendering pipeline, making it the right tool for visual/animation updates rather than general async deferral.

**Q: Why might chaining many `.then()` calls be worse for UI responsiveness than using `setTimeout` in between, even though microtasks run "sooner"?**
Because microtasks never yield to the browser's rendering step — the browser only gets a chance to paint or process input *after* the microtask queue is fully empty. A long or continuously-replenished chain of microtasks can starve rendering entirely, causing visible jank, whereas `setTimeout` (a macrotask) genuinely yields control back to the event loop, letting the browser render and handle input between each scheduled step.

**Q: If you have a `setTimeout(fn, 0)` and a `Promise.resolve().then(fn2)` both scheduled in the same synchronous block, which runs first, and why?**
`fn2` always runs first. It's queued as a microtask, and the entire microtask queue is guaranteed to drain completely before the event loop proceeds to the next macrotask (the `setTimeout` callback), regardless of the specified delay or the order in which they were scheduled in the code.

**Q: What's the practical difference between `setTimeout(fn, 0)` and `setImmediate(fn)` in Node.js?**
Both schedule `fn` as a macrotask with effectively minimal delay, but they run in different phases of Node's event loop — `setImmediate` runs in the "check" phase, right after the "poll" phase, while `setTimeout(fn, 0)` runs in the "timers" phase. Their relative order versus each other is not guaranteed at the top level of a script (it depends on process startup timing), but inside an I/O callback, `setImmediate` is always guaranteed to run before a `setTimeout(fn, 0)` scheduled at the same point, since the poll phase (where I/O callbacks fire) transitions directly into the check phase next.
