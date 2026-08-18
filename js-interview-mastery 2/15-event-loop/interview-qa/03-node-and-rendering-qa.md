# Interview Q&A: Node.js Specifics and Rendering

**Q: How does `process.nextTick` in Node relate to the microtask queue?**
`process.nextTick` callbacks are queued in a separate, higher-priority queue than the Promise microtask queue, and Node drains the entire `nextTick` queue before processing the next Promise microtask (not just once per macrotask, but between individual microtasks too). This means `process.nextTick(fn)` scheduled alongside `Promise.resolve().then(fn2)` will always run `fn` before `fn2`.

**Q: What's the relationship between `requestAnimationFrame` and the event loop?**
`requestAnimationFrame` callbacks run after the microtask queue has drained but before the browser performs its next repaint, roughly synced to the display's refresh rate. It's not a macrotask or microtask in the traditional sense — it's tied specifically to the rendering pipeline, making it the right tool for visual/animation updates rather than general async deferral.

**Q: What's the practical difference between `setTimeout(fn, 0)` and `setImmediate(fn)` in Node.js?**
Both schedule `fn` as a macrotask with effectively minimal delay, but they run in different phases of Node's event loop — `setImmediate` runs in the "check" phase, right after the "poll" phase, while `setTimeout(fn, 0)` runs in the "timers" phase. Their relative order versus each other is not guaranteed at the top level of a script (it depends on process startup timing), but inside an I/O callback, `setImmediate` is always guaranteed to run before a `setTimeout(fn, 0)` scheduled at the same point, since the poll phase (where I/O callbacks fire) transitions directly into the check phase next.
