# Preserving narrowing across a closure with a const copy

```typescript
// Assigning the narrowed value to a const keeps it valid inside the callback
function scheduleGreeting(user: { name: string } | undefined): void {
  if (!user) return;
  const narrowedUser = user; // const snapshot, safe to capture

  setTimeout(() => {
    console.log(`Hello, ${narrowedUser.name}`);
  }, 100);
}

scheduleGreeting({ name: "Ines" });
```
