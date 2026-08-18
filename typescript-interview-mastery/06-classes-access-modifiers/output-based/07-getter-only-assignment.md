```typescript
class Circle {
  constructor(private radius: number) {}

  get area(): number {
    return Math.PI * this.radius ** 2;
  }
}

const c = new Circle(2);
console.log(c.area);
c.area = 100;
```

Does the last line compile?

**Answer:** No. `c.area = 100` fails with "Cannot assign to 'area' because it is a read-only property."

**Why:** `Circle` declares only a `get area()` accessor and no matching `set area(value)`, which makes `area` a read-only property from the outside — TypeScript treats a getter-without-setter exactly like a `readonly` field for assignment purposes, even though nothing is literally marked `readonly`. `console.log(c.area)` works fine because reads only need the getter. To make `area` writable, you'd add a `set area(value: number)` that presumably back-computes `radius` from the desired area — but for a derived/computed value like this, a getter-only accessor is usually the correct design, since "setting" a computed value doesn't have an obvious, unambiguous meaning.
