# const enums and as const

**Q: What does `const enum` change compared to a regular enum, at the compiled-output level?**
A: A regular enum generates a real runtime object with all of its members. A `const enum` generates no runtime object at all — every reference to one of its members is inlined directly as the literal value at the usage site, at compile time. This makes `const enum` purely a compile-time construct with no runtime footprint, unlike every other kind of enum.

**Q: Why do many teams avoid `const enum` in projects built with esbuild, SWC, Vite, or Babel?**
A: Those tools transpile each file in isolation for speed (the `isolatedModules` compilation model), so when a `const enum` is imported from another file, the transpiler processing the importing file has no visibility into the enum's declaration and can't correctly inline its members. This produces build errors or broken output specifically in cross-file usage, which is common enough that it's a well-known, sharp limitation rather than an edge case.

**Q: What exactly does `as const` do to an object or array literal?**
A: It tells TypeScript to infer the narrowest possible type instead of the default widened one: every property/element keeps its exact literal type (a string stays `"active"` instead of widening to `string`), every property becomes `readonly`, and arrays become fixed-length readonly tuples instead of mutable arrays of a general element type.

**Q: Given `const ROLES = ["admin", "viewer"] as const;`, how do you derive a union type `"admin" | "viewer"` from it?**
A: `type Role = (typeof ROLES)[number];` — `typeof ROLES` gets the tuple type `readonly ["admin", "viewer"]`, and indexing it with `number` (rather than a specific index) extracts the union of every element's type. Without `as const`, `ROLES` would widen to `string[]`, and the same expression would just produce `string`, since a regular array's element type has no per-position literal information left.
