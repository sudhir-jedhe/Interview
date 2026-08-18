# noImplicitAny catching an unannotated parameter

```typescript
// With noImplicitAny: true, this line fails to compile:
// function double(x) { return x * 2; }
// Error: Parameter 'x' implicitly has an 'any' type.

function double(x: number): number {
  return x * 2;
}
```
