# Interview Q&A — Closure Fundamentals

**Q: What is a closure?**
A closure is a function combined with a reference to its surrounding lexical environment — the scope in which it was defined. Every function in JavaScript forms a closure automatically at creation time; the term becomes meaningful when a function is used outside its defining scope (returned from another function, stored, or passed as a callback) and still has access to the variables from that outer scope.

**Q: How does a closure keep a variable "alive" after its enclosing function returns?**
Normally a function's local variables are eligible for garbage collection once the function returns, since nothing references them anymore. But if an inner function that references those variables is returned or otherwise kept reachable (e.g. stored in a variable, attached as an event handler), the JS engine keeps those variables in memory for as long as that inner function itself remains reachable.

**Q: What's the difference between a closure and simply passing arguments to a function?**
Arguments give a function a one-time snapshot of values passed at call time. A closure gives a function ongoing, live access to variables in an outer scope — if that outer variable changes after the closure is created, the closure sees the updated value on its next access, because it holds a reference to the variable itself, not a copy of its value at creation time.

**Q: If you have two separate calls to the same factory function, do the closures they create share state?**
No — each call to the factory function creates a brand-new execution context with its own local variables, and the closures returned from that call reference that specific instance's variables. Two calls to `makeCounter()`, for example, produce two counters with completely independent `count` variables.
