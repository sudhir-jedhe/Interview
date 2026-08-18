# Snippet: Overloaded `wrapInArray` function

Shows two overload signatures plus one implementation signature, picking the return type based on input shape.

```typescript
function wrapInArray<T>(value: T): T[];
function wrapInArray<T>(value: T[]): T[];
function wrapInArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

const a = wrapInArray("hello");      // string[]
const b = wrapInArray(["a", "b"]);   // string[] (already an array, returned as-is)

console.log(a, b);
```
