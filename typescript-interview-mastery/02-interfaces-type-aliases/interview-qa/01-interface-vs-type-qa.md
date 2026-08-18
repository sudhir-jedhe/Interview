# Interview Q&A: Interface vs Type Alias

**Q: What's the single biggest practical difference between `interface` and `type`?**
A: Declaration merging. Declaring the same `interface` name more than once in the same scope automatically merges all the members into one interface. Declaring the same `type` alias name twice is always a compile error — type aliases cannot be redeclared or merged. This is what makes `interface` the only option for augmenting third-party library types (like adding a custom field to Express's `Request`) via ambient/module augmentation.

**Q: Can everything you write as an `interface` also be written as a `type`, and vice versa?**
A: Mostly, but not entirely, in both directions. Object shapes, generics, and method signatures can be expressed equivalently either way. However, `type` aliases can express things `interface` fundamentally cannot: unions (`"a" | "b"`), tuples, primitive aliases, and mapped/conditional types. Conversely, `interface` supports declaration merging, which `type` cannot replicate at all — the closest approximation with `type` is manually redefining a new combined type via `&`, which is a different construct, not a true merge of the original name.

**Q: If both work for a given object shape, which do you pick, and why?**
A: A common convention: use `interface` for public-facing object/entity shapes that are likely to be extended by consumers or that represent stable domain models, since `extends` gives clearer, earlier error messages on incompatible overrides, and merging supports future augmentation. Use `type` for unions, tuples, function types, and any shape that isn't a plain object. Some teams simplify further and just pick one as the default for all object shapes for consistency — both are reasonable as long as the team is consistent, since the functional difference for simple internal shapes is negligible.

**Q: Does using `interface` vs `type` change whether two structurally identical shapes are assignable to each other?**
A: No. TypeScript's structural type system doesn't care how a type was declared — only what shape it describes. A value satisfying an `interface Point { x: number; y: number }` is fully assignable anywhere a `type Vector = { x: number; y: number }` is expected, and vice versa, because they describe the same structural shape. The declaration keyword only affects declaration-time behaviors (merging, extension conflict checking), never runtime or structural compatibility.
