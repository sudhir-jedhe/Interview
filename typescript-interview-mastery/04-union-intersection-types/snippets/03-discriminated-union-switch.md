# Snippet: Discriminated union with switch narrowing

Shows a `shape` discriminant driving both narrowing and calculation logic.

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}

console.log(area({ kind: "circle", radius: 3 }).toFixed(2));
console.log(area({ kind: "rectangle", width: 4, height: 5 }));
```
