# Interview Q&A: fundamentals

**Q: What do `call`, `apply`, and `bind` have in common?**
All three are methods available on every function (via `Function.prototype`) that let you explicitly specify what `this` should be inside that function, overriding whatever `this` would normally result from the call site. This is "explicit binding," one of the four rules for determining `this`.

**Q: What's the difference between `call` and `apply`?**
Both invoke the function immediately with an explicitly set `this`. The only difference is how additional arguments are passed: `call` takes them individually as a comma-separated list (`fn.call(thisArg, a, b, c)`), while `apply` takes them as a single array (`fn.apply(thisArg, [a, b, c])`).

**Q: What's the difference between `bind` and `call`/`apply`?**
`call` and `apply` invoke the function right away and return its result. `bind` does not invoke the function — it returns a new function with `this` (and optionally some leading arguments) permanently pre-set, which you can call later, any number of times, in any context.

**Q: How would you find the maximum value in an array using `apply`?**
`Math.max.apply(null, arrayOfNumbers)` — since `Math.max` expects individual arguments rather than an array, `apply` spreads the array into separate arguments for you. The modern equivalent using the spread operator is `Math.max(...arrayOfNumbers)`, which doesn't require `apply` at all.
