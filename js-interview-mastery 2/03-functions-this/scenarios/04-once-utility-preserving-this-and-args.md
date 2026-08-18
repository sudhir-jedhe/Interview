# Building a `once(fn)` Utility That Preserves `this` and Arguments

**Scenario:** You need to write a `once(fn)` utility that ensures a given function only ever executes a single time, no matter how many times it's called afterward, and that it correctly preserves whatever `this` and arguments it's called with on that first (and only) real invocation. How would you implement it, and what edge cases matter?

**Approach:**

```js
function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args); // preserve caller's `this` and all arguments
    }
    return result;
  };
}

const initialize = once(function(config) {
  console.log('initializing with', config, 'this:', this?.name);
  return 'done';
});

const app = { name: 'MyApp' };
console.log(initialize.call(app, { debug: true })); // logs once, returns 'done'
console.log(initialize.call(app, { debug: false })); // no log, still returns 'done' from cache
```

This must be a regular function expression, not an arrow function, for the returned wrapper — an arrow function can't receive a dynamic `this` via `call`/`apply`, so it couldn't correctly forward the caller's context. Edge cases: (1) the return value of the *first* call must be cached and returned on subsequent calls, not `undefined`, since callers may rely on the result; (2) if `fn` throws on its first invocation, decide deliberately whether "called" should still become `true` (typically yes, to avoid retry storms) or whether you want a "retry until success" variant instead — that's a different utility; (3) `apply(this, args)` (not `call`) is used because `args` is already an array from the rest parameter, and `apply` accepts arguments as an array directly. A closure-focused version of this exact utility (without the `this`-forwarding emphasis) is also covered in the closures topic's `problems/01-once-utility.md`.
