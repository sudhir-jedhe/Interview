# Best-common-type inference for array literals

```typescript
// Snippet demonstrating best-common-type inference without a contextual type
class Shape {}
class Circle extends Shape {
  radius = 1;
}
class Square extends Shape {
  side = 1;
}

const shapes = [new Circle(), new Square()];
// inferred type: (Circle | Square)[]  -- NOT Shape[]

const typedShapes: Shape[] = [new Circle(), new Square()];
// contextual typing forces Shape[] here instead
```
