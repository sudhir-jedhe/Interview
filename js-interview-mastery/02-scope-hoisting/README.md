## Scope & Hoisting

Scope determines where a variable is visible, and hoisting determines when it becomes usable — the two together explain some of the most commonly-tested JS gotchas, from `var`'s function-scoping quirks to the classic `for (var i...) setTimeout` bug. This topic covers how `var`, `let`, and `const` differ in scoping and re-declaration rules, how the engine "hoists" declarations before execution, and why `let`/`const` are hoisted into a Temporal Dead Zone rather than initialized like `var`. Interviewers use this area to see whether you understand JS execution in two phases (compile-then-execute) rather than treating code as running top-to-bottom in one pass. Getting this solid also makes closures (the next topic) far easier to reason about, since closures are built directly on top of scope chains.

**What's covered:**
- `var` vs `let` vs `const`: redeclaration, reassignment, block scope
- Function scope vs block scope vs global scope
- Hoisting mechanics: `var` (hoisted + initialized to `undefined`) vs `let`/`const` (hoisted but in the Temporal Dead Zone)
- Function declaration hoisting vs function expression hoisting
- Lexical scoping and the scope chain
- The classic `for (var i...) setTimeout` closure bug and how `let` fixes it

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
