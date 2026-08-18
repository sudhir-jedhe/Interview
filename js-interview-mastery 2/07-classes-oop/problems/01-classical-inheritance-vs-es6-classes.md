# Problem: classical prototype-based inheritance vs ES6 classes

## Requirements

Build a `Shape` → `Circle`/`Square` hierarchy twice: once using pre-ES6, prototype-based "classical inheritance" (constructor functions + manually wired `.prototype` chains), and once using modern `class`/`extends` syntax — then compare them side by side to show they're doing the same thing under the hood.

## Version 1: pre-ES6 prototype-based inheritance

```js
function Shape(name) {
  this.name = name;
}
Shape.prototype.area = function () {
  throw new Error("area() must be implemented by subclass");
};
Shape.prototype.describe = function () {
  return `${this.name}: area = ${this.area().toFixed(2)}`;
};

function Circle(radius) {
  Shape.call(this, "Circle"); // manually invoke the "parent constructor"
  this.radius = radius;
}
// Wire up the prototype chain manually: Circle.prototype's [[Prototype]] becomes Shape.prototype
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle; // restore the constructor reference Object.create wiped out
Circle.prototype.area = function () {
  return Math.PI * this.radius ** 2;
};

function Square(side) {
  Shape.call(this, "Square");
  this.side = side;
}
Square.prototype = Object.create(Shape.prototype);
Square.prototype.constructor = Square;
Square.prototype.area = function () {
  return this.side ** 2;
};

const oldCircle = new Circle(3);
console.log(oldCircle.describe());          // "Circle: area = 28.27"
console.log(oldCircle instanceof Shape);    // true
```

## Version 2: ES6 class syntax equivalent

```js
class ShapeES6 {
  constructor(name) { this.name = name; }
  area() { throw new Error("area() must be implemented by subclass"); }
  describe() { return `${this.name}: area = ${this.area().toFixed(2)}`; }
}

class CircleES6 extends ShapeES6 {
  constructor(radius) {
    super("Circle"); // equivalent to Shape.call(this, "Circle")
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
}

class SquareES6 extends ShapeES6 {
  constructor(side) {
    super("Square");
    this.side = side;
  }
  area() { return this.side ** 2; }
}

const newCircle = new CircleES6(3);
console.log(newCircle.describe());          // "Circle: area = 28.27"
console.log(newCircle instanceof ShapeES6); // true
```

## Side-by-side mapping

| Classical (pre-ES6) | ES6 class equivalent |
|---|---|
| `function Circle(radius) { Shape.call(this, "Circle"); ... }` | `constructor(radius) { super("Circle"); ... }` |
| `Circle.prototype = Object.create(Shape.prototype)` | Handled automatically by `extends` |
| `Circle.prototype.constructor = Circle` | Handled automatically by `class` |
| `Circle.prototype.area = function () {...}` | `area() {...}` inside the class body |
| `oldCircle instanceof Shape` → `true` | `newCircle instanceof ShapeES6` → `true` |

Both versions produce an identical runtime shape: a `Circle` instance whose `[[Prototype]]` is `Circle.prototype`, whose own `[[Prototype]]` is `Shape.prototype`. This is the concrete proof that `class` is sugar over the same prototype chain — every step the manual version does explicitly, `class`/`extends`/`super` does for you, plus adds strict mode and the `new`-only constraint.

## Common mistakes the manual version highlights

- Forgetting `Circle.prototype.constructor = Circle` after `Object.create(Shape.prototype)` leaves `Circle.prototype.constructor` pointing at `Shape`, which breaks code that relies on `instance.constructor` to identify the "real" class.
- Forgetting to call `Shape.call(this, ...)` inside `Circle` means `this.name` is never set — there's no compiler enforcement like `super()`'s mandatory-before-`this` rule, so this bug is easy to introduce silently.
- Assigning `Circle.prototype = Shape.prototype` directly (instead of `Object.create(Shape.prototype)`) would make `Circle` and `Shape` share the exact same prototype object, so adding a method to `Circle.prototype` would also add it to `Shape.prototype` — a classic inheritance bug.
