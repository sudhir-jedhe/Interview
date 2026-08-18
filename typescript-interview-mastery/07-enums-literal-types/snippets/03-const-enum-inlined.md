# const enum inlines values, generates no object

```typescript
// No runtime object is emitted for Direction — usages get inlined
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

function move(dir: Direction, steps: number): void {
  console.log(`Moving ${steps} steps: ${dir}`);
}

move(Direction.Up, 3); // compiles to move(0, 3)
```
