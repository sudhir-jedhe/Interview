```typescript
function parseValue(input: string): number;
function parseValue(input: number): string;
function parseValue(input: string | number): string | number {
  return typeof input === "string" ? Number(input) : String(input);
}

type Result = ReturnType<typeof parseValue>;
```

**Answer:** `Result` is `string`, not `number | string` and not `number` — it's the return type of the *last* (most general implementation) signature is not used either; `ReturnType` picks the return type of the **last overload signature declared**, which here is `(input: number): string`. So `Result = string`.

**Why:** When a function has multiple overload signatures, `ReturnType<T>` doesn't see all of them merged — TypeScript resolves `typeof parseValue` to the overloaded function type, and utility types that pattern-match a single call signature (via `T extends (...args: any) => infer R ? R : never`) only match against the *last* overload signature in the list, because that's the one exposed for this kind of generic inference. This is a well-known sharp edge: to get the return type of a *specific* overload, you can't use `ReturnType` directly — you'd need to manually pick apart the overloads or restructure the function to use a single generic signature instead of true overloads.
