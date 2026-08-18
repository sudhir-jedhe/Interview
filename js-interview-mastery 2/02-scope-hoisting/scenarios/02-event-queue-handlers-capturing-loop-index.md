# Dynamically Registered Handlers All Log the Same Index

**Scenario:** You're building a simple event-queue system where you dynamically register N handlers in a loop, each needing to remember its own index for logging. Using `var` in the loop, every handler logs the same final index. Fix it, and explain two different valid fixes.

**Approach:**

```js
// Buggy version
const handlers = [];
for (var i = 0; i < 5; i++) {
  handlers.push(function() {
    console.log('handler', i);
  });
}
handlers.forEach(h => h()); // logs 'handler 5' five times
```

**Fix 1 — switch to `let`:** `let` creates a fresh binding of `i` for each loop iteration, so each closure captures its own copy.

```js
const handlers1 = [];
for (let i = 0; i < 5; i++) {
  handlers1.push(function() {
    console.log('handler', i);
  });
}
handlers1.forEach(h => h()); // 'handler 0' ... 'handler 4'
```

**Fix 2 — IIFE to create a new scope per iteration (the pre-ES6 fix, still relevant when `var` is unavoidable):**

```js
const handlers2 = [];
for (var i = 0; i < 5; i++) {
  (function(capturedI) {
    handlers2.push(function() {
      console.log('handler', capturedI);
    });
  })(i);
}
handlers2.forEach(h => h()); // 'handler 0' ... 'handler 4'
```

The IIFE immediately invokes with the current value of `i`, creating a new function scope per iteration where `capturedI` is a distinct variable each time. `let` is strictly simpler in modern code, but understanding the IIFE fix matters for reading legacy code and for interview questions that specifically ask "how would you fix this without `let`." A third fix using `.bind()` is covered in `../problems/03-fix-var-loop-closure-bug-three-ways.md`.
