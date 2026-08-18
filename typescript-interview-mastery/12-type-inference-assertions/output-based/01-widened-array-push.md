```typescript
const tags = ["a", "b"];
tags.push("c");

function printFirst(arr: readonly ["a", "b", "c"]) {
  console.log(arr[0]);
}

printFirst(tags as any);
console.log(typeof tags[0]);
```

What does `typeof tags[0]` print, and does the `printFirst` call reveal any type error before that?

**Answer:** No compile error occurs anywhere in this snippet (the `as any` suppresses the mismatch), and `typeof tags[0]` prints `"string"` at runtime.

**Why:** `tags` is declared with `const` but holds an array literal, so its *elements* still widen to `string[]` (only the binding itself is immutable, not the array's mutability or element literal-ness — arrays are not deeply frozen by plain `const`). `tags.push("c")` is legal because `string[]` is a mutable type. The `printFirst(tags as any)` call routes through `any`, which disables all checking, so TypeScript never verifies `tags` actually satisfies the tuple type `readonly ["a", "b", "c"]` — and at runtime it doesn't matter anyway, since assertions have zero runtime effect. `typeof` is a JavaScript runtime operator here (not the TS type query), so it just reports the actual runtime type of the string value at index 0, which is `"string"`.
