# What's the error here?

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

function getArea(shape: Circle | Square): number {
  return shape.radius * shape.radius * Math.PI;
}
```

**Answer:** Compile error: `Property 'radius' does not exist on type 'Circle | Square'. Property 'radius' does not exist on type 'Square'.`

**Why:** `shape` has the union type `Circle | Square`, and without narrowing, TypeScript only permits accessing properties present (with compatible types) on **every** member of the union. `radius` exists on `Circle` but not on `Square`, so accessing `shape.radius` directly is unsafe — if the actual runtime value were a `Square`, `shape.radius` would be `undefined` and the multiplication would produce `NaN` silently. The fix is to narrow first, most idiomatically via the shared `kind` discriminant: `if (shape.kind === "circle") { return shape.radius ** 2 * Math.PI; } return shape.sideLength ** 2;` — once narrowed by checking `kind`, TypeScript knows exactly which shape's exclusive properties are safe to access in each branch.
