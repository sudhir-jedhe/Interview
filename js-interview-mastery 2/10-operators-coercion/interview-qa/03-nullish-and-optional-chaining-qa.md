# Interview Q&A: Nullish Coalescing & Optional Chaining

**Q: What's the key difference between `??` and `||`?**
`||` returns its right-hand operand if the left is *any* falsy value (`0`, `""`, `false`, `NaN`, `null`, `undefined`). `??` only returns the right-hand operand if the left is specifically `null` or `undefined` — it treats `0`, `""`, and `false` as valid, kept values. `??` exists precisely to fix the common bug where `||` was used for defaulting and incorrectly overrode legitimate falsy values.

**Q: Can you combine `??` directly with `&&` or `||` in the same expression?**
No — mixing `??` with `&&`/`||` without explicit parentheses is a `SyntaxError` by design, because their relative precedence would otherwise be ambiguous and error-prone. You must write `(a || b) ?? c` or `a || (b ?? c)` to disambiguate intent explicitly.

**Q: How does optional chaining (`?.`) handle method calls specifically?**
`obj.method?.()` checks whether `method` is `null`/`undefined` before attempting to call it — if it is, the entire expression short-circuits to `undefined` without throwing and without ever invoking the call (so any arguments or side effects inside the call are never evaluated). This differs from just `obj.method()`, which throws a `TypeError` if `method` doesn't exist.
