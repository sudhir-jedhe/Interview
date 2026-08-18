```typescript
function pair<T>(a: T, b: T): T[] {
  return [a, b];
}

const result = pair(1, "two");
console.log(typeof result);
```

What is the type of `result`, and does this code compile?

**Answer:** It compiles. `result` has type `(string | number)[]`.

**Why:** With no constraint on `T`, TypeScript doesn't force `a` and `b` to be identical primitive types — it unifies `T` to the *best common supertype* of both arguments, which here is the union `string | number`. Both `1` and `"two"` are individually assignable to `string | number`, so the call is valid and `T` is inferred as `string | number`, making the return type `(string | number)[]`. A common misconception is that generics automatically enforce "both arguments must be the exact same type" — they don't, unless you either add an explicit type argument (`pair<number>(1, "two")` would then error) or use two independent type parameters with a constraint that ties them together more strictly, e.g. overloads or a stricter design. `typeof result` at runtime is simply `"object"` since arrays are objects — the union type is purely compile-time information and has no runtime representation.
