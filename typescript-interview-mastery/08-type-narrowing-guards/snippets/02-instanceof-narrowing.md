# Narrowing with instanceof

```typescript
// Distinguish two error subclasses by their prototype chain
class NotFoundError extends Error {}
class PermissionError extends Error {}

function describe(err: Error): string {
  if (err instanceof NotFoundError) return "404: not found";
  if (err instanceof PermissionError) return "403: forbidden";
  return "500: unknown error";
}

console.log(describe(new NotFoundError()));
```
