# call, apply, bind — Interview Q&A

**Q: What do `call`, `apply`, and `bind` have in common?**
All three are methods available on every function (via `Function.prototype`) that let you explicitly specify what `this` should be inside that function, overriding whatever `this` would normally result from the call site. This is "explicit binding," one of the four rules for determining `this`.

**Q: What's the difference between `call` and `apply`?**
Both invoke the function immediately with an explicitly set `this`. The only difference is how additional arguments are passed: `call` takes them individually as a comma-separated list (`fn.call(thisArg, a, b, c)`), while `apply` takes them as a single array (`fn.apply(thisArg, [a, b, c])`).

**Q: What's the difference between `bind` and `call`/`apply`?**
`call` and `apply` invoke the function right away and return its result. `bind` does not invoke the function — it returns a new function with `this` (and optionally some leading arguments) permanently pre-set, which you can call later, any number of times, in any context.

**Q: How would you find the maximum value in an array using `apply`?**
`Math.max.apply(null, arrayOfNumbers)` — since `Math.max` expects individual arguments rather than an array, `apply` spreads the array into separate arguments for you. The modern equivalent using the spread operator is `Math.max(...arrayOfNumbers)`, which doesn't require `apply` at all.

**Q: What is "method borrowing" and how do `call`/`apply` enable it?**
Method borrowing means calling a method that belongs to one type (usually `Array.prototype`) on an object of a different type by explicitly setting `this` to that object — for example, `Array.prototype.slice.call(arguments)` to convert the array-like `arguments` object into a real array. It works because most array methods don't check that `this` is truly an `Array`; they just require indexed properties and a `.length`.

**Q: What is partial application, and how does `bind` support it?**
Partial application means fixing some of a function's arguments ahead of time, producing a new function that only needs the remaining arguments. `bind` supports this natively: any arguments passed to `bind()` after the `thisArg` are pre-filled as the leading arguments of the returned function, e.g. `const double = multiply.bind(null, 2)`.

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
This captures the original function via closure (`this` inside `myBind` is the function it's called on), then returns a new function that, when eventually invoked, merges the pre-bound and newly-supplied arguments and calls the original function with `apply`, forcing the desired `this`.

**Q: Why would you use `bind` instead of just wrapping a call in an arrow function, e.g. `() => obj.method()`?**
Both can fix `this` for a callback, but they behave differently if `obj` changes later — the arrow-function wrapper always looks up `obj.method` fresh at call time (so it reflects reassignment of `obj.method`), while `.bind()` captures the function reference and `this` at binding time and never re-reads it. `bind` is also slightly more idiomatic when you need to pass the reference itself around (rather than wrapping every call site), and is a common convention for pre-binding class methods in a constructor.

**Q: Why is `apply` sometimes preferred over the spread operator for forwarding arguments?**
In modern JS they're largely interchangeable for this purpose (`fn.apply(thisArg, argsArray)` vs `fn.call(thisArg, ...argsArray)`), but `apply` remains useful when you need to forward a genuinely dynamic, unknown-length array of arguments while also controlling `this`, particularly in code that predates spread syntax or needs to interoperate with array-like objects that aren't true arrays.

**Q: What error do you get if you pass a non-array-like second argument to `apply`?**
A `TypeError`, since `apply`'s second argument is internally processed via `CreateListFromArrayLike`, which requires an object (an array, array-like object, `null`, or `undefined`) — passing something like a bare number or a primitive that isn't array-like throws.
