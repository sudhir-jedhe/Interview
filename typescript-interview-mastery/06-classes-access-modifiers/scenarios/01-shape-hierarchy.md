# Modeling a shape library for a billing/rendering engine

You're building a diagramming tool that needs to compute area and perimeter for several shape types, render a label for each, and guarantee that every new shape type added in the future can't be forgotten in either calculation.

**Approach:** Use an abstract base class to hold the shared contract (`area`, `perimeter`) and any genuinely shared behavior (a `describe` method built from those two), and let each concrete shape implement only what's actually specific to it. This is preferable to an interface here because `describe` is real, reusable logic, not just a shape declaration.

```typescript
abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;

  describe(): string {
    return `${this.constructor.name}: area=${this.area().toFixed(2)}, perimeter=${this.perimeter().toFixed(2)}`;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

const shapes: Shape[] = [new Rectangle(4, 5), new Circle(3)];
shapes.forEach((s) => console.log(s.describe()));
```

Because `area` and `perimeter` are `abstract`, forgetting to implement either one in a new subclass is a compile error, not a runtime surprise discovered when someone calls `.describe()` on an incomplete shape. `shapes: Shape[]` demonstrates polymorphism working through the abstract type — the array holds different concrete classes uniformly, and each call to `.area()` dispatches to the right implementation without any type-checking or casting at the call site.
