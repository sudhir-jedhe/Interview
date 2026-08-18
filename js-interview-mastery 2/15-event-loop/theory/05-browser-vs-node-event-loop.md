# Browser vs. Node.js Event Loop

The general model is the same, but Node has an additional even-higher-priority queue: `process.nextTick()` callbacks run *before* the regular microtask (Promise) queue, and Node actually drains the `nextTick` queue between processing *each* microtask, not just once per macrotask. Node's event loop is also organized into distinct phases (timers, pending callbacks, poll, check, close callbacks), with microtasks (and `nextTick`) draining between every phase transition — more granular than the browser's simpler "one macrotask, then all microtasks" model. For interview purposes, the core rule (microtasks fully drain before the next macrotask) holds in both environments; the Node-specific nuance is mainly that `process.nextTick` jumps the queue ahead of `Promise` microtasks.

## Comparison table

| Aspect | Browser | Node.js |
|---|---|---|
| Extra priority queue | None beyond microtasks | `process.nextTick()` — runs before Promise microtasks |
| Loop structure | Simplified: one task, drain microtasks, maybe render, repeat | Explicit phases: timers, pending callbacks, poll, check, close callbacks |
| Microtask draining | Once per macrotask | Drains (including `nextTick`) between phases and after each callback |
| Rendering step | `requestAnimationFrame` callbacks + paint, interleaved in the loop | No rendering concept — headless |

The core "microtasks before next macrotask" rule holds in both, but Node has finer-grained phases and the extra `process.nextTick` queue that jumps ahead of even Promise callbacks. The common mistake when moving between environments is assuming `setImmediate` (Node-only) behaves like `setTimeout(fn, 0)` — they're related but scheduled in different phases, and their relative order versus timers depends on whether you're inside an I/O callback or the main module body.

```js
// (Node.js only) process.nextTick outranks even Promise microtasks
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
// sync
// nextTick
// promise
```

## `setTimeout(fn, 0)` vs. `setImmediate(fn)` in Node

Both schedule `fn` as a macrotask with effectively minimal delay, but they run in different phases of Node's event loop — `setImmediate` runs in the "check" phase, right after the "poll" phase, while `setTimeout(fn, 0)` runs in the "timers" phase. Their relative order versus each other is not guaranteed at the top level of a script (it depends on process startup timing), but inside an I/O callback, `setImmediate` is always guaranteed to run before a `setTimeout(fn, 0)` scheduled at the same point, since the poll phase (where I/O callbacks fire) transitions directly into the check phase next.
