# Narrowing pitfalls and assertion functions

**Q: Why does narrowing a variable, then referencing it inside a `setTimeout` or `.then()` callback defined afterward, sometimes fail to compile?**
A: Narrowing is only valid for code paths the compiler can statically trace as running immediately after the check, with nothing in between able to change the value. A callback runs at some later, indeterminate point — the compiler can't prove the variable wasn't reassigned in the gap between the narrowing check and the callback's actual execution, so for any mutable binding (a `let` or a reassignable parameter) it conservatively discards the narrowing inside the callback.

**Q: What's the standard fix for narrowing lost inside a closure?**
A: Assign the narrowed value to a new `const` binding immediately after the check, and reference that `const` inside the closure instead of the original variable. Since a `const` can never be reassigned, the compiler can safely guarantee its narrowed type holds for as long as the binding exists, including inside any closures that capture it later.

**Q: How does an assertion function (`asserts x is Foo`) differ from a type guard (`x is Foo`) in how it's used?**
A: A type guard returns a boolean you check inside an `if`/`else`, narrowing only within the branch where the check passed. An assertion function narrows for the *entire rest of the enclosing scope* simply by being called, with no `if` needed — it works by throwing if the condition fails, so the compiler can assume, for any code reachable after the call, that the assertion held (since otherwise the function would have thrown and execution wouldn't reach that code).

**Q: When would you choose an assertion function over a type guard for validating input?**
A: When the invalid case is genuinely exceptional and should halt execution rather than be handled as a normal branch — input validation at a function's entry point, invariant checks, or exhaustiveness helpers like `assertNever`. A type guard is the better fit when both the true and false outcomes are legitimate, expected paths your code needs to branch on and handle, rather than one side representing a bug or unrecoverable state.
