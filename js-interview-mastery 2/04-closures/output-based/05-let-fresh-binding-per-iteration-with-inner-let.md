# `let` Loop Variable Plus an Inner `let`, Both Fresh Per Iteration

```js
const funcs = [];
for (let i = 0; i < 3; i++) {
  let j = i * 2;
  funcs.push(() => j);
}
console.log(funcs.map(f => f()));
```

**Answer:** `[0, 2, 4]`

**Why:** `let i` creates a fresh `i` binding each iteration, and `let j` (declared inside the loop body) also creates a fresh `j` each time, computed from that iteration's `i`. Each closure captures its own distinct `j`, giving the expected `0, 2, 4` rather than all converging on one shared value.
