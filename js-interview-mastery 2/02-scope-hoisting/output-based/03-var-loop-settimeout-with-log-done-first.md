# `var` Loop with `setTimeout`, Plus a Synchronous Log After

```js
var i;
for (i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
console.log('loop done');
```

**Answer:** `'loop done'` then `3`, `3`, `3`

**Why:** The synchronous code (the `for` loop and the final `console.log`) all runs first, finishing the loop with `i` at `3`. The `setTimeout` callbacks are queued but only run after the call stack clears, by which point they all close over the same single `i`, now `3`.
