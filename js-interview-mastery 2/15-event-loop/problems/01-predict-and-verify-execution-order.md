# Problem: Predict and Verify Execution Order

**Goal:** Write (or work through) a script mixing `setTimeout`, `Promise.then`, `queueMicrotask`, and synchronous code, predict the exact `console.log` order using the three-pass method (sync → drain microtasks → next macrotask, repeat), then verify it by actually running the code.

## The script

```js
console.log('1: script start');

setTimeout(() => console.log('2: setTimeout'), 0);

queueMicrotask(() => console.log('3: queueMicrotask'));

Promise.resolve()
  .then(() => console.log('4: promise then A'))
  .then(() => {
    console.log('5: promise then B');
    queueMicrotask(() => console.log('6: nested queueMicrotask'));
  });

setTimeout(() => console.log('7: setTimeout 2'), 0);

console.log('8: script end');
```

## Predicting it step by step

1. **Synchronous pass**: run every line top to bottom that isn't inside a callback. This logs `1: script start` and `8: script end`, and *registers* (without running) two timers, one `queueMicrotask` callback, and a `.then()` chain.
2. **Drain microtasks (round 1)**: the microtask queue at this point holds, in scheduling order: `queueMicrotask` (line 3's callback), then the first `.then` (line 4's callback). They run in that order: `3: queueMicrotask`, then `4: promise then A`. Running `4`'s callback resolves the next link in the chain, which schedules `5`'s callback as a *new* microtask.
3. **Drain microtasks (round 2, still before any macrotask)**: `5: promise then B` runs, and it itself calls `queueMicrotask` for `6`, scheduling yet another microtask.
4. **Drain microtasks (round 3)**: `6: nested queueMicrotask` runs. The microtask queue is now genuinely empty.
5. **First macrotask**: the two `setTimeout` calls are FIFO in the macrotask queue, so `2: setTimeout` runs, then (no microtasks were added, so nothing to drain) `7: setTimeout 2` runs.

## Predicted order

```
1: script start
8: script end
3: queueMicrotask
4: promise then A
5: promise then B
6: nested queueMicrotask
2: setTimeout
7: setTimeout 2
```

## Verifying it

Paste the script into a Node REPL, a `.js` file run with `node`, or a browser console — the actual output matches the prediction exactly, confirming: `queueMicrotask` and `.then()` share one FIFO microtask queue (ordered by *scheduling* time, not by which API scheduled them), a microtask that schedules another microtask extends the same drain instead of waiting for a macrotask, and only once the microtask queue is truly empty do queued macrotasks run, in their own FIFO order.
