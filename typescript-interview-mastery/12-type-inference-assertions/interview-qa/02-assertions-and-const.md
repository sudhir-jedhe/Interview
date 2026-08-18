# Interview Q&A: Assertions and `as const`

**Q: Why is `<Type>value` avoided in modern TypeScript in favor of `value as Type`?**
A: The angle-bracket syntax is ambiguous with JSX syntax — in a `.tsx` file, `<Type>value` can't be distinguished from opening a JSX tag, so it isn't supported there at all. `as` works consistently in both `.ts` and `.tsx` files, so teams standardize on it everywhere for consistency, even in plain `.ts` files where the ambiguity doesn't technically exist.

**Q: What's the difference between `value as Type` and `value as unknown as Type`?**
A: A single assertion (`as Type`) is only allowed when the source and target types "sufficiently overlap" — one must be a subtype of the other — so TypeScript still catches egregiously wrong conversions (like `"hello" as number`). Routing through `unknown` first (`as unknown as Type`) sidesteps that check entirely, since `unknown` is compatible with everything in both directions. It compiles for *any* target type, which is exactly why it's a red flag in code review: it disables the one safety check plain assertions still provide.

**Q: What does `as const` actually change about a value's type?**
A: Two things: it infers literal types instead of widened base types for every primitive value in the expression (so `"a"` stays `"a"` instead of becoming `string`), and it makes every property/element in an object or array `readonly`, recursively. For an array, this also converts it from a mutable `T[]` to a fixed-length `readonly [...]` tuple.

**Q: Is `as const` a runtime operation?**
A: No — like all TypeScript assertions, it's erased completely during compilation and has zero effect on the emitted JavaScript. It only changes what the *type checker* believes about the value; if you need actual runtime immutability, you still need `Object.freeze()` (and even that is shallow unless applied recursively).

**Q: Can you use `as const` on a function call's return value?**
A: Yes, if the expression is a literal at that point — e.g. `return { status: "ok" } as const;` works because it's an object literal. You cannot retroactively apply `as const` to change how a *previously inferred and widened* variable behaves; it only affects the literal expression it's attached to at the point of assertion.
