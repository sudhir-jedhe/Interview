# Interview Q&A: Operators & Truthy/Falsy

**Q: List all the falsy values in JavaScript.**
There are exactly eight: `false`, `0`, `-0`, `0n` (BigInt zero), `""` (empty string), `null`, `undefined`, and `NaN`. Every other value — including `"0"`, `"false"`, `[]`, and `{}` — is truthy.

**Q: Why does `+` behave differently from `-`, `*`, and `/` with string operands?**
`+` is overloaded in the spec to mean "string concatenation" whenever either operand is (or coerces to) a string. Every other arithmetic operator has no such string behavior defined — they always coerce both operands to numbers first, regardless of type. That's why `"5" + 3` is `"53"` but `"5" - 3` is `2`.

**Q: How does the ternary operator interact with operator precedence and readability?**
`condition ? a : b` is a single expression with fairly low precedence, so it's usually the outermost part of a larger expression rather than needing extra parentheses around the condition. It's ideal for simple, single-level conditional assignment or JSX-style inline rendering; nesting ternaries (`a ? b : c ? d : e`) is technically valid but widely considered a readability hazard, and most style guides recommend an `if`/`else` or a lookup structure instead once you need more than one level.

**Q: Why does `1 < 2 < 3` evaluate to `true` but people sometimes expect chained-comparison behavior from other languages?**
Relational operators in JS are left-associative and don't support true chaining — `1 < 2 < 3` evaluates as `(1 < 2) < 3`, which is `true < 3`, and since `true` coerces to `1` in a numeric comparison, that becomes `1 < 3`, which is `true` (correctly, but only "by accident" for this particular example — `3 > 2 > 1` demonstrates the trap more clearly, evaluating to `false`). Languages like Python support genuine chained comparisons; JavaScript does not, so each `<`/`>` must be written as its own explicit boolean expression joined with `&&`.
