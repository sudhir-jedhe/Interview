# Narrowing a union with typeof

```typescript
// Each branch narrows `input` to a single member of the union
function double(input: number | string): number {
  if (typeof input === "number") {
    return input * 2;
  }
  return Number(input) * 2;
}

console.log(double(5), double("5"));
```
