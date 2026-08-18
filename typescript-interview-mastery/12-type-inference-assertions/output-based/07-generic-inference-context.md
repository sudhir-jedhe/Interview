```typescript
function firstOf<T>(items: T[]): T {
  return items[0];
}

const result = firstOf(["a", "b", "c"]);
const empty = firstOf([]);

console.log(result.toUpperCase());
console.log(empty);
```

What are the inferred types of `result` and `empty`, and does anything fail to compile?

**Answer:** `result` is inferred as `string`, and `result.toUpperCase()` compiles fine. `empty` is inferred as `unknown[]` narrowed to `T = unknown`, so `empty` has type `unknown` — this line itself compiles (logging is fine), but trying to call any method on `empty` (e.g. `empty.toUpperCase()`) would fail to compile.

**Why:** Generic type inference works by matching the argument's type against the parameter's declared shape. For `firstOf(["a", "b", "c"])`, the array literal is inferred as `string[]`, so TS unifies `T` with `string`, making the return type `string`. For `firstOf([])`, the empty array literal has no elements to infer an element type from, so TypeScript can't determine `T` from context and defaults it to `unknown` (in a `noImplicitAny`/strict setup TypeScript infers `unknown[]` for `[]` rather than `any[]`, unless there's a contextual type to pull from). This shows that generic inference is a form of best-common-type inference applied to the *type parameter*, and that with no elements and no contextual type, TS falls back to the safest possible type rather than guessing.
