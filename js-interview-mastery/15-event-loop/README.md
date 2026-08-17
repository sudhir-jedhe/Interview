# The Event Loop

The event loop is the mechanism that lets single-threaded JavaScript handle asynchronous operations without blocking — it's the single most-tested "how does JS actually work" topic in senior interviews, because getting execution order wrong reveals a shallow understanding of the language. This topic breaks down the call stack, the Web/Node APIs that run async work outside JS, and the two-queue system (macrotasks vs. microtasks) that governs exactly when deferred callbacks run. The centerpiece is the rule that determines nearly every "what logs in what order" interview question: **all queued microtasks fully drain before the event loop proceeds to the next macrotask** — which is precisely why a `Promise.then()` callback always beats a `setTimeout(fn, 0)` callback, no matter how the code is arranged.

## What's covered
- The call stack
- Web APIs / Node APIs as the environment that provides async capabilities
- Macrotask (callback) queue vs. microtask queue
- The exact rule: all microtasks drain before the next macrotask
- Why `Promise.then` callbacks run before `setTimeout(fn, 0)`
- `requestAnimationFrame`'s relationship to the loop (brief)
- A fully worked trace of a mixed sync/`setTimeout`/Promise example with exact log order and reasoning
- Browser vs. Node differences (`process.nextTick` priority in Node, briefly)

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
