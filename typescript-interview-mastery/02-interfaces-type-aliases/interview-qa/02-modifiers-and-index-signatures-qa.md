# Interview Q&A: Modifiers and Index Signatures

**Q: What's the difference between a property typed `field?: string` and `field: string | undefined`?**
A: `field?: string` means the property may be entirely absent from the object — it can be omitted from an object literal, and `"field" in obj` can be `false`. `field: string | undefined` means the property must always be present as a key, but its value may be `undefined`. This distinction matters for things like `Object.keys()`, `JSON.stringify()` (which omits missing optional keys but serializes explicit `undefined` values inconsistently across engines), and spread-based object construction, where an optional key genuinely absent behaves differently from a required key holding `undefined`.

**Q: Does `readonly` provide runtime immutability?**
A: No — `readonly` is a compile-time-only construct. It prevents the TypeScript compiler from allowing reassignment through typed code, but it does not freeze the underlying object at runtime. A value cast with `as any`, plain JavaScript code with no type checking, or `Object.assign` can still mutate a `readonly` property. For genuine runtime immutability, you'd need `Object.freeze()` in addition to the `readonly` type annotation — the two serve complementary but distinct purposes (compile-time intent vs runtime enforcement).

**Q: What's the risk of using a plain index signature like `{ [key: string]: number }`?**
A: By default, TypeScript lets you read any string-keyed property from a type with an index signature and reports the result as the value type (`number`), even for keys that were never actually set — the actual runtime value would be `undefined`. This is a soundness gap: the type system claims more certainty than it can guarantee. The fix is enabling `noUncheckedIndexedAccess` in `tsconfig.json`, which makes every index-signature read return `T | undefined` instead, forcing an explicit check before use.

**Q: When would you use `Record<K, V>` instead of an index signature?**
A: When the set of keys is small and known ahead of time — `Record<"small" | "medium" | "large", number>` requires exactly those three keys to be present, which an index signature cannot express (an index signature allows *any* string key, not a specific closed set). Reach for `Record` with a literal union when you want a fixed, required key set with shared value type; reach for a raw index signature only when keys are genuinely open-ended and unbounded.
