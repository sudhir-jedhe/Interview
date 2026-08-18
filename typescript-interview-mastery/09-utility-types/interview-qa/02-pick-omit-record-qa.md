# Interview Q&A: Pick, Omit, Record

**Q1: When would you prefer `Pick` over `Omit`, and vice versa?**
A: Prefer `Pick` when the subset you need is small and stable, or when you're working with sensitive data and want an explicit allowlist so new fields on the source type are private by default. Prefer `Omit` when you need "almost everything" and the excluded set is small and unlikely to need silent protection — it's more concise but doesn't protect you when the source type grows with new fields that should also have been excluded.

**Q2: Why does `Omit<T, K>` not require `K extends keyof T` the way `Pick<T, K>` does?**
A: `Omit`'s type parameter is declared as `Omit<T, K extends keyof any>` (i.e., `K extends string | number | symbol`), not `K extends keyof T`. This is intentional: it lets you omit a key that doesn't even exist on `T` yet without an error, which is useful when writing generic utility functions that omit a common key (like `"id"`) across many different types, some of which may not have that key. The trade-off is you lose the typo-catching safety that `Pick`'s stricter constraint gives you — omitting a misspelled key silently does nothing rather than erroring.

**Q3: What happens if you use `Record<string, V>` versus `Record<SomeUnion, V>` — are they interchangeable?**
A: No. `Record<string, V>` behaves like an open index signature — any string key is allowed, and there's no compile-time guarantee that any particular key is present, so `obj["missingKey"]` type-checks as `V` even though it's `undefined` at runtime (unless `noUncheckedIndexedAccess` is on). `Record<SomeUnion, V>` where `SomeUnion` is a closed set of string literals is exhaustive and closed — every member of `SomeUnion` must have an entry, and accessing an unlisted key is a compile error, not just a runtime surprise.

**Q4: How is `Omit` actually implemented in TypeScript's standard library, and why does that matter?**
A: `type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>` — it's built from `Pick` and `Exclude`, not a separate primitive. It matters because it shows utility types compose: `Exclude<keyof T, K>` computes "the keys of T that aren't in K," and `Pick` then selects exactly those keys. Understanding this composition is what lets you build custom variants, like an `OmitByValue<T, V>` that excludes keys whose *value type* (not key name) matches `V`.
