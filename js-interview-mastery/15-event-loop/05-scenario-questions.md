# Scenario Questions: The Event Loop

**You're processing a large array (100,000 items) in the browser with a heavy synchronous transformation on each item, and the UI freezes completely while it runs — no scroll, no clicks, no animations. How do you fix this using your understanding of the event loop, and what's the trade-off?**

**Approach:**
The freeze happens because the entire loop runs as one synchronous block occupying the call stack — the event loop can't process any macrotask (including UI events and rendering) until the stack is empty. The fix is to break the work into chunks and yield back to the event loop between chunks, letting pending macrotasks (rendering, input) run in between:

```js
function processInChunks(items, chunkSize, processItem) {
  let index = 0;
  function runChunk() {
    const end = Math.min(index + chunkSize, items.length);
    for (; index < end; index++) {
      processItem(items[index]);
    }
    if (index < items.length) {
      setTimeout(runChunk, 0); // yield to the event loop, then continue
    }
  }
  runChunk();
}
```
Using `setTimeout(runChunk, 0)` rather than `Promise.resolve().then(runChunk)` matters here — a microtask-based "yield" would still fully drain before the browser gets to render or process input events, so it wouldn't actually unfreeze the UI between chunks; only a macrotask genuinely yields to rendering/input. The trade-off is total processing time increases slightly (each `setTimeout` has some minimum overhead/clamping), but the UI stays responsive throughout. For CPU-heavy work, moving the loop into a Web Worker (a separate thread) is usually the better fix, avoiding the main thread entirely.

---

**A junior engineer wrote code expecting a `console.log` inside a `.then()` to run "right after" a synchronous function call, but it's actually interleaved unexpectedly with other logs elsewhere in the app that use `setTimeout`. Walk through how you'd explain — and predict the order of — the following code they're confused about:**

```js
function fetchUserSimulated() {
  return new Promise(resolve => {
    console.log('fetching...');
    setTimeout(() => resolve({ name: 'Kai' }), 0);
  });
}
console.log('app start');
fetchUserSimulated().then(user => console.log('got user:', user.name));
console.log('app continuing');
```

**Approach:**
Trace it step by step: `'app start'` logs synchronously. Calling `fetchUserSimulated()` immediately runs the Promise executor synchronously (executors always run inline, not deferred), so `'fetching...'` logs next, and a `setTimeout` is scheduled as a macrotask — the promise stays pending, returned immediately. `.then()` is attached but has nothing to run yet. `'app continuing'` logs synchronously after. Only once the synchronous script finishes and the event loop reaches the queued macrotask does the timer fire, calling `resolve(...)`, which schedules the `.then()` callback as a microtask that runs immediately after, logging `'got user: Kai'`.

Full order: `app start`, `fetching...`, `app continuing`, `got user: Kai`. The key teaching point for the junior engineer: "right after" a synchronous call only applies to code that's *actually synchronous* — the Promise executor is synchronous, but anything gated behind `resolve()` (which here is itself gated behind a macrotask timer) can never run until the current script and the intervening macrotask both complete.

---

**Your team's design system library exposes a `debounce(fn, delay)` utility, but someone implemented it using `Promise.resolve().then()` chains instead of `setTimeout`, trying to "avoid timers." A bug report says debounced search-input handlers fire far too eagerly, effectively not debouncing at all under rapid typing. What went wrong?**

**Approach:**
The bug is a fundamental misunderstanding: microtasks are not a substitute for timers, because they don't provide any actual *time delay* — they only defer execution until the current synchronous code and prior microtasks finish, which for rapid consecutive keystrokes (each its own synchronous event handler call) could resolve in the same "tick" essentially back-to-back, providing no meaningful debounce window at all.

```js
// BROKEN "debounce" — doesn't actually wait for a pause in activity
function brokenDebounce(fn) {
  let pending;
  return (...args) => {
    pending = args;
    Promise.resolve().then(() => fn(...pending)); // fires almost immediately, every keystroke
  };
}

// CORRECT — uses a real timer that gets reset on every call
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```
The correct implementation relies on `setTimeout`'s actual wall-clock delay combined with `clearTimeout` to reset that delay on every new call — a genuinely asynchronous macrotask timer, not a same-tick microtask, is required to create a real "wait for a pause" behavior.

---

**You need to implement a lightweight polyfill-style scheduler that runs a large batch of independent callback functions "eventually," without blocking the main thread, but also without unnecessary delay (i.e., faster than repeated `setTimeout` calls, which get throttled/clamped). What built-in gives you this, and how does it fit into the event loop model?**

**Approach:**
`queueMicrotask()` schedules a callback as a genuine microtask — it runs as soon as the current synchronous execution and any already-queued microtasks finish, without the ~4ms minimum clamping that repeated nested `setTimeout` calls incur in browsers, and crucially without blocking the thread since it still respects the call stack being empty first:

```js
function runBatch(callbacks) {
  callbacks.forEach(cb => queueMicrotask(cb));
}
```
This is faster than `setTimeout`-based batching because microtasks have no minimum delay and run before the browser even considers rendering — but that's also the danger: scheduling too many/expensive microtasks can still starve rendering and input handling, since (unlike `setTimeout`) microtasks don't yield to the browser's rendering step at all. For genuinely large batches where responsiveness matters more than raw scheduling speed, chunking with `setTimeout` (or `requestIdleCallback` for "when the browser is idle" semantics) is the safer choice; `queueMicrotask` is best for smaller, fast, must-run-before-anything-else deferred work — e.g., normalizing internal library callback timing to always be async even when a value is already available synchronously.
