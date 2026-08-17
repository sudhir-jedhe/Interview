# Output-Based Questions: Memory & Performance

```js
function outer() {
  let count = 0;
  return function increment() {
    return ++count;
  };
}

const counterA = outer();
const counterB = outer();
console.log(counterA(), counterA(), counterB());
```
**Answer:**
```
1 2 1
```
**Why:** Each call to `outer()` creates a brand-new closure scope with its own `count` variable. `counterA` and `counterB` are two independent closures, so incrementing one has no effect on the other's `count` — a classic demonstration that closures capture variables by reference to their own scope instance, not a shared global.

---

```js
"use strict";
function assign() {
  leaked = "value";
}
try {
  assign();
} catch (e) {
  console.log(e.constructor.name);
}
```
**Answer:**
```
ReferenceError
```
**Why:** In strict mode, assigning to an undeclared identifier (`leaked = "value"` with no `let`/`const`/`var`) throws a `ReferenceError` instead of silently creating a property on the global object. This is one of strict mode's protections specifically against the accidental-global memory leak pattern.

---

```js
const cache = new WeakMap();
function attach(obj) {
  cache.set(obj, "metadata");
  return cache.has(obj);
}
console.log(attach({}));
console.log(cache.size);
```
**Answer:**
```
true
undefined
```
**Why:** `attach` correctly sets and confirms the entry while the object is still referenced by the local parameter. But `WeakMap` has no `.size` property at all (unlike `Map`) — accessing it returns `undefined` — because the number of live entries can change at any moment due to garbage collection, so exposing a "count" wouldn't be a meaningful, stable value.

---

```js
function makeLogger(hugeArray) {
  const summary = hugeArray.length;
  return function () {
    console.log("total items processed:", summary);
  };
}

const logFn = makeLogger(new Array(1_000_000).fill(0));
logFn();
```
**Answer:**
```
total items processed: 1000000
```
**Why:** The returned function only references `summary` (a plain number), not `hugeArray` itself. In modern V8, closures are optimized to retain only the variables actually referenced by the inner function, so `hugeArray` itself becomes eligible for garbage collection once `makeLogger` returns — even though both were declared in the same enclosing scope. This is an important nuance: closures don't necessarily retain *everything* in scope, only what's actually used.

---

```js
let timerId;
function schedule() {
  const data = { big: "x".repeat(1000) };
  timerId = setInterval(() => {
    console.log(data.big.length);
  }, 1000);
}
schedule();
// ... some time later ...
clearInterval(timerId);
```
**Answer:**
```
1000
1000
... (repeats every second until clearInterval runs)
```
**Why:** `data` stays alive and accessible on every tick because the interval's callback closure retains a reference to it — `setInterval` itself holds a reference to the callback, and the callback's closure holds a reference to `data`. `data` only becomes eligible for garbage collection once `clearInterval(timerId)` runs and the interval (and its callback closure) is fully torn down; until then, it's retained for as long as the interval keeps firing, regardless of whether `schedule()` has already returned.

---

```js
const set = new WeakSet();
let node = { type: "div" };
set.add(node);
console.log(set.has(node));
for (const item of set) {
  console.log(item);
}
```
**Answer:**
```
true
TypeError: set is not iterable
```
**Why:** `WeakSet.prototype.has` works normally for membership checks. But `WeakSet` (like `WeakMap`) deliberately does not implement the iterable protocol — there's no `Symbol.iterator` — because its contents can be silently removed by garbage collection at any time, making iteration order and completeness fundamentally unpredictable, so the language simply disallows it.
