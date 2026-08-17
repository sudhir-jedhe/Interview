# Output-Based Questions: The Event Loop

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```
**Answer:** `A D C B`
**Why:** Synchronous code (`A`, `D`) runs first to completion. The promise callback is a microtask and the timeout callback is a macrotask; the microtask queue is fully drained before the event loop even considers the next macrotask, so `C` logs before `B` regardless of the 0ms delay.

```js
setTimeout(() => console.log('timeout 1'), 0);
setTimeout(() => console.log('timeout 2'), 0);
Promise.resolve().then(() => console.log('promise 1'));
Promise.resolve().then(() => console.log('promise 2'));
```
**Answer:** `promise 1 promise 2 timeout 1 timeout 2`
**Why:** Both promise callbacks are microtasks and both timeout callbacks are macrotasks. All queued microtasks run before the *first* macrotask is even attempted, and within each queue, callbacks run in the order they were scheduled (FIFO) — so both promises log before either timeout, in their original order.

```js
function main() {
  console.log('1');
  setTimeout(() => console.log('2'), 0);
  new Promise((resolve) => {
    console.log('3');
    resolve();
  }).then(() => console.log('4'));
  console.log('5');
}
main();
```
**Answer:** `1 3 5 4 2`
**Why:** The `Promise` **executor function** (the code inside `new Promise((resolve) => {...})`) runs **synchronously**, immediately, at the moment the promise is constructed — not deferred. So `'3'` logs inline with the rest of the synchronous code, right between `'1'` and `'5'`. Only the `.then()` callback (`'4'`) is deferred as a microtask, running after all synchronous code finishes but before the `setTimeout` macrotask (`'2'`).

```js
console.log('start');

setTimeout(() => {
  console.log('timeout');
  Promise.resolve().then(() => console.log('promise inside timeout'));
}, 0);

Promise.resolve().then(() => {
  console.log('promise');
  setTimeout(() => console.log('timeout inside promise'), 0);
});

console.log('end');
```
**Answer:** `start end promise timeout promise inside timeout timeout inside promise`
**Why:** Sync code runs first (`start`, `end`). The first microtask (`promise`) drains next, and while running it schedules a *new* macrotask (`timeout inside promise`) — but scheduling a macrotask doesn't jump any queue, it just joins the back of the macrotask queue. With the microtask queue now empty, the event loop runs the next macrotask in FIFO order, which is the original `setTimeout` (`timeout`), and that callback's own promise (`promise inside timeout`) drains as a microtask immediately after, before the second macrotask (`timeout inside promise`) gets its turn.

```js
async function asyncFn() {
  console.log('async start');
  await new Promise(resolve => setTimeout(resolve, 0));
  console.log('async end');
}
console.log('script start');
asyncFn();
console.log('script end');
```
**Answer:** `script start async start script end async end`
**Why:** `asyncFn()` runs synchronously up to the `await`, logging `async start`. The awaited expression is a promise that resolves only after a `setTimeout` macrotask fires — so execution of `asyncFn` is suspended until that timer completes, well after the surrounding synchronous code (`script end`) finishes. Once the timer's macrotask runs and resolves the inner promise, the `await` resumes (via a microtask) and logs `async end`.

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve()
  .then(() => {
    console.log(3);
    return new Promise(resolve => setTimeout(() => resolve(), 0)).then(() => console.log(4));
  })
  .then(() => console.log(5));
console.log(6);
```
**Answer:** `1 6 3 2 4 5`
**Why:** Sync logs `1` and `6` first. The first `.then` (a microtask) logs `3`, then returns a promise that itself depends on a `setTimeout` — so the chain is now blocked waiting on a *macrotask* to resolve that inner promise. With the microtask queue empty, the event loop proceeds to macrotasks in order: the original `setTimeout` (`2`) runs first since it was scheduled first, then the inner `setTimeout` fires, resolving the inner promise and logging `4` (as a microtask right after that macrotask), which finally lets the outer chain's last `.then` run, logging `5`.

```js
console.log('start');
Promise.resolve()
  .then(() => console.log('micro 1'))
  .finally(() => console.log('finally'))
  .then(() => console.log('micro 2'));
setTimeout(() => console.log('macro'), 0);
console.log('end');
```
**Answer:** `start end micro 1 finally micro 2 macro`
**Why:** `.finally()` behaves like a `.then()` for scheduling purposes — it's still queued as a microtask in the chain, running after `micro 1` resolves and before the next `.then`. All three chained microtask steps (`micro 1`, `finally`, `micro 2`) fully drain in sequence before the event loop even glances at the macrotask queue for `macro`.

```js
for (let i = 0; i < 3; i++) {
  Promise.resolve().then(() => console.log('micro', i));
}
setTimeout(() => console.log('macro'), 0);
console.log('sync loop done');
```
**Answer:** `sync loop done micro 0 micro 1 micro 2 macro`
**Why:** The `for` loop runs entirely synchronously, scheduling three microtasks (capturing `i` correctly per iteration because `let` creates a new binding each time) before any of them run. Once the synchronous script finishes (`sync loop done`), all three microtasks drain in the order they were queued, and only then does the single macrotask run.
