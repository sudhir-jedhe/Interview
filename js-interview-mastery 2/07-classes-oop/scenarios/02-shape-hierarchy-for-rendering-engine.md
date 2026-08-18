# Scenario: shape hierarchy for a rendering engine

**Prompt:** You're building a simple 2D rendering engine that needs to compute area and perimeter for different shapes (`Circle`, `Rectangle`, `Triangle`) uniformly, and later add new shapes without touching existing code. How do you structure this with classes, and how does polymorphism help?

**Approach:** Define a common base class with methods that subclasses must override, and rely on polymorphic dispatch rather than type-checking:

```js
class Shape {
  area() { throw new Error("area() must be implemented by subclass"); }
  perimeter() { throw new Error("perimeter() must be implemented by subclass"); }
  describe() { return `${this.constructor.name}: area=${this.area().toFixed(2)}, perimeter=${this.perimeter().toFixed(2)}`; }
}
class Circle extends Shape {
  constructor(r) { super(); this.r = r; }
  area() { return Math.PI * this.r ** 2; }
  perimeter() { return 2 * Math.PI * this.r; }
}
class Rectangle extends Shape {
  constructor(w, h) { super(); this.w = w; this.h = h; }
  area() { return this.w * this.h; }
  perimeter() { return 2 * (this.w + this.h); }
}

const shapes = [new Circle(3), new Rectangle(4, 5)];
shapes.forEach((s) => console.log(s.describe())); // works uniformly, no type checks needed
```

This satisfies the open/closed principle: adding `Triangle` later means writing one new class, never touching the loop that consumes `shapes`. The base class's `describe()` uses `this.constructor.name` to stay generic across all subclasses without hardcoding names.
