# Interview Q&A: Mapped Types and Key Remapping

**Q1: What's the difference between `{ [K in keyof T]: T[K] }` and `{ [K in keyof T]: string }`?**
A: The first is an "identity" mapped type — it preserves each property's original value type via the indexed access `T[K]`, producing a shape identical to `T`. The second replaces every property's value type with `string` regardless of what it originally was, discarding the original types entirely. The difference matters because most useful mapped types keep `T[K]` (or a transformation of it) rather than a fixed type, so the result stays connected to the source type's actual value types.

**Q2: How do you remove a modifier (like `readonly`) that a mapped type would otherwise preserve?**
A: Prefix the modifier with `-`: `{ -readonly [K in keyof T]: T[K] }` strips `readonly`, and `{ [K in keyof T]-?: T[K] }` strips optionality. Without the `-` prefix, if the source type parameter already has that modifier on a given property, a plain mapped type over `keyof T` preserves it by default (this "preserve unless told otherwise" behavior is called homomorphic mapping).

**Q3: How would you build a type that only keeps the keys of `T` whose value type extends some type `V`, given that `Pick<T, K>` can't filter by value type?**
A: Use key remapping with a conditional in the `as` clause: `{ [K in keyof T as T[K] extends V ? K : never]: T[K] }`. For each key, check whether its *value* type is assignable to `V`; if so, keep the key (map it to itself); if not, map it to `never`, which mapped types drop from the resulting type entirely. This is the general technique behind any "pick/omit by value type" utility, which the standard library doesn't ship but is a very common custom utility in real codebases.

**Q4: Why does `Capitalize<K>` fail to compile when `K` comes from `keyof T`, and how do you fix it?**
A: `keyof T` produces a type of `string | number | symbol` in general (object keys can be any of those), but `Capitalize<S>` is constrained to accept only `S extends string`. Even if every actual key of `T` happens to be a string, the type checker doesn't narrow `K`'s declared type just because of that fact. The fix is intersecting with `string`: `Capitalize<string & K>` — for string keys this intersection is a no-op (a string literal intersected with `string` stays the same string literal), but it satisfies `Capitalize`'s constraint, and for a hypothetical numeric or symbol key, `string & K` collapses to `never`, which `Capitalize` also happily accepts (producing `never` in the output, effectively excluding that key).
