# Closures Capture a Live Reference, Not a Value Snapshot

```js
function outer() {
  let x = 10;
  function inner() {
    console.log(x);
  }
  x = 20;
  return inner;
}
outer()();
```

**Answer:** `20`

**Why:** A closure captures a live reference to the variable, not a snapshot of its value at the time the inner function was defined. `x` is reassigned to `20` before `inner` is ever called, and since `inner` reads `x` fresh each time it runs, it sees the latest value.
