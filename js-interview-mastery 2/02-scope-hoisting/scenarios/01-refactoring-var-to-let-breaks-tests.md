# Blindly Replacing `var` with `let` Breaks Two Tests

**Scenario:** You inherit a legacy codebase full of `var`. During a refactor, you blindly find-and-replace every `var` with `let`, run the test suite, and two unrelated tests start failing. What likely broke, and how do you investigate?

**Approach:** The most likely culprit is code that relies on `var`'s function-scoping and redeclaration tolerance — behaviors `let` doesn't have. Two common breakages: (1) the same variable name declared with `var` twice in the same function (common in older code, e.g. two separate `for (var i ...)` loops in one function reusing `i`) now throws `SyntaxError: Identifier 'i' has already been declared` because `let` forbids redeclaration in the same scope; (2) code that reads a `var` from outside the block it was "really" declared in (e.g. a `var result` declared inside an `if`, then read after the `if` block) now throws a TDZ `ReferenceError` or `ReferenceError: result is not defined` because `let` is block-scoped.

```js
// Breaks after var -> let:
function process(items) {
  if (items.length > 0) {
    let result = items[0]; // was var
  }
  return result; // ReferenceError: result is not defined
}
```

Investigation approach: run the failing tests individually with the actual error message (don't just see "test failed") — `SyntaxError`/`ReferenceError` messages point directly at the offending line. Then decide per-case: if the variable is genuinely meant to leak across blocks, declare it once at the top of the function scope with `let`; if a variable name was reused as a "scratch" variable, give each usage a distinct name. Doing a blind replace across a whole codebase without running tests incrementally (module by module) makes this much harder to isolate.
