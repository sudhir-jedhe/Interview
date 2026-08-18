# Snippet: Rest parameters for a variadic logger

Shows a rest parameter collecting an arbitrary number of metadata values into an array.

```typescript
function logWithContext(message: string, ...context: unknown[]): void {
  if (context.length === 0) {
    console.log(message);
  } else {
    console.log(message, JSON.stringify(context));
  }
}

logWithContext("User logged in");
logWithContext("Order placed", { orderId: 42 }, { total: 99.5 });
```
