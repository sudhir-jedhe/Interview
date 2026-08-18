# Interview Q&A: Conditional Types and infer

**Q1: What does `T extends U` actually mean in a conditional type — is it the same as class inheritance?**
A: No. It means "every value describable by `T` is assignable to `U`" — structural compatibility, not nominal inheritance. `"hello" extends string` is true because every string literal is assignable to `string`; there's no class hierarchy involved. This trips up developers coming from languages where `extends` only ever means class inheritance.

**Q2: Where exactly can `infer` be used, and what does it do?**
A: `infer` can only appear inside the `extends` clause of a conditional type, as part of a structural pattern being matched against the checked type. It introduces a new type variable that TypeScript solves for based on what would make the pattern match — e.g., in `T extends Promise<infer V> ? V : T`, if `T` is `Promise<number>`, TypeScript determines `V` must be `number` for the pattern `Promise<infer V>` to match `Promise<number>`, then makes `V` available in the "true" branch.

**Q3: What happens if a conditional type with `infer` doesn't match the pattern at all?**
A: The "false" branch is taken, and `infer` never resolves to anything (it's irrelevant in that branch). For example, `type Elem<T> = T extends (infer E)[] ? E : never` applied to `Elem<boolean>` doesn't match the array pattern, so it falls through to `never` without ever trying to infer `E`.

**Q4: Can you infer more than one type variable in a single conditional type, and give an example of why you would?**
A: Yes — a single `extends` pattern can contain multiple `infer` positions, as long as the overall structure is one pattern being matched. Example: `type SplitHead<T> = T extends [infer Head, ...infer Tail] ? { head: Head; tail: Tail } : never` captures both the first element and the rest of a tuple in one match, useful for recursive tuple-processing utilities (e.g., building a `Length<T>` or `Reverse<T>` tuple utility that consumes one element per recursive step).
