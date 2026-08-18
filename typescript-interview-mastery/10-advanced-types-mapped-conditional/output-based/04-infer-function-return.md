```typescript
type LastArg<T> = T extends (...args: [...infer _Rest, infer Last]) ? Last : never;

function createUser(name: string, age: number, isAdmin: boolean) {
  return { name, age, isAdmin };
}

type Result = LastArg<typeof createUser>;
```

**Answer:** This does NOT compile as written — `T extends (...args: [...infer _Rest, infer Last])` is missing the return-type portion of a call signature. A bare parameter-list pattern like `(...args: [...])` isn't a valid function type on its own inside `extends`; it needs `=> any` (or another return type) to be a complete function type pattern: `T extends (...args: [...infer _Rest, infer Last]) => any ? Last : never`. With that fix, `Result` is `boolean` — the type of `isAdmin`, the last parameter.

**Why:** A function type pattern used with `infer` must be a syntactically complete function type — parameters *and* a return type position — even if you only care about capturing part of it (here, just the last parameter via a rest-tuple destructure `[...infer _Rest, infer Last]`). Forgetting the `=> any` is a common typo when candidates focus on the "infer part" and forget the pattern still needs to look like a real function type for TypeScript to match against it.
