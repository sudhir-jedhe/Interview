# Identity function

```typescript
// Returns exactly what it's given, with the type preserved
function identity<T>(value: T): T {
  return value;
}

const num = identity(7);          // number
const str = identity("session");  // string
const arr = identity([1, 2, 3]);  // number[]

console.log(num, str, arr);
```
