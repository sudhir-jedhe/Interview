```typescript
class Base {
  protected constructor(public id: number) {}

  static create(id: number): Base {
    return new Base(id);
  }
}

class Derived extends Base {
  constructor(id: number) {
    super(id);
  }
}

new Base(1);
new Derived(2);
```

Which of the two final lines fails to compile?

**Answer:** `new Base(1)` fails to compile. `new Derived(2)` compiles fine.

**Why:** A `protected constructor` can only be called from within the declaring class itself or from a subclass — `Base.create` is a static method defined inside `Base`, so `new Base(id)` inside it is legal, but external code calling `new Base(1)` directly is not, since that's "outside" access to a protected member. `Derived`'s own constructor calling `super(id)` is also legal — subclass constructors are exactly the mechanism `protected` is designed to allow — and once `Derived` has its own `public` (implicit) constructor, external code can freely do `new Derived(2)`. This pattern (`protected constructor` + a `static create`/factory method) is used to force all construction through a chokepoint, e.g. for validation, singleton-like registries, or returning a subclass instance decided at runtime, while still permitting normal subclassing.
