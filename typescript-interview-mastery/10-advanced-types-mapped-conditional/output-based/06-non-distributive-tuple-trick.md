```typescript
type IsUnion<T, B = T> = T extends B ? ([B] extends [T] ? false : true) : never;

type A = IsUnion<"x" | "y">;
type B = IsUnion<"x">;
```

**Answer:** `A` is `true`. `B` is `false`.

**Why:** This is the standard trick for detecting whether a type is a union using distribution deliberately, rather than avoiding it. `T extends B` (both naked type parameters, with `B` defaulting to a full copy of `T`) distributes over `T`: for `A`, `T = "x" | "y"` distributes into `("x" extends "x"|"y" ? ... : ...) | ("y" extends "x"|"y" ? ... : ...)`. In each distributed branch, `T` has narrowed to a single member (`"x"` or `"y"`) while `B` still refers to the *original, undistributed* union `"x" | "y"` (because `B` isn't the type being distributed over). So the inner check `[B] extends [T]` compares the whole original union against a single narrowed member, wrapped in tuples to prevent that inner check from *also* distributing — and a single member is never a supertype of the whole union unless the union only had one member to begin with. This combination of "let the outer conditional distribute, but freeze the inner comparison with tuples" is a genuinely advanced pattern and a strong signal of deep conditional-type fluency in an interview.
