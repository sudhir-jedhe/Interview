# Snippet: `void`-typed callback accepting a value-returning function

Shows the standard `void` callback leniency pattern used with `Array.prototype.forEach`.

```typescript
const log: string[] = [];

function runForEach(items: number[], onItem: (item: number) => void): void {
  items.forEach(onItem);
}

// `log.push` returns a number (new length), but that's fine — onItem expects void
runForEach([1, 2, 3], (item) => log.push(`processed: ${item}`));

console.log(log);
```
