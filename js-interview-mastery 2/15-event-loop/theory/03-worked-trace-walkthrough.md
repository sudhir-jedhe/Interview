# A Fully Worked Trace

```js
console.log('1: sync start');

setTimeout(() => console.log('2: timeout'), 0);

Promise.resolve()
  .then(() => console.log('3: promise A'))
  .then(() => console.log('4: promise B'));

console.log('5: sync end');
```

## Trace, step by step

1. `console.log('1')` runs synchronously → logs `1: sync start`.
2. `setTimeout(...)` hands its callback to the Web API; it starts a 0ms timer, then immediately returns control to JS (does not run the callback yet). The callback is queued as a **macrotask** once the timer fires.
3. `Promise.resolve().then(cb1)` schedules `cb1` as a **microtask**; `.then(cb2)` is chained but can't be scheduled yet since it depends on `cb1`'s return value.
4. `console.log('5')` runs synchronously → logs `5: sync end`.
5. The current macrotask (the top-level script) is done, and the call stack is empty. The event loop now drains the **microtask queue**: `cb1` runs, logging `3: promise A`, and its return value resolves the next `.then`, which schedules `cb2` as a *new* microtask — which also runs before moving on, logging `4: promise B`.
6. Only now, with the microtask queue fully empty, does the event loop move to the **macrotask queue** and run the `setTimeout` callback, logging `2: timeout`.

**Final output:** `1: sync start`, `5: sync end`, `3: promise A`, `4: promise B`, `2: timeout`.

## The pattern to internalize

Whenever tracing mixed sync/async code, work through it in three passes:
1. Run every synchronous line top-to-bottom, in order, ignoring anything scheduled for later.
2. Once the synchronous pass is done, drain the entire microtask queue — including any *new* microtasks scheduled by microtasks that already ran during this same drain.
3. Only then, run the single next macrotask — and repeat the microtask-draining step after it, before touching the macrotask queue again.

See `output-based/` in this topic for many more traces built on exactly this three-pass method, and `problems/01-predict-and-verify-execution-order.md` for a hands-on exercise writing and verifying your own.
