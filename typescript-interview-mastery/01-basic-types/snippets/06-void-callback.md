# Snippet: `void` return type with array callbacks

Shows that a `void`-typed callback parameter can accept a function that returns a real value — the return value is simply ignored.

```typescript
const items: string[] = [];

function pushAndLog(item: string, onAdd: () => void): void {
  items.push(item);
  onAdd();
}

// `.push` returns the new array length (a number), but that's fine —
// `onAdd` only requires the *call* to happen, not a specific return type.
pushAndLog("widget", () => items.push("logged-side-effect"));

console.log(items); // ["widget", "logged-side-effect"]
```
