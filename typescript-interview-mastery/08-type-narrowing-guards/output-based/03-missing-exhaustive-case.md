```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function assertNever(x: never): never {
  throw new Error("Unhandled: " + JSON.stringify(x));
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    default:
      return assertNever(shape);
  }
}
```

Does this compile?

**Answer:** No. The `default` branch fails: "Argument of type '{ kind: \"square\"; side: number }' is not assignable to parameter of type 'never'."

**Why:** The `switch` only handles `"circle"`, leaving `"square"` unaddressed. Inside `default`, TypeScript narrows `shape` to whatever remains after eliminating every explicitly handled case — since only `"circle"` was handled, `shape` in `default` is narrowed to `{ kind: "square"; side: number }`, not `never`. `assertNever` only accepts `never`, so passing a real, un-eliminated union member into it is a type error, and that error is precisely the exhaustiveness check doing its job: it's flagging that a `Shape` variant exists which `area` doesn't know how to compute. The fix is adding the missing `case "square": return shape.side ** 2;` — once every member is explicitly handled, `shape` inside `default` genuinely narrows to `never`, and the `assertNever(shape)` call compiles again.
