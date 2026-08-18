```typescript
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

function paint(color: Color): void {
  console.log(`Painting ${color}`);
}

paint(Color.Red);
paint("RED");
```

Which call fails to compile, and why is this surprising given that `Color.Red === "RED"` at runtime?

**Answer:** `paint("RED")` fails to compile with "Argument of type 'string' is not assignable to parameter of type 'Color'." `paint(Color.Red)` compiles fine.

**Why:** String enum members are nominal types, not merely aliases for their underlying string literal — even though `Color.Red`'s runtime value genuinely equals the string `"RED"`, TypeScript treats `Color` and `"RED": string` as distinct, incompatible types for assignability. This is different from a plain literal union like `type Color2 = "RED" | "GREEN" | "BLUE"`, where the bare string `"RED"` *would* be accepted, because a literal union has no nominal identity of its own — it's just a set of string literal types. The practical implication: switching from a string enum to a literal union changes how external data (API responses, form inputs, raw strings from anywhere outside your enum-aware code) can flow into a typed parameter — a literal union accepts it directly, a string enum requires an explicit cast or a lookup/validation step first.
