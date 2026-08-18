```typescript
const values: (string | null)[] = ["a", null, "b"];

const filtered = values.filter((v) => v !== null);

filtered.forEach((v) => console.log(v.toUpperCase()));
```

Does this compile?

**Answer:** No. `v.toUpperCase()` fails with "Object is possibly 'null'."

**Why:** `Array.prototype.filter`'s type signature has two overloads: one accepts a predicate typed as `(value: T) => value is S` (a type guard) and returns `S[]`, narrowing the element type; the other accepts a plain `(value: T) => boolean` and returns `T[]`, unchanged. The arrow function `(v) => v !== null` is a completely ordinary boolean-returning function from TypeScript's point of view — even though *at runtime* it correctly filters out every `null`, the compiler has no way to know that from a plain `!==` comparison inside an anonymous arrow function; it only recognizes the narrowing relationship when the function is explicitly typed with a type predicate. So `filtered` stays typed `(string | null)[]`, identical to the input, and `.toUpperCase()` on a possibly-`null` value is rejected. The fix is a named (or typed) predicate: `function isNotNull<T>(v: T | null): v is T { return v !== null; }`, then `values.filter(isNotNull)` — now `filtered` is correctly inferred as `string[]`.
