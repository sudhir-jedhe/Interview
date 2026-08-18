# A basic assertion function

```typescript
// Narrows without an if-block — narrowing applies for the rest of the scope
function assertDefined<T>(value: T | undefined, message: string): asserts value is T {
  if (value === undefined) throw new Error(message);
}

function greet(name: string | undefined): string {
  assertDefined(name, "name is required");
  return name.toUpperCase(); // name: string here
}

console.log(greet("Kavi"));
```
