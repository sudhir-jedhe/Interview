# Notes: The Event Loop

## The call stack

JavaScript executes on a single thread with one **call stack** — a LIFO structure tracking which function is currently running and what called it. When a function is invoked, a frame is pushed; when it returns, the frame is popped. If the stack is busy (a function is running), nothing else — no other JS, no callback — can run, because there's only one thread. This is why a long-running synchronous loop "freezes" a browser tab: the stack never empties, so no queued work ever gets a chance to run.

```js
function a() { b(); }
function b() { console.log('in b'); }
a();
// call stack: [a] -> [a, b] -> [a] -> []
```

## Web APIs / Node APIs

JavaScript itself has no built-in concept of timers, network requests, or DOM events — these are provided by the **host environment** (the browser's Web APIs, or Node's C++ bindings/libuv). When you call `setTimeout(fn, 1000)`, the JS engine hands the timer off to the environment, which counts down *outside* the JS thread, and only pushes `fn` into a queue once the countdown finishes — it does not run `fn` itself, and it cannot interrupt the call stack. This handoff is precisely what allows async operations to happen without blocking JS execution.

## Two queues: macrotasks and microtasks

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

## `requestAnimationFrame`

`requestAnimationFrame(fn)` schedules `fn` to run right before the browser's next repaint — it's neither a macrotask nor a microtask in the same sense; it runs after microtasks have drained but before the browser paints the next frame, roughly once per display refresh (~16.7ms at 60Hz). It's used for visual updates (animations) that should be synced to the rendering cycle rather than an arbitrary timer.

## A fully worked trace

```js
console.log('1: sync start');

setTimeout(() => console.log('2: timeout'), 0);

Promise.resolve()
  .then(() => console.log('3: promise A'))
  .then(() => console.log('4: promise B'));

console.log('5: sync end');
```

Trace:
1. `console.log('1')` runs synchronously → logs `1: sync start`.
2. `setTimeout(...)` hands its callback to the Web API; it starts a 0ms timer, then immediately returns control to JS (does not run the callback yet). The callback is queued as a **macrotask** once the timer fires.
3. `Promise.resolve().then(cb1)` schedules `cb1` as a **microtask**; `.then(cb2)` is chained but can't be scheduled yet since it depends on `cb1`'s return value.
4. `console.log('5')` runs synchronously → logs `5: sync end`.
5. The current macrotask (the top-level script) is done, and the call stack is empty. The event loop now drains the **microtask queue**: `cb1` runs, logging `3: promise A`, and its return value resolves the next `.then`, which schedules `cb2` as a *new* microtask — which also runs before moving on, logging `4: promise B`.
6. Only now, with the microtask queue fully empty, does the event loop move to the **macrotask queue** and run the `setTimeout` callback, logging `2: timeout`.

Final output: `1: sync start`, `5: sync end`, `3: promise A`, `4: promise B`, `2: timeout`.

## Browser vs. Node differences

The general model is the same, but Node has an additional even-higher-priority queue: `process.nextTick()` callbacks run *before* the regular microtask (Promise) queue, and Node actually drains `nextTick` queue between processing *each* microtask, not just once per macrotask. Node's event loop is also organized into distinct phases (timers, pending callbacks, poll, check, close callbacks), with microtasks (and `nextTick`) draining between every phase transition — more granular than the browser's simpler "one macrotask, then all microtasks" model. For interview purposes, the core rule (microtasks fully drain before the next macrotask) holds in both environments; the Node-specific nuance is mainly that `process.nextTick` jumps the queue ahead of `Promise` microtasks.
