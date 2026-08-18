# Problem: Implement `once(fn)`

## Problem Statement

Implement a `once(fn)` utility that wraps a function so it can only ever execute a single time, no matter how many times the wrapper is called. Every call after the first must return the cached result of that first call without re-invoking `fn`.

## Requirements

- The first call to the wrapped function invokes `fn` and returns its result.
- Every subsequent call returns the same cached result without calling `fn` again.
- The wrapped function must forward whatever `this` and arguments it's called with on that first invocation.
- Works for functions with side effects (e.g. logging, initialization) where "only run once" is the actual point.

## Approach

Use a closure over two variables: a `called` flag and a `result` cache. The returned wrapper checks the flag before ever calling `fn`; once it has run, the flag flips permanently and every future call just returns the cached `result`, ignoring any new arguments.

## Solution

```js
function once(fn) {
  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args); // preserve caller's `this` and all arguments on the one real call
    }
    return result;
  };
}

module.exports = { once };

// --- verification ---
let initCount = 0;
const initialize = once(() => {
  initCount++;
  return 'initialized';
});

console.log(initialize()); // 'initialized'
console.log(initialize()); // 'initialized' — cached, fn not called again
console.log(initialize()); // 'initialized'
console.log('fn actually ran', initCount, 'time(s)'); // fn actually ran 1 time(s)

// this/arguments are preserved on the one real call
const app = { name: 'MyApp' };
const setup = once(function (config) {
  return `${this.name} configured with ${JSON.stringify(config)}`;
});
console.log(setup.call(app, { debug: true }));  // 'MyApp configured with {"debug":true}'
console.log(setup.call(app, { debug: false })); // same cached string — second call's args are ignored
```

**Why this works:** `called` and `result` live in the closure created by the outer `once(fn)` call, so they persist across every invocation of the returned wrapper without being visible or mutable from outside. Using `fn.apply(this, args)` rather than just `fn(...args)` ensures that if the original function relies on `this` (e.g. it's a method), the first real call gets the correct context — a detail that's easy to drop if the wrapper is written as an arrow function instead (arrow functions can't receive a dynamic `this` via `apply`/`call`, which is why the wrapper here is a regular `function`).
