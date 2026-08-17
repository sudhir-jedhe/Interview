# Closures — Interview Q&A

**Q: What is a closure?**
A closure is a function combined with a reference to its surrounding lexical environment — the scope in which it was defined. Every function in JavaScript forms a closure automatically at creation time; the term becomes meaningful when a function is used outside its defining scope (returned from another function, stored, or passed as a callback) and still has access to the variables from that outer scope.

**Q: How does a closure keep a variable "alive" after its enclosing function returns?**
Normally a function's local variables are eligible for garbage collection once the function returns, since nothing references them anymore. But if an inner function that references those variables is returned or otherwise kept reachable (e.g. stored in a variable, attached as an event handler), the JS engine keeps those variables in memory for as long as that inner function itself remains reachable.

**Q: Give a practical example of using a closure for data privacy.**
A factory function can declare local variables and return an object of functions that read/write them, without exposing the variables themselves — for example, a `createCounter()` function with a private `count` variable and returned `increment`/`getCount` methods. There's no syntax to access `count` from outside; it's only reachable through the functions that closed over it.

**Q: Why does `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }` log `3, 3, 3` instead of `0, 1, 2`?**
`var` creates a single, function-scoped (in this case, effectively global) binding for `i`, shared by every iteration of the loop. All three arrow functions close over that same `i`. Since the timeouts fire only after the loop has fully finished (synchronous code always runs first), by the time any callback executes, `i` holds its final post-loop value, `3`.

**Q: How does switching to `let` fix that loop bug?**
`let` is block-scoped and, specifically for `for` loops, the spec defines that each iteration gets its own fresh binding of the loop variable, initialized from the previous iteration's value. Each closure created inside the loop body therefore captures its own distinct `i`, so the callbacks log `0`, `1`, `2` as expected.

**Q: How would you fix the same bug without using `let`, e.g. in an environment restricted to ES5?**
Wrap the loop body in an IIFE that takes the current value of `i` as a parameter, creating a new function scope — and thus a new closure — for each iteration: `(function(n) { setTimeout(() => console.log(n), 0); })(i);`. The parameter `n` is a fresh, independent variable per IIFE call, isolating each callback's captured value.

**Q: What is memoization and how do closures enable it?**
Memoization is caching a function's return value keyed by its input, so repeated calls with the same input skip recomputation. A closure over a cache object (e.g. a `Map`) lets the memoized wrapper function persist that cache across every call, without exposing the cache to outside code.

**Q: What is currying, and how does it rely on closures?**
Currying transforms a function that takes multiple arguments into a sequence of functions that each take one argument, returning a new function until all arguments are supplied. Each returned function closes over the arguments accumulated so far from the outer calls, which is what lets `add(1)(2)(3)` work — each nested function remembers the previous arguments via closure.

**Q: Can closures cause memory leaks? How?**
Yes. Since a closure keeps its captured variables alive as long as the closure itself is reachable, a long-lived closure (e.g. attached as a persistent event listener or stored in a global cache) that references a large object will keep that entire object in memory, even if only a small piece of it is actually used. This becomes a leak if the closure is never released (e.g. the listener is never removed) while the app continues running.

**Q: What's the difference between a closure and simply passing arguments to a function?**
Arguments give a function a one-time snapshot of values passed at call time. A closure gives a function ongoing, live access to variables in an outer scope — if that outer variable changes after the closure is created, the closure sees the updated value on its next access, because it holds a reference to the variable itself, not a copy of its value at creation time.

**Q: What's the "module pattern" and how does it use closures?**
The module pattern is a design pattern (predating ES modules) where a function is used to create a private scope, and the function returns an object exposing only the methods intended to be public, while private data stays enclosed in the function's local scope, accessible to those methods via closure. It was the standard way to achieve encapsulation in JS before native modules and class private fields existed.

**Q: If you have two separate calls to the same factory function, do the closures they create share state?**
No — each call to the factory function creates a brand-new execution context with its own local variables, and the closures returned from that call reference that specific instance's variables. Two calls to `makeCounter()`, for example, produce two counters with completely independent `count` variables.
