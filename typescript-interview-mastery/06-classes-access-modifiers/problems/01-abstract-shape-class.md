# Build an abstract Shape class with two concrete subclasses

## Problem

Design an `abstract class Shape` with an abstract `area(): number` method, a concrete `describe(): string` method that uses `area()`, and two concrete subclasses — `Rectangle` and `Triangle` — each implementing `area()` correctly for their own geometry.

## Solution

```typescript
abstract class Shape {
  abstract area(): number;

  describe(): string {
    return `${this.constructor.name} has area ${this.area().toFixed(2)}`;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }
}

class Triangle extends Shape {
  constructor(private base: number, private height: number) {
    super();
  }

  area(): number {
    return (this.base * this.height) / 2;
  }
}
```

## Usage

```typescript
const shapes: Shape[] = [new Rectangle(4, 6), new Triangle(3, 8)];

for (const shape of shapes) {
  console.log(shape.describe());
}
// "Rectangle has area 24.00"
// "Triangle has area 12.00"

// new Shape(); // Error: Cannot create an instance of an abstract class
```

## Discussion

`describe()` is written once on the base class and works correctly for every subclass without modification, because it calls `this.area()`, which dispatches to whichever concrete implementation belongs to the actual runtime instance — this is ordinary polymorphism, and it's exactly why abstract classes are chosen over duplicating a `describe`-like method in every subclass. If a third shape (say `Circle`) is added later and its author forgets to implement `area()`, the compiler rejects the class immediately, before it can ever reach `shapes: Shape[]` and produce a runtime `undefined is not a function` error — this compile-time enforcement is the core benefit `abstract` provides over a plain base class with a `throw new Error("not implemented")` placeholder method.
