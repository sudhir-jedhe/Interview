# Interview Q&A: Partial, Required, Readonly

**Q1: What's the difference between `Partial<T>` and simply writing every property as optional by hand?**
A: Functionally identical output, but `Partial<T>` is *derived* from `T`, so it stays in sync automatically when `T` changes — add, remove, or rename a field on `T` and the hand-written version silently goes stale, while `Partial<T>` updates immediately and any code relying on the old shape fails to compile until fixed.

**Q2: Does `Readonly<T>` prevent mutation at runtime?**
A: No. `Readonly<T>` is purely a compile-time construct enforced by the type checker; the JavaScript emitted has no runtime protection. `state.field = x` on a `Readonly<T>`-typed variable is a compile error, but if you bypass the type system (e.g., via `as any` or by mutating the same object through an untyped reference), the mutation happens at runtime with no error. To get actual runtime immutability you need `Object.freeze()`, and even that is shallow — it only freezes the top-level object.

**Q3: If `T` has an optional property already, what does `Required<T>` do to it?**
A: It removes the optionality using the `-?` modifier, making the property mandatory. `Required<{ a?: string }>` becomes `{ a: string }`. Note that this only removes `undefined` as a valid "missing" state — if the property's type is `string | undefined` explicitly (not just optional via `?`), `Required` does not strip the literal `undefined` from the union; it only forces the key to be present. Property presence and the value being able to hold `undefined` are two separate things.

**Q4: Are `Partial<T>` and `Readonly<T>` shallow or deep?**
A: Both are shallow — they only rewrite modifiers on the top-level keys of `T`. If a property's value is itself an object, that nested object's properties keep their original optionality/mutability. To get recursive behavior you need custom recursive mapped types (`DeepPartial<T>`, `DeepReadonly<T>`), which apply the same transformation to nested object-typed properties by recursing inside the mapped type.
