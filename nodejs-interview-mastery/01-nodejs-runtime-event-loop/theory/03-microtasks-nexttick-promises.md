# Microtasks: process.nextTick and Promises

`process.nextTick()` and Promise callbacks (`.then`/`.catch`/`await` continuations) are **not** part of the event loop phases (see `02-event-loop-phases.md`) — they're microtasks, drained **after the current operation completes and before the loop continues to the next phase**. `process.nextTick` has its own queue that is fully drained *before* the Promise microtask queue, and both are drained between every phase transition, not just once per full loop iteration.

```js
console.log('start');

setTimeout(() => console.log('timeout'), 0);

Promise.resolve().then(() => console.log('promise'));

process.nextTick(() => console.log('nextTick'));

console.log('end');

// Output:
// start
// end
// nextTick
// promise
// timeout
```

Trace: synchronous code (`start`, `end`) runs first. The call stack empties, so Node drains microtasks: `nextTick` queue first (`nextTick`), then the Promise queue (`promise`). Only then does the loop enter the **timers** phase and run `timeout`.

## process.nextTick vs Promise microtasks

| Aspect | process.nextTick | Promise (.then/await) |
|---|---|---|
| Queue priority | Drained first, before Promise queue | Drained after nextTick queue |
| Spec origin | Node-specific API | ECMAScript standard (Web/Node) |
| Starvation risk | High — recursive nextTick can block I/O forever | Lower, but still possible |
| Recommended for | Rare, low-level library code (e.g. guaranteeing a callback fires async before I/O) | General async code, standard choice |

Prefer Promises/async-await for application code since it's portable and standard; reserve `process.nextTick` for library authors needing to guarantee "run this before any I/O, even before other microtasks." The common mistake is using recursive `nextTick` for polling-like behavior, which starves the event loop of I/O callbacks entirely.

## The starvation gotcha

A common gotcha: recursive `process.nextTick` calls can starve the event loop entirely (I/O never gets a chance to run) because the `nextTick` queue is fully drained, including tasks added *during* its own draining, before yielding to the next phase. `setImmediate` doesn't have this problem — it's a real phase, so it yields.

```js
// Bad: can starve the event loop indefinitely if check() never becomes true
function waitForCondition(check, cb) {
  if (check()) return cb();
  process.nextTick(() => waitForCondition(check, cb));
}

// Better: yields control back to the event loop each iteration
function waitForCondition(check, cb) {
  if (check()) return cb();
  setImmediate(() => waitForCondition(check, cb));
}
```

## async/await is just Promise microtasks

`await` doesn't create a new mechanism — it's syntactic sugar over Promises. Code after an `await` is scheduled as a Promise continuation (a microtask), so it follows the same priority rules as `.then()`: it runs after the current synchronous code and after any `nextTick`s queued first, but before the event loop proceeds to the next macrotask phase.

```js
async function example() {
  console.log('1: sync start of async fn');
  await null; // schedules continuation as a microtask
  console.log('3: after await, runs as a microtask');
}
example();
console.log('2: sync code after calling example()');
// Output order: 1, 2, 3
```
