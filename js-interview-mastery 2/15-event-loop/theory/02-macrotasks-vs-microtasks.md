# Macrotasks vs. Microtasks

## Two queues

Once a Web/Node API finishes its async work, it doesn't run the callback immediately — it places it into a queue, waiting for the call stack to be empty. There are two such queues with different priority:

- **Macrotask (a.k.a. "task" or "callback") queue** — `setTimeout`, `setInterval`, I/O callbacks, UI rendering/event dispatch in browsers.
- **Microtask queue** — `Promise.then/catch/finally` callbacks, `queueMicrotask()`, and (in Node) `process.nextTick` in an even higher-priority sub-queue.

## The core rule

The event loop's algorithm, simplified: **run one macrotask, then drain the ENTIRE microtask queue (including any new microtasks scheduled while draining), then render if needed, then run the next macrotask, repeat.** Microtasks always get fully emptied between every single macrotask — never partially, and new microtasks queued during draining are also processed before moving on.

This is exactly why:

```js
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
// promise
// timeout
```
Even with a `0`ms delay, `setTimeout`'s callback is a macrotask and must wait for the *current* macrotask (the initial script execution) to finish AND the microtask queue to fully drain first. The promise callback is a microtask and gets priority immediately once the synchronous code finishes.

## Comparison table

| Aspect | Macrotask (Task) | Microtask |
|---|---|---|
| Examples | `setTimeout`, `setInterval`, I/O callbacks, UI event dispatch | `Promise.then/catch/finally`, `queueMicrotask` |
| Queue draining | One macrotask runs per event loop iteration | The ENTIRE microtask queue drains before the next macrotask |
| New tasks queued during processing | Wait for the next loop iteration | Also drained in the same pass (before moving on) |
| Priority relative to each other | Lower priority than microtasks | Higher priority — always goes first when both are pending |

The rule to internalize: after any synchronous code block finishes, the engine always empties the microtask queue completely — even microtasks scheduled by other microtasks — before it's allowed to touch the next macrotask. The common mistake is assuming `setTimeout(fn, 0)` means "run next" in an absolute sense; it actually means "run as the next macrotask," which is always after all currently-pending microtasks, no matter how many there are.

## `setTimeout(fn, 0)` vs. `Promise.resolve().then(fn)`

| Aspect | `setTimeout(fn, 0)` | `Promise.resolve().then(fn)` |
|---|---|---|
| Queue | Macrotask | Microtask |
| Minimum real delay | Browsers commonly clamp to ~1-4ms even at "0"; never truly 0 | No artificial minimum delay — runs as soon as the stack clears |
| Relative ordering | Always after all pending microtasks | Always before any pending macrotask |
| Typical use | Yielding to the browser to allow rendering/other macrotasks | Deferring work minimally, without yielding to rendering |

Use `Promise.resolve().then()` or `queueMicrotask()` when you need to defer just barely past the current synchronous execution without letting the browser repaint or process other events. Use `setTimeout` when you specifically want to yield to the browser's rendering/other macrotasks (e.g., breaking up a long task into chunks so the UI stays responsive — see `problems/03-yield-to-event-loop-utility.md`). The common mistake is using nested `Promise.then()` chains to try to "yield" to the UI for responsiveness — since microtasks all drain before any rendering, a chain of enough microtasks can still starve the browser from repainting, unlike `setTimeout`.
