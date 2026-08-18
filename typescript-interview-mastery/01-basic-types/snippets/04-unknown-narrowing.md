# Snippet: Narrowing `unknown` safely

Shows the standard pattern for accepting `unknown` input (e.g. from `JSON.parse`) and narrowing it before use.

```typescript
function parseUserPayload(raw: unknown): { id: number; name: string } {
  if (
    typeof raw === "object" &&
    raw !== null &&
    "id" in raw &&
    "name" in raw &&
    typeof (raw as { id: unknown }).id === "number" &&
    typeof (raw as { name: unknown }).name === "string"
  ) {
    return raw as { id: number; name: string };
  }
  throw new Error("Invalid user payload");
}

const parsed = parseUserPayload(JSON.parse('{"id": 1, "name": "Ada"}'));
console.log(parsed.name.toUpperCase());
```
