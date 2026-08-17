# Closures — Output-Based Questions

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

---

```js
function createFunctions() {
  const fns = [];
  for (var i = 0; i < 3; i++) {
    fns.push(function() { return i; });
  }
  return fns;
}
const [f1, f2, f3] = createFunctions();
console.log(f1(), f2(), f3());
```
**Answer:** `3 3 3`

**Why:** All three functions close over the same `var i`, since `var` doesn't create a new binding per loop iteration — there's only one `i` in `createFunctions`'s scope. By the time any of the returned functions is called, the loop has already finished and `i` holds its final value, `3`.

---

```js
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}
const add10 = makeAdder(10);
const add20 = makeAdder(20);
console.log(add10(5), add20(5), add10(100));
```
**Answer:** `15 25 110`

**Why:** Each call to `makeAdder` creates a distinct closure with its own `x`. `add10` and `add20` are independent functions with independently captured `x` values (`10` and `20` respectively) — calling one doesn't affect the other's captured state.

---

```js
function counterFactory() {
  let count = 0;
  return {
    increment: () => ++count,
    reset: () => { count = 0; }
  };
}
const counter = counterFactory();
counter.increment();
counter.increment();
counter.reset();
console.log(counter.increment());
```
**Answer:** `1`

**Why:** Both `increment` and `reset` close over the *same* `count` variable within one `counterFactory()` call, so mutations from one method are visible to the other. After two increments (`count` = 2) and a reset (`count` = 0), the next increment brings it to `1`.

---

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

---

```js
function secretHolder(secret) {
  return {
    reveal: function() { return secret; }
  };
}
const holder = secretHolder('42');
console.log(Object.keys(holder));
console.log(holder.secret);
console.log(holder.reveal());
```
**Answer:** `['reveal']`, `undefined`, `'42'`

**Why:** `secret` is never attached as a property on the returned object — it only exists in `secretHolder`'s closure, accessible exclusively through the `reveal` function that was defined inside that scope. `Object.keys` only sees the object's own enumerable properties (`reveal`), not the hidden closed-over variable, and direct access via `holder.secret` correctly returns `undefined`.

---

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

---

```js
let cache;
function getData() {
  if (cache) return cache;
  cache = { value: Math.random() };
  return cache;
}
console.log(getData() === getData());
```
**Answer:** `true`

**Why:** This isn't a closure over a local variable — `cache` is declared outside `getData` in the enclosing (module/global) scope, so `getData` closes over that shared `cache`. The first call computes and stores an object in `cache`; every subsequent call returns that exact same cached object reference, so the two calls in the comparison return the identical object, making `===` true.
