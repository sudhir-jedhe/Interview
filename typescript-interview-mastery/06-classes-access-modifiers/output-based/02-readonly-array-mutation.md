```typescript
class Team {
  readonly members: string[] = [];

  add(name: string): void {
    this.members.push(name);
  }
}

const t = new Team();
t.add("Aria");
t.add("Noah");
console.log(t.members);
```

Does `add` compile? Does `t.members = []` compile if attempted afterward?

**Answer:** `add` compiles fine and prints `["Aria", "Noah"]`. A later `t.members = []` does NOT compile.

**Why:** `readonly` on a class field only prevents *reassigning the field itself* (`t.members = [...]` or `this.members = [...]` outside the constructor) — it says nothing about mutating the object the field currently points to. `members` is `readonly string[]`, meaning the binding is fixed, but the array instance it refers to is fully mutable, so `.push()` works exactly as normal. This trips up developers coming from languages where "readonly"/"final" implies deep immutability. If you actually want to prevent `.push()` too, the field's type needs to be `ReadonlyArray<string>` (or `readonly string[]`, the shorthand type syntax) rather than `readonly` just modifying a mutable `string[]` — note this is a different `readonly` than the field modifier: it's part of the *type* itself, and it removes mutating methods like `push`/`pop`/`splice` from the type's method list entirely.
