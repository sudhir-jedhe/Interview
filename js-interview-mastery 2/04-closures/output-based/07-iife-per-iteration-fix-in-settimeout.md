# IIFE-Per-Iteration Fix Inside a `var` Loop with `setTimeout`

```js
function delayedLog() {
  for (var i = 1; i <= 3; i++) {
    (function(n) {
      setTimeout(() => console.log(n), n * 100);
    })(i);
  }
}
delayedLog();
```

**Answer:** `1`, `2`, `3` (in that order, roughly 100ms apart)

**Why:** The IIFE `(function(n) { ... })(i)` executes immediately on each loop iteration, and its parameter `n` receives a fresh copy of `i`'s current value at that moment. Each `setTimeout` callback closes over that IIFE's own `n`, not the shared loop `i`, so despite using `var`, the values are correctly isolated per iteration — this is the pre-`let` fix for the classic loop bug.
