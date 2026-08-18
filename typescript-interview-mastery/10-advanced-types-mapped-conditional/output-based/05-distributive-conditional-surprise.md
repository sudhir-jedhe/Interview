```typescript
type NonEmptyArray<T> = T extends any ? [T, ...T[]] : never;

type Result = NonEmptyArray<string | number>;

const good: Result = ["a", "b", "c"]; // (1)
const mixed: Result = ["a", 1, "b"];  // (2)
```

**Answer:** `Result` is `[string, ...string[]] | [number, ...number[]]`, NOT `[string | number, ...(string | number)[]]`. Line (1) compiles — it matches the first branch of the union. Line (2) fails to compile: the mixed array `["a", 1, "b"]` doesn't match either `[string, ...string[]]` or `[number, ...number[]]` individually.

**Why:** `T extends any` with a naked `T` distributes over the union `string | number`, producing `NonEmptyArray<string> | NonEmptyArray<number>` = `[string, ...string[]] | [number, ...number[]]` — two separate homogeneous-tuple branches, not one heterogeneous tuple type. This surprises people who expect `T` to mean "the whole union" throughout the conditional; because `T` is naked in front of `extends`, TypeScript evaluates the conditional once per union member and unions the *results*, so each branch only ever sees one member of the original union at a time, never the union as a whole. To get a single tuple type that accepts a mix of both, you'd need to disable distribution with `[T] extends [any]` and restructure accordingly.
