# Snippet: Narrowing a primitive union with typeof

Shows a `string | number` union narrowed with `typeof` before calling type-specific methods.

```typescript
function formatQuantity(value: string | number): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  return value.trim();
}

console.log(formatQuantity(4.5));
console.log(formatQuantity("  12 units  "));
```
