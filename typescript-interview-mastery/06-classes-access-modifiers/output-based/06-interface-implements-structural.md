```typescript
interface Flyable {
  fly(): string;
}

class Airplane {
  fly(): string {
    return "flying at 30000ft";
  }
}

const f: Flyable = new Airplane();
console.log(f.fly());
```

`Airplane` never wrote `implements Flyable`. Does this still compile?

**Answer:** Yes, it compiles and prints `"flying at 30000ft"`.

**Why:** TypeScript uses structural typing (duck typing with static checks), not nominal typing — a class satisfies an interface as long as its shape matches, regardless of whether it explicitly declares `implements Flyable`. `Airplane` happens to have a `fly(): string` method, which is exactly what `Flyable` requires, so assigning `new Airplane()` to a variable typed `Flyable` is completely valid. `implements` is optional documentation and up-front checking, not a requirement for compatibility — leaving it off doesn't change what's assignable to what, it only means you lose the immediate, localized error inside the class body if you ever forget to implement a required member (you'd instead get the error later, at the assignment site, which can be a less helpful location to discover the mismatch).
