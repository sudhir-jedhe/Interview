# Snippet: a conditional type picking a response shape

```typescript
// Choose an error or success response shape based on whether T has an "error" field.

type Outcome<T> = T extends { error: string } ? { ok: false; error: string } : { ok: true; data: T };

function normalize<T>(input: T): Outcome<T> {
  return (
    typeof input === "object" && input !== null && "error" in input
      ? { ok: false, error: (input as any).error }
      : { ok: true, data: input }
  ) as Outcome<T>;
}
```
