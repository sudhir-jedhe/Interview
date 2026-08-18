# Interview Q&A — Function Declaration Forms and IIFEs

**Q: What is an IIFE and what problem does it solve?**
An Immediately Invoked Function Expression is a function that's defined and called in the same expression: `(function() { ... })()`. It creates an isolated function scope that executes once, historically used to avoid leaking variables into the global scope before block-scoping (`let`/`const`) existed, and still used today to wrap one-off setup logic or top-level `async` code.

**Q: What's the difference between a function declaration and a function expression?**
A function declaration is a standalone statement (`function foo() {}`) that's fully hoisted, meaning it can be called before its line in the source. A function expression creates a function as part of an expression, most commonly assigned to a variable (`const foo = function() {}`), and is only hoisted according to that variable's declaration rules (`var`, `let`, or `const`), not as a callable function.

**Q: What does a named function expression give you that an anonymous one doesn't?**
A named function expression (`const f = function inner() { ... }`) can reference itself by its internal name for recursion, without that name leaking into the enclosing scope — only `f` is visible outside, `inner` is only visible inside the function body. This is particularly useful when you want safe self-reference even if the outer variable gets reassigned later.
