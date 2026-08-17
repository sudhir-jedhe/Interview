## Closures

A closure is a function bundled together with references to its surrounding (lexical) environment — it lets a function keep accessing variables from an outer scope even after that outer function has finished running. Closures are the mechanism behind private state, counters/factories, memoization, currying, and the module pattern, and they underpin most idiomatic JS state-management code, including the classic `for (var i...)` loop bug you've likely already met in the scope/hoisting topic. This is one of the most heavily tested interview topics because it requires connecting several ideas at once — scope, execution context, and garbage collection — into a single coherent mental model, and it's also directly useful in day-to-day code for encapsulating state without classes.

**What's covered:**
- Precise definition of a closure (function + its lexical environment)
- How closures retain access to outer variables after the outer function returns
- Practical uses: private variables, counters/factories, memoization, currying, the module pattern
- Event handler state via closures
- The classic `for (var i=0...)` closure bug in loops and both fixes (`let`, or IIFE)
- Memory implications of closures (brief teaser — full topic covered elsewhere)

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
