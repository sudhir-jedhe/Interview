```typescript
enum Priority {
  Low,
  Medium,
  High,
}

function setPriority(p: Priority): void {
  console.log(Priority[p]);
}

setPriority(1);
setPriority(999);
```

Do both calls compile? What does each print?

**Answer:** Both compile. `setPriority(1)` prints `"Medium"`. `setPriority(999)` prints `undefined`.

**Why:** Numeric enum types are structurally equivalent to `number` for assignability purposes — TypeScript does not restrict a numeric enum parameter to only the declared members' values, so any `number` literal, including `999`, satisfies the `Priority` type with no error. At runtime, `Priority[999]` looks up key `999` in the compiled reverse-mapping object, finds nothing, and returns `undefined`. This is the classic numeric-enum reverse-mapping gotcha: the "safety" of an enum type is weaker than it looks, because it doesn't actually enumerate valid inputs the way a literal union does. `setPriority(1)` works correctly only because `1` happens to coincide with `Priority.Medium`'s auto-assigned value — nothing in the type signature guarantees the caller passed a meaningful `Priority` value rather than an arbitrary number that happens to match.
