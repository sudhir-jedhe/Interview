# Interview Q&A: Event Loop Phases & Ordering

**Q: What are the phases of the Node.js event loop, in order?**
timers → pending callbacks → idle/prepare (internal) → poll → check → close callbacks. `setTimeout`/`setInterval` fire in timers, most I/O callbacks fire in poll, `setImmediate` fires in check, and socket `'close'` events fire in close callbacks. The loop cycles through these phases repeatedly as long as there's pending work.

**Q: What's the difference between a microtask and a macrotask (task) in Node's model?**
Microtasks (`process.nextTick` callbacks, Promise reactions) are drained completely, including any new ones scheduled during draining, before the event loop moves on to the next phase. Macrotasks (timers, I/O callbacks, `setImmediate`, close callbacks) are each tied to a specific event loop phase and only one phase's queue runs per loop iteration before microtasks are checked again.

**Q: In what order do process.nextTick, Promise, setTimeout(0), and setImmediate fire when all scheduled together at the top level?**
`process.nextTick` first, then Promise microtasks, then `setTimeout`/`setImmediate` — but the relative order of the timer vs immediate is not deterministic at the top level (depends on process startup timing), though inside an I/O callback `setImmediate` deterministically wins.

```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
// nextTick, promise, then (timeout/immediate in unspecified relative order)
```

**Q: Where does async/await fit relative to the event loop phases and microtask queue?**
`await` doesn't create a new mechanism — it's syntactic sugar over Promises. Code after an `await` is scheduled as a Promise continuation (a microtask), so it follows the same priority rules as `.then()`: it runs after the current synchronous code and after any `nextTick`s queued first, but before the event loop proceeds to the next macrotask phase.
