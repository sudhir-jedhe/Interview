# Interview Questions: Operators & Coercion

**Q: What's the difference between `==` and `===`?**
`===` (strict equality) never performs type coercion — if the operands are different types, it immediately returns `false`. `==` (loose equality) applies the Abstract Equality Comparison algorithm, which can coerce one or both operands (string-to-number, boolean-to-number, object-to-primitive) before comparing. The general best practice is to always use `===`, with the one common exception of `x == null` as a concise way to check for both `null` and `undefined` at once.

**Q: Why is `null == undefined` true but `null === undefined` false?**
The spec special-cases `null` and `undefined` in the `==` algorithm: they're defined to be loosely equal to each other and to nothing else — not `0`, not `false`, not `""`. `===` requires identical types, and `null` and `undefined` are distinct types (`"object"` and `"undefined"` respectively via `typeof`), so strict equality is always `false` between them.

**Q: List all the falsy values in JavaScript.**
There are exactly eight: `false`, `0`, `-0`, `0n` (BigInt zero), `""` (empty string), `null`, `undefined`, and `NaN`. Every other value — including `"0"`, `"false"`, `[]`, and `{}` — is truthy.

**Q: Why is `[] == false` true?**
Comparing an object (`[]`) to a boolean (`false`) triggers coercion on both sides: `[]` is converted via `ToPrimitive` to `""` (an array's default string conversion joins its elements, and an empty array joins to an empty string), and `false` is converted to the number `0`. The comparison then re-runs as `"" == 0`, which coerces `""` to `0` as well, landing on `0 == 0`, which is `true`.

**Q: Why does `+` behave differently from `-`, `*`, and `/` with string operands?**
`+` is overloaded in the spec to mean "string concatenation" whenever either operand is (or coerces to) a string. Every other arithmetic operator has no such string behavior defined — they always coerce both operands to numbers first, regardless of type. That's why `"5" + 3` is `"53"` but `"5" - 3` is `2`.

**Q: What's the key difference between `??` and `||`?**
`||` returns its right-hand operand if the left is *any* falsy value (`0`, `""`, `false`, `NaN`, `null`, `undefined`). `??` only returns the right-hand operand if the left is specifically `null` or `undefined` — it treats `0`, `""`, and `false` as valid, kept values. `??` exists precisely to fix the common bug where `||` was used for defaulting and incorrectly overrode legitimate falsy values.

**Q: Can you combine `??` directly with `&&` or `||` in the same expression?**
No — mixing `??` with `&&`/`||` without explicit parentheses is a `SyntaxError` by design, because their relative precedence would otherwise be ambiguous and error-prone. You must write `(a || b) ?? c` or `a || (b ?? c)` to disambiguate intent explicitly.

**Q: How does optional chaining (`?.`) handle method calls specifically?**
`obj.method?.()` checks whether `method` is `null`/`undefined` before attempting to call it — if it is, the entire expression short-circuits to `undefined` without throwing and without ever invoking the call (so any arguments or side effects inside the call are never evaluated). This differs from just `obj.method()`, which throws a `TypeError` if `method` doesn't exist.

**Q: Why is `NaN === NaN` false, and how do you correctly check for `NaN`?**
By IEEE-754 definition, `NaN` (Not-a-Number) is defined to be unequal to every value, including itself — this is a hardware-level floating-point spec rule, not a JavaScript-specific quirk. The correct check is `Number.isNaN(value)`, which tests specifically for the `NaN` value without coercion (unlike the legacy global `isNaN`, which coerces its argument first and can give false positives for non-numeric strings).

**Q: What does `typeof null` return, and why is that considered a bug?**
`typeof null` returns `"object"`, which is famously wrong — `null` is a primitive, not an object. It's a bug baked into the very first JavaScript implementation (an artifact of how values were internally tagged) that can never be fixed now without breaking the web, since so much existing code implicitly depends on the current behavior.

**Q: How does the ternary operator interact with operator precedence and readability?**
`condition ? a : b` is a single expression with fairly low precedence, so it's usually the outermost part of a larger expression rather than needing extra parentheses around the condition. It's ideal for simple, single-level conditional assignment or JSX-style inline rendering; nesting ternaries (`a ? b : c ? d : e`) is technically valid but widely considered a readability hazard, and most style guides recommend an `if/else` or a lookup structure instead once you need more than one level.

**Q: Why does `1 < 2 < 3` evaluate to `true` but people sometimes expect chained-comparison behavior from other languages?**
Relational operators in JS are left-associative and don't support true chaining — `1 < 2 < 3` evaluates as `(1 < 2) < 3`, which is `true < 3`, and since `true` coerces to `1` in a numeric comparison, that becomes `1 < 3`, which is `true` (correctly, but only "by accident" for this particular example — `3 > 2 > 1` demonstrates the trap more clearly, evaluating to `false`). Languages like Python support genuine chained comparisons; JavaScript does not, so each `<`/`>` must be written as its own explicit boolean expression joined with `&&`.
