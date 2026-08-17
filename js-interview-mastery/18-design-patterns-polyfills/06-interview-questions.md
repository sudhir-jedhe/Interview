# Interview Questions: Design Patterns & Polyfills

**Q: What is the module pattern and what problem does it solve?**
It uses an IIFE combined with closures to create a private scope for variables and functions, exposing only a deliberately chosen public API on a returned object. It solves the problem of keeping implementation details out of the global scope in environments without native module support, preventing naming collisions and accidental external mutation of internal state.

**Q: How would you implement a Singleton in JavaScript?**
Use a static private field on a class to cache the first-created instance, and have the constructor return that cached instance on subsequent calls instead of building a new object.
```js
class Singleton {
  static #instance;
  constructor() {
    if (Singleton.#instance) return Singleton.#instance;
    Singleton.#instance = this;
  }
}
```
In practice, ES module caching already gives you singleton behavior for free when you just export a plain object, which is often simpler than the class-based approach.

**Q: What is the observer (pub-sub) pattern, and where have you seen it used in real systems?**
It's a pattern where subscribers register interest in named events on a central emitter, and a publisher broadcasts events without needing direct references to each subscriber, decoupling producers from consumers. It shows up throughout the DOM's own event system, Node's `EventEmitter`, and state-management libraries (Redux's store subscriptions are effectively pub-sub).

**Q: What's the difference between the factory pattern and just calling `new SomeClass()` directly?**
A factory function centralizes and hides the logic of *which* concrete object to construct, letting callers ask for what they want conceptually ("give me a shape") without knowing the underlying class hierarchy. Calling `new` directly requires the caller to know and import the specific class, coupling the caller to implementation details a factory would hide.

**Q: Implement debounce.**
```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```
Every invocation cancels the previous pending timer and schedules a new one, so `fn` only fires once activity has stopped for `delay` milliseconds.

**Q: Implement throttle.**
```js
function throttle(fn, interval) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}
```
It tracks the timestamp of the last successful call and only invokes `fn` again once at least `interval` milliseconds have passed, silently ignoring calls that land inside the window.

**Q: Write a polyfill for `Array.prototype.map`.**
```js
Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== "function") throw new TypeError("callback is not a function");
  const result = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (i in this) result[i] = callback.call(thisArg, this[i], i, this);
  }
  return result;
};
```
Key correctness details: pass `(element, index, array)` to the callback, support `thisArg`, and skip holes in sparse arrays rather than calling the callback with `undefined`.

**Q: Write a polyfill for `Array.prototype.reduce`, including its edge cases.**
```js
Array.prototype.myReduce = function (callback, initialValue) {
  let acc = initialValue;
  let i = 0;
  if (acc === undefined) {
    if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value");
    acc = this[0];
    i = 1;
  }
  for (; i < this.length; i++) {
    if (i in this) acc = callback(acc, this[i], i, this);
  }
  return acc;
};
```
The tricky edge cases are: no `initialValue` provided (use the first array element and start from index 1), and calling `reduce` on an empty array with no `initialValue` (must throw a `TypeError`).

**Q: Write a polyfill for `Promise.all`.**
```js
function promiseAllPolyfill(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let remaining = promises.length;
    if (remaining === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(v => {
        results[i] = v;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}
```
It must preserve input order in the results array regardless of settle order, reject immediately on the first rejection, and treat non-promise values as already-resolved.

**Q: What's your general strategy when asked to write a polyfill you've never implemented before?**
Start from the documented behavior (arguments accepted, return value, `this` handling), implement the straightforward happy path first, then work through documented edge cases one at a time (empty input, wrong argument types, optional parameters) — testing each against how the real native method behaves. It's more valuable to talk through the edge cases out loud than to silently produce a perfect implementation, since it shows you understand the spec, not just the common case.

**Q: Why might you prefer the module pattern or an event emitter over just using global variables and functions?**
Global variables and functions pollute a shared namespace, risk name collisions between unrelated parts of a codebase or third-party scripts, and make it hard to reason about what can mutate shared state and from where. Encapsulating state behind closures (module pattern) or coordinating side effects through explicit events (pub-sub) makes dependencies visible and intentional instead of implicit and global.
