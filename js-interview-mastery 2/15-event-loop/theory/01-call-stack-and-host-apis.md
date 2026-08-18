# The Call Stack and Host APIs

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

## Why a blocking loop freezes everything

```js
console.log('start');
setTimeout(() => console.log('timeout fired'), 0);
const start = Date.now();
while (Date.now() - start < 100) {} // blocks the thread for 100ms
console.log('after blocking loop');
// start
// after blocking loop   <- runs ~100ms later, then...
// timeout fired          <- only now, even though it was "due" much earlier
```

The `setTimeout` callback becomes ready to run almost immediately, but it can't actually execute until the call stack is empty — and the call stack stays occupied by the synchronous `while` loop for its full 100ms, so nothing else (including rendering, input, or other timers) gets a chance to run in the meantime.
