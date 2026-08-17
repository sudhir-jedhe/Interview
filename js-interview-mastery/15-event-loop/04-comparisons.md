# Comparisons: The Event Loop

## Macrotasks vs. Microtasks

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

Use `Promise.resolve().then()` or `queueMicrotask()` when you need to defer just barely past the current synchronous execution without letting the browser repaint or process other events. Use `setTimeout` when you specifically want to yield to the browser's rendering/other macrotasks (e.g., breaking up a long task into chunks so the UI stays responsive). The common mistake is using nested `Promise.then()` chains to try to "yield" to the UI for responsiveness — since microtasks all drain before any rendering, a chain of enough microtasks can still starve the browser from repainting, unlike `setTimeout`.

## Browser Event Loop vs. Node.js Event Loop

| Aspect | Browser | Node.js |
|---|---|---|
| Extra priority queue | None beyond microtasks | `process.nextTick()` — runs before Promise microtasks |
| Loop structure | Simplified: one task, drain microtasks, maybe render, repeat | Explicit phases: timers, pending callbacks, poll, check, close callbacks |
| Microtask draining | Once per macrotask | Drains (including `nextTick`) between phases and after each callback |
| Rendering step | `requestAnimationFrame` callbacks + paint, interleaved in the loop | No rendering concept — headless |

The core "microtasks before next macrotask" rule holds in both, but Node has finer-grained phases and the extra `process.nextTick` queue that jumps ahead of even Promise callbacks. The common mistake when moving between environments is assuming `setImmediate` (Node-only) behaves like `setTimeout(fn, 0)` — they're related but scheduled in different phases, and their relative order versus timers depends on whether you're inside an I/O callback or the main module body.

## `requestAnimationFrame` vs. `setTimeout`

| Aspect | `requestAnimationFrame` | `setTimeout` |
|---|---|---|
| Timing | Synced to the browser's repaint cycle (~every 16.7ms at 60Hz) | Arbitrary delay you specify, not synced to rendering |
| Pauses when tab hidden | Yes — browsers throttle/pause rAF in background tabs, saving resources | No — timers keep firing (though often throttled to 1000ms minimum in background tabs) |
| Best for | Visual animations, layout reads/writes | General-purpose deferred/delayed logic |

Always use `requestAnimationFrame` for animation logic rather than `setTimeout(fn, 16)` — it's automatically synced to the display's actual refresh rate and pauses appropriately when the tab isn't visible, avoiding wasted work and janky, drift-prone timing that a fixed-interval timer would produce.
