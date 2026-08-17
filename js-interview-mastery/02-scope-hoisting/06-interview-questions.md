# Scope & Hoisting — Interview Q&A

**Q: What is hoisting?**
Hoisting is the behavior where variable and function declarations are processed during a "creation phase" before the code actually runs, making the identifiers exist in their scope from the very top — even though the assignment/definition still happens where it's written in the source. How each declaration type is initialized during hoisting (fully, as `undefined`, or not at all) differs by keyword.

**Q: What's the difference between how `var` and `let` are hoisted?**
Both are hoisted, meaning the engine is aware of them from the top of their scope. But `var` is also *initialized* to `undefined` immediately, so accessing it early gives `undefined`. `let` is hoisted but left uninitialized, sitting in the Temporal Dead Zone until its declaration line executes — accessing it early throws a `ReferenceError`.

**Q: What is the Temporal Dead Zone (TDZ)?**
The TDZ is the region of code between the start of a block and the point where a `let`/`const`/`class` declaration actually executes. During this window, the variable exists (it's been hoisted) but cannot be accessed — any reference throws `ReferenceError: Cannot access 'x' before initialization`. It exists to catch use-before-define bugs immediately rather than silently returning `undefined`.

**Q: What's the difference between function scope and block scope?**
Function scope means a variable is visible anywhere inside the entire function it's declared in, regardless of nested `if`/`for`/`while` blocks — this is how `var` behaves. Block scope means a variable is only visible within the nearest enclosing pair of curly braces — this is how `let` and `const` behave.

**Q: Can you redeclare a variable with `var`? What about `let`?**
Yes, `var` allows redeclaring the same variable name in the same scope with no error — the second declaration just overwrites the first. `let` (and `const`) throw a `SyntaxError` if you try to redeclare the same identifier in the same scope.

**Q: Why does the classic `for (var i = 0...) setTimeout(...)` loop log the same final value for every callback?**
Because `var` is function-scoped, there's only one `i` shared across all loop iterations. The loop runs to completion synchronously before any `setTimeout` callback fires (since timers are asynchronous), so by the time the callbacks run, they all read the same `i`, which now holds its final value. `let` fixes this because it creates a new binding of the loop variable for every iteration, so each closure captures a distinct value.

**Q: Are function declarations hoisted differently from function expressions?**
Yes. A function declaration (`function foo() {}`) is hoisted completely — name and implementation — so it's callable anywhere in its scope, even before its line in the source. A function expression (`const foo = function() {}` or an arrow function) is only hoisted according to the hoisting rules of the variable keyword used (`var`, `let`, or `const`) — the function value itself isn't available until the assignment line actually executes.

**Q: What is lexical scoping?**
Lexical scoping means a function's access to variables is determined by where the function is physically defined in the source code, not by where or how it's called. When a variable is looked up, JS walks the "scope chain" — from the function's own scope outward through each enclosing scope — based on the nesting structure of the code as written.

**Q: What happens if you access an undeclared variable versus a `let` variable in its TDZ?**
Accessing a truly undeclared variable throws `ReferenceError: x is not defined`. Accessing a `let`/`const` variable before its declaration (in the TDZ) throws a similarly-worded but semantically different error: `ReferenceError: Cannot access 'x' before initialization`. The distinction matters because the TDZ variable *does* exist in scope — it's just not yet initialized.

**Q: Does `var` attach to the global object? Does `let`?**
At the top level of a regular (non-module) script, `var x = 1` creates a property `window.x` (in browsers). `let x = 1` at the top level does not create a global object property, even though `x` is still accessible as a global variable — it lives in a separate mechanism called the "script scope" record, not on `window`.

**Q: What's an IIFE and how does it relate to scope?**
An Immediately Invoked Function Expression (`(function() { ... })()`) creates a new, isolated function scope that runs immediately and doesn't pollute the enclosing (often global) scope. Before block scoping existed via `let`/`const`, IIFEs were the standard way to create a scope for the purpose of avoiding variable collisions or capturing a per-iteration value in a loop.

**Q: If you `console.log(typeof someUndeclaredVar)`, does it throw?**
No — `typeof` on a completely undeclared identifier returns `'undefined'` without throwing, which is a special exception built into the `typeof` operator specifically for this case. However, `typeof` on a `let`/`const` variable that's in its TDZ *does* throw a `ReferenceError`, because the variable is known to exist in that scope, just not yet initialized.
