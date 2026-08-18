# Interview Q&A: bind deep dive

**Q: If you call `.bind()` twice on the same function, does the second bind override the first?**
No. The first `bind()` call permanently locks `this`; calling `.bind()` again on that already-bound function creates a new wrapper, but the original `this` binding still takes effect when it's finally invoked — you cannot re-bind an already-bound function's `this`.

**Q: What happens if you call a `bind`-created function with `new`?**
`new` binding takes precedence over the explicit binding `bind` set up. When a bound function is invoked with `new`, the engine ignores the bound `this` and constructs a brand-new object as usual (as if calling the original, un-bound function with `new`). Any arguments pre-filled by `bind`, however, are still applied.

**Q: Write a basic polyfill for `Function.prototype.bind`.**
```js
Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const originalFn = this;
  return function(...callArgs) {
    return originalFn.apply(thisArg, [...boundArgs, ...callArgs]);
  };
};
```
This captures the original function via closure (`this` inside `myBind` is the function it's called on), then returns a new function that, when eventually invoked, merges the pre-bound and newly-supplied arguments and calls the original function with `apply`, forcing the desired `this`. See `../problems/01-polyfills-mycall-myapply-mybind.md` for a `new`-aware version.

**Q: Why would you use `bind` instead of just wrapping a call in an arrow function, e.g. `() => obj.method()`?**
Both can fix `this` for a callback, but they behave differently if `obj` changes later — the arrow-function wrapper always looks up `obj.method` fresh at call time (so it reflects reassignment of `obj.method`), while `.bind()` captures the function reference and `this` at binding time and never re-reads it. `bind` is also slightly more idiomatic when you need to pass the reference itself around (rather than wrapping every call site), and is a common convention for pre-binding class methods in a constructor.
