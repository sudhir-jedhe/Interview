# Interview Q&A: Non-Null Assertion and `satisfies`

**Q: What does the `!` non-null assertion operator actually do at runtime?**
A: Nothing — it's purely a compile-time instruction telling TypeScript to remove `null | undefined` from a value's type. It performs no check, throws no error, and has zero effect on the emitted JavaScript. If the value genuinely is `null`/`undefined` at runtime, the code proceeds as if it weren't, and the failure surfaces later as a generic `TypeError`, often far from where the false assumption was made.

**Q: When is `!` acceptable to use, and what's the safer alternative?**
A: It's defensible immediately after logic that guarantees non-nullness in a way TS's control-flow analysis can't follow across a function or closure boundary — e.g., after a loop you know executed at least once. Even then, an assertion *function* like `assertIsDefined(value)` (which throws a descriptive `Error` if the check fails) is safer than `!`, because it's an actual runtime guard rather than a silent compiler-only claim, and it's easy to grep for across a codebase.

**Q: What problem does `satisfies` solve that neither a type annotation nor a type assertion solves on its own?**
A: An annotation (`const x: T = value`) validates the value against `T` but replaces the *inferred* type of `x` with `T`'s declared type, widening away literal precision. An assertion (`value as T`) keeps precision but performs a much weaker compatibility check and doesn't verify every property actually matches `T`. `satisfies` does both: it validates the full value against `T` (catching typos and missing/extra properties) while keeping whatever the narrowest inferred type of the expression would have been, so you get literal-precise access afterward.

**Q: Give an example where `satisfies` catches a bug that `as` would miss.**
A: `const cfg = { mode: "prod" } as Config;` where `Config.mode` is `"production" | "development"` compiles with `as` even though `"prod"` doesn't match either literal — `as` only checks broad structural overlap, not that every literal value is valid. `const cfg = { mode: "prod" } satisfies Config;` fails to compile with a clear error, because `satisfies` performs full assignability checking against `Config`, the same as a normal annotation would, just without discarding the inferred type afterward.

**Q: Does `satisfies` change what type `x` has when you later read `x` back?**
A: No — after `const x = value satisfies T`, the *static type* of `x` for all later reads is the type TypeScript would have inferred for `value` on its own (narrowed literal types where applicable), not `T`. `satisfies` only participates in the assignability check at that one expression; it disappears from the type of `x` immediately afterward.
