# Merge two objects with a combined type

```typescript
// Combines two objects into an intersection type, second wins on overlap
function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b };
}

const withId = merge({ id: 1 }, { name: "Widget", price: 9.99 });
// withId: { id: number } & { name: string; price: number }

console.log(withId.id, withId.name, withId.price);
```
