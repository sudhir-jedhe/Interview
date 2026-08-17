# Output-Based Questions: Design Patterns & Polyfills

```js
const Counter = (function () {
  let count = 0;
  return {
    inc: () => ++count,
  };
})();

const Counter2 = (function () {
  let count = 0;
  return {
    inc: () => ++count,
  };
})();

console.log(Counter.inc());
console.log(Counter.inc());
console.log(Counter2.inc());
```
**Answer:**
```
1
2
1
```
**Why:** Each IIFE invocation creates its own independent closure over its own `count` variable. `Counter` and `Counter2` are separate module instances with separate private state, so calling `inc` on one has no effect on the other's counter.

---

```js
class Single {
  static #instance;
  constructor(value) {
    if (Single.#instance) return Single.#instance;
    this.value = value;
    Single.#instance = this;
  }
}

const a = new Single(1);
const b = new Single(2);
console.log(a.value, b.value, a === b);
```
**Answer:**
```
1 1 true
```
**Why:** The first `new Single(1)` creates the real instance and caches it. The second call, `new Single(2)`, detects `Single.#instance` is already set and immediately returns that cached instance instead of constructing a new one — the constructor's `return` overrides the default "return the new `this`" behavior for constructors when returning an object. `b.value` is still `1` because `b` *is* `a`.

---

```js
function createEmitter() {
  const listeners = [];
  return {
    on(cb) { listeners.push(cb); },
    emit(x) { listeners.forEach(cb => cb(x)); },
  };
}

const bus = createEmitter();
bus.on((x) => console.log("A:", x));
bus.on((x) => console.log("B:", x));
bus.emit(1);
bus.on((x) => console.log("C:", x));
bus.emit(2);
```
**Answer:**
```
A: 1
B: 1
A: 2
B: 2
C: 2
```
**Why:** Each `emit` call snapshots the *current* `listeners` array at the time `forEach` runs. Listener "C" was registered after the first `emit(1)`, so it only receives the second emission. This demonstrates that the array is mutated in place, and new subscribers only get events emitted after they subscribed.

---

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

let count = 0;
const inc = debounce(() => { count++; console.log("ran, count =", count); }, 100);

inc();
inc();
inc();
setTimeout(() => console.log("final count:", count), 200);
```
**Answer:**
```
ran, count = 1
final count: 1
```
**Why:** Each call to `inc()` cancels the previously scheduled timer via `clearTimeout` and schedules a new one. Since all three calls happen synchronously (essentially at the same instant), only the last scheduled timer ever survives to fire — so `fn` runs exactly once, 100ms after the last `inc()` call, not three times.

---

```js
Array.prototype.myMap = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) out[i] = cb(this[i], i, this);
  }
  return out;
};

const sparse = [1, , 3]; // hole at index 1
console.log(sparse.myMap(x => x * 2));
console.log(sparse.myMap(x => x * 2).length);
```
**Answer:**
```
[ 2, <1 empty item>, 6 ]
3
```
**Why:** The `i in this` check skips index 1 because it's a genuine "hole" (never assigned), not a value of `undefined`. This matches native `Array.prototype.map`'s documented behavior of skipping holes in sparse arrays, so the callback is never invoked for that index, but the resulting array still has `length` 3 with a hole preserved at index 1.

---

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let remaining = promises.length;
    promises.forEach((p, i) => {
      p.then(v => {
        results[i] = v;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}

myPromiseAll([
  Promise.resolve(1),
  Promise.reject("fail"),
  Promise.resolve(3),
]).then(
  r => console.log("resolved:", r),
  e => console.log("rejected:", e)
);
```
**Answer:**
```
rejected: fail
```
**Why:** `Promise.all` semantics (correctly replicated here) mean the very first rejection immediately rejects the combined promise, regardless of whether other promises later resolve. The `.then(resolve, reject)` on the second promise fires `reject("fail")` as soon as that promise settles, short-circuiting the whole `myPromiseAll` call.

---

```js
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}

const log = throttle((n) => console.log("call", n), 1000);
log(1); // t=0
log(2); // t=0 (same tick)
log(3); // t=0 (same tick)
```
**Answer:**
```
call 1
```
**Why:** All three calls happen essentially at the same timestamp (`t=0`), well within the same 1000ms throttle window. Only the first call passes the `now - last >= interval` check (since `last` starts at `0` and `Date.now()` is a large positive number, technically the very first call always passes); the second and third calls are within the window and get dropped silently, with no trailing call scheduled (unlike debounce).
