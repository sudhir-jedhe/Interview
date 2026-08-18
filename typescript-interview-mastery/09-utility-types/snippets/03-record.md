# Snippet: Record building an exhaustive lookup table

```typescript
// Record enforces that every union member has a corresponding entry.

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const methodIsIdempotent: Record<HttpMethod, boolean> = {
  GET: true,
  POST: false,
  PUT: true,
  DELETE: true,
};

function describeMethod(method: HttpMethod): string {
  return methodIsIdempotent[method] ? `${method} is idempotent` : `${method} is not idempotent`;
}

console.log(describeMethod("PUT")); // "PUT is idempotent"
```
