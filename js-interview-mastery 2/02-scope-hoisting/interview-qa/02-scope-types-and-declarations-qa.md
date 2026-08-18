# Interview Q&A — Scope Types and Declaration Rules

**Q: What's the difference between function scope and block scope?**
Function scope means a variable is visible anywhere inside the entire function it's declared in, regardless of nested `if`/`for`/`while` blocks — this is how `var` behaves. Block scope means a variable is only visible within the nearest enclosing pair of curly braces — this is how `let` and `const` behave.

**Q: Can you redeclare a variable with `var`? What about `let`?**
Yes, `var` allows redeclaring the same variable name in the same scope with no error — the second declaration just overwrites the first. `let` (and `const`) throw a `SyntaxError` if you try to redeclare the same identifier in the same scope.

**Q: What is lexical scoping?**
Lexical scoping means a function's access to variables is determined by where the function is physically defined in the source code, not by where or how it's called. When a variable is looked up, JS walks the "scope chain" — from the function's own scope outward through each enclosing scope — based on the nesting structure of the code as written.

**Q: Does `var` attach to the global object? Does `let`?**
At the top level of a regular (non-module) script, `var x = 1` creates a property `window.x` (in browsers). `let x = 1` at the top level does not create a global object property, even though `x` is still accessible as a global variable — it lives in a separate mechanism called the "script scope" record, not on `window`.
