# A user-defined type guard with a type predicate

```typescript
// `x is number[]` lets callers narrow an unknown value safely
function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((v) => typeof v === "number");
}

function sum(value: unknown): number {
  return isNumberArray(value) ? value.reduce((a, b) => a + b, 0) : 0;
}

console.log(sum([1, 2, 3]), sum("not an array"));
```
