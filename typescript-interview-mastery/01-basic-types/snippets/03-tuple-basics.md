# Snippet: Tuple declaration and destructuring

Shows a labeled tuple type used for a `[value, error]` result pair, a common Go-style pattern in TS.

```typescript
type Result<T> = [value: T, error: string | null];

function parsePort(input: string): Result<number> {
  const parsed = Number(input);
  if (Number.isNaN(parsed)) {
    return [0, `"${input}" is not a valid port number`];
  }
  return [parsed, null];
}

const [port, error] = parsePort("8080");
if (error === null) {
  console.log(`Listening on port ${port}`);
}
```
