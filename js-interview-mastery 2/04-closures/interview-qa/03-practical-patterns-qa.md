# Interview Q&A — Practical Closure Patterns

**Q: Give a practical example of using a closure for data privacy.**
A factory function can declare local variables and return an object of functions that read/write them, without exposing the variables themselves — for example, a `createCounter()` function with a private `count` variable and returned `increment`/`getCount` methods. There's no syntax to access `count` from outside; it's only reachable through the functions that closed over it.

**Q: What is memoization and how do closures enable it?**
Memoization is caching a function's return value keyed by its input, so repeated calls with the same input skip recomputation. A closure over a cache object (e.g. a `Map`) lets the memoized wrapper function persist that cache across every call, without exposing the cache to outside code.

**Q: What is currying, and how does it rely on closures?**
Currying transforms a function that takes multiple arguments into a sequence of functions that each take one argument, returning a new function until all arguments are supplied. Each returned function closes over the arguments accumulated so far from the outer calls, which is what lets `add(1)(2)(3)` work — each nested function remembers the previous arguments via closure.

**Q: What's the "module pattern" and how does it use closures?**
The module pattern is a design pattern (predating ES modules) where a function is used to create a private scope, and the function returns an object exposing only the methods intended to be public, while private data stays enclosed in the function's local scope, accessible to those methods via closure. It was the standard way to achieve encapsulation in JS before native modules and class private fields existed.
