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
