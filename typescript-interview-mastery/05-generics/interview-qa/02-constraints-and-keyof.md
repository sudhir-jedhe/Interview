# Constraints and keyof with generics

**Q: What's the difference between `<T>` and `<T extends SomeInterface>`?**
A: An unconstrained `<T>` could be substituted with literally any type, so the compiler only allows operations valid for every possible type — essentially nothing beyond assignment and identity comparison. `<T extends SomeInterface>` narrows the set of valid substitutions to types structurally compatible with `SomeInterface`, which unlocks accessing any member declared on that interface inside the function body, at the cost of rejecting callers who pass something that doesn't match the shape.

**Q: Why does `function get<T, K extends keyof T>(obj: T, key: K): T[K]` need two type parameters instead of one?**
A: `T` captures the shape of the object being indexed into, and `K` captures which specific key is being accessed — they vary independently across call sites (different objects, different keys), and the return type `T[K]` depends on *both* simultaneously. Collapsing them into one parameter would lose the ability to express "the key must belong to this particular object's type" and "the return type is this specific property's type," which are the two guarantees that make the function useful.

**Q: What happens if you try `key: string` instead of `key: K extends keyof T`?**
A: The function still compiles, but `obj[key]` inside the body either has to be typed `any` (defeating the purpose) or triggers a compile error, because TypeScript can't verify that an arbitrary `string` corresponds to a real property of `T` — a plain `string` includes infinitely many values that aren't valid keys. The `K extends keyof T` constraint is what allows the indexed access `T[K]` to type-check safely, and it also blocks callers from passing typo'd or nonexistent property names.

**Q: Does `T extends object` guarantee `T` is a plain key-value record?**
A: No — `object` in TypeScript means "anything that isn't a primitive," which includes arrays, functions, class instances, `Date`, `Map`, and `RegExp`, not just plain object literals. If you specifically want a plain record shape, constrain with something like `Record<string, unknown>` or a named interface instead.
