# Does this compile, and what's the runtime risk?

```typescript
function processAll(ids: number[], handler: (id: number) => void): void {
  ids.forEach(handler);
}

async function deleteRecord(id: number): Promise<void> {
  await fetch(`/api/records/${id}`, { method: "DELETE" });
}

processAll([1, 2, 3], deleteRecord);
```

**Answer:** This compiles with **no errors**, despite `deleteRecord` being an `async` function that actually returns `Promise<void>`, not `void`. At runtime, all three `DELETE` requests are fired, but `processAll` never awaits any of them, and any rejected promise (a failed request) becomes an unhandled promise rejection.

**Why:** This is the `void`-callback leniency rule from `theory/05-void-return-and-callback-typing.md`, applied to its most dangerous real-world case. `handler`'s declared type is `(id: number) => void`. TypeScript's rule for `void`-returning callback parameters is that any function returning *any* value — including a `Promise<void>` — is accepted, because the return value is contractually "allowed to exist but ignored." Since `Promise<void>` is a value, `deleteRecord` satisfies `(id: number) => void` even though it's asynchronous. The type checker never distinguishes "returns nothing" from "returns a promise that should probably be awaited" here. The safe fix: type `handler` explicitly as `(id: number) => void | Promise<void>`, and inside `processAll`, either `await Promise.all(ids.map(handler))` or otherwise handle the returned promises — or rely on an ESLint rule like `@typescript-eslint/no-misused-promises`, which specifically flags passing async functions where a sync void callback is expected, since the compiler alone won't catch it.
