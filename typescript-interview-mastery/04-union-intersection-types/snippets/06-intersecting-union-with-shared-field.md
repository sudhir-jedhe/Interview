# Snippet: Intersecting a union with a shared extra field

Shows `&` distributing across a union to add a common `requestId` field to every variant.

```typescript
type ApiResult = { status: "ok"; data: string } | { status: "error"; message: string };
type TrackedResult = ApiResult & { requestId: string };

function logResult(result: TrackedResult): void {
  if (result.status === "ok") {
    console.log(`[${result.requestId}] OK: ${result.data}`);
  } else {
    console.log(`[${result.requestId}] ERROR: ${result.message}`);
  }
}

logResult({ status: "ok", data: "loaded", requestId: "req-1" });
```
