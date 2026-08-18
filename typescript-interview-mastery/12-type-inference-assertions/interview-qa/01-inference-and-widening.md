# Interview Q&A: Inference and Widening

**Q: What's the difference between contextual typing and best-common-type inference?**
A: Contextual typing pulls a type *into* an expression from its surrounding usage — like a callback parameter's type coming from the function signature it's passed to (`arr.map(x => ...)` infers `x` from `arr`'s element type). Best-common-type inference derives a type *from* the values themselves when there's no contextual type available, most visibly in array literals and function return statements, where TS looks at all the candidate types and picks the narrowest type that covers them (falling back to a union if no single type is a supertype of the rest).

**Q: Why does `let x = "hello"` produce type `string` while `const x = "hello"` produces type `"hello"`?**
A: `let` allows reassignment, so TypeScript widens the literal `"hello"` to its general base type `string` to accommodate any future string value the variable might hold. `const` can never be reassigned, so there's no future value to accommodate — TS keeps the exact literal type it observed.

**Q: If I write `const config = { mode: "prod" }`, why is `config.mode` typed as `string`, not `"prod"`, even though `config` is `const`?**
A: `const` only freezes the *binding* `config` from being reassigned; it doesn't make the object's properties immutable — `config.mode = "dev"` is still legal JS/TS. Because the property is mutable, TypeScript applies the same widening logic it uses for `let` variables to that property, inferring `string` instead of the literal `"prod"`. Use `as const` to override this and keep `mode` as `"prod"`.

**Q: Does TypeScript ever infer a common supertype for an array of different but related types?**
A: Only if one of the actual candidate types already *is* a supertype of the others. For `[new Dog(), new Cat()]`, TS infers `(Dog | Cat)[]`, not `Animal[]`, because neither `Dog` nor `Cat` is a supertype of the other — TS doesn't search the whole prototype/inheritance chain for a common ancestor. If you want `Animal[]`, you need an explicit contextual type, e.g. `const pets: Animal[] = [new Dog(), new Cat()]`.
