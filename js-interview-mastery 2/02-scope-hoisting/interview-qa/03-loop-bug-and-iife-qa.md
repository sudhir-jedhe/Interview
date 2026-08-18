# Interview Q&A — The `var` Loop Bug and IIFEs

**Q: Why does the classic `for (var i = 0...) setTimeout(...)` loop log the same final value for every callback?**
Because `var` is function-scoped, there's only one `i` shared across all loop iterations. The loop runs to completion synchronously before any `setTimeout` callback fires (since timers are asynchronous), so by the time the callbacks run, they all read the same `i`, which now holds its final value. `let` fixes this because it creates a new binding of the loop variable for every iteration, so each closure captures a distinct value.

**Q: Are function declarations hoisted differently from function expressions?**
Yes. A function declaration (`function foo() {}`) is hoisted completely — name and implementation — so it's callable anywhere in its scope, even before its line in the source. A function expression (`const foo = function() {}` or an arrow function) is only hoisted according to the hoisting rules of the variable keyword used (`var`, `let`, or `const`) — the function value itself isn't available until the assignment line actually executes.

**Q: What's an IIFE and how does it relate to scope?**
An Immediately Invoked Function Expression (`(function() { ... })()`) creates a new, isolated function scope that runs immediately and doesn't pollute the enclosing (often global) scope. Before block scoping existed via `let`/`const`, IIFEs were the standard way to create a scope for the purpose of avoiding variable collisions or capturing a per-iteration value in a loop. See `../problems/02-module-pattern-counter-iife.md` for a fuller example of this pattern used to build private state.
