# Snippet: infer pulling the element type out of an array

```typescript
// ElementOf<T> extracts the element type of an array using infer.

type ElementOf<T> = T extends (infer E)[] ? E : never;

type Ids = ElementOf<string[]>;    // string
type Rows = ElementOf<{ id: number }[]>; // { id: number }

function first<T extends unknown[]>(arr: T): ElementOf<T> {
  return arr[0] as ElementOf<T>;
}
```
