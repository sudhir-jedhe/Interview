# Snippet: Declaration merging in action

Shows two separate `interface AppEvents` declarations merging into one combined shape.

```typescript
interface AppEvents {
  login: { userId: number };
}

interface AppEvents {
  logout: { userId: number; reason: string };
}

// Merged shape requires both `login` and `logout`
function handleEvent(events: AppEvents): void {
  console.log(events.login.userId, events.logout.reason);
}

handleEvent({
  login: { userId: 1 },
  logout: { userId: 1, reason: "session-expired" },
});
```
