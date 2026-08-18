# Interview Q&A — Hoisting and the TDZ

**Q: What is hoisting?**
Hoisting is the behavior where variable and function declarations are processed during a "creation phase" before the code actually runs, making the identifiers exist in their scope from the very top — even though the assignment/definition still happens where it's written in the source. How each declaration type is initialized during hoisting (fully, as `undefined`, or not at all) differs by keyword.

**Q: What's the difference between how `var` and `let` are hoisted?**
Both are hoisted, meaning the engine is aware of them from the top of their scope. But `var` is also *initialized* to `undefined` immediately, so accessing it early gives `undefined`. `let` is hoisted but left uninitialized, sitting in the Temporal Dead Zone until its declaration line executes — accessing it early throws a `ReferenceError`.

**Q: What is the Temporal Dead Zone (TDZ)?**
The TDZ is the region of code between the start of a block and the point where a `let`/`const`/`class` declaration actually executes. During this window, the variable exists (it's been hoisted) but cannot be accessed — any reference throws `ReferenceError: Cannot access 'x' before initialization`. It exists to catch use-before-define bugs immediately rather than silently returning `undefined`.

**Q: What happens if you access an undeclared variable versus a `let` variable in its TDZ?**
Accessing a truly undeclared variable throws `ReferenceError: x is not defined`. Accessing a `let`/`const` variable before its declaration (in the TDZ) throws a similarly-worded but semantically different error: `ReferenceError: Cannot access 'x' before initialization`. The distinction matters because the TDZ variable *does* exist in scope — it's just not yet initialized.

**Q: If you `console.log(typeof someUndeclaredVar)`, does it throw?**
No — `typeof` on a completely undeclared identifier returns `'undefined'` without throwing, which is a special exception built into the `typeof` operator specifically for this case. However, `typeof` on a `let`/`const` variable that's in its TDZ *does* throw a `ReferenceError`, because the variable is known to exist in that scope, just not yet initialized.
