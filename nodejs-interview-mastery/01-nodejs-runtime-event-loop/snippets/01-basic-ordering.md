# Basic Ordering: Sync -> Microtasks (nextTick, then Promise) -> Macrotasks

Demonstrates the fundamental priority order Node uses when the call stack empties: synchronous code first, then `process.nextTick`, then Promise microtasks, then macrotasks like `setTimeout`.

```js
console.log('A');
setTimeout(() => console.log('D: timeout'), 0);
Promise.resolve().then(() => console.log('C: promise'));
process.nextTick(() => console.log('B: nextTick'));
console.log('A2');
```

**Output:** `A`, `A2`, `B: nextTick`, `C: promise`, `D: timeout`

Synchronous lines (`A`, `A2`) run first since nothing yields the thread. Once the stack is empty, the `nextTick` queue drains completely before the Promise microtask queue, and only after both microtask queues are empty does the loop proceed to the timers phase where the `setTimeout` callback runs.

See `../theory/03-microtasks-nexttick-promises.md` for the full priority model.
