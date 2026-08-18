# Interview Q&A: Exclude, Extract, NonNullable

**Q1: `Exclude` and `Omit` sound similar. What's the actual difference?**
A: `Omit` operates on object *keys* to produce a new object type with fewer properties. `Exclude` operates on *union members* to produce a new union with fewer variants. Using `Omit` on a union type (e.g. `Omit<"a" | "b", "a">`) does not do what you'd expect, because `keyof` on a string-literal union resolves to `String.prototype` members, not the literal values — this is a common bug (see the `06-exclude-vs-omit.md` output-based problem in this topic).

**Q2: Why is `Exclude<T, U> = T extends U ? never : T` distributive, and why does that matter?**
A: Because `T` is a "naked" type parameter directly in front of `extends` in the conditional. When TypeScript sees this pattern and `T` is instantiated with a union, it distributes the conditional over each member of the union individually and unions the results, rather than checking the whole union against `U` at once. This is what makes `Exclude<"a" | "b" | "c", "b">` correctly filter member-by-member instead of evaluating `("a" | "b" | "c") extends "b"` as a single (false) check that would return the whole union unfiltered.

**Q3: Give a realistic use case for `Extract` beyond narrowing string unions.**
A: Pulling a specific variant (or set of variants) out of a discriminated union of event or action objects — e.g., `type ErrorActions = Extract<AppAction, { type: "FETCH_ERROR" | "SAVE_ERROR" }>` to get a sub-union of only the error-shaped actions for a dedicated error-handling reducer, without hand-duplicating those action object shapes.

**Q4: Why can't you always rely on TypeScript's control-flow narrowing instead of using `NonNullable<T>` explicitly?**
A: Control-flow narrowing only works within a single function/scope where the compiler can see the check. Once a value crosses a function boundary — passed into a generic helper, stored and read back from a class field, or returned from a callback — the narrowing information is lost unless the function's signature encodes it. `NonNullable<T>` lets you express "the caller has already ruled out null/undefined" directly in a generic function's return type (e.g., `function assertPresent<T>(v: T): NonNullable<T>`), which narrowing alone can't do across that boundary.
