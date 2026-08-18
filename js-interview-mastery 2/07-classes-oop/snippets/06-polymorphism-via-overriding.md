# Snippet: polymorphism via overriding

```js
class Shape { area() { return 0; } }
class Square extends Shape {
  constructor(side) { super(); this.side = side; }
  area() { return this.side ** 2; }
}
const shapes = [new Shape(), new Square(4)];
console.log(shapes.map((s) => s.area())); // [0, 16]
```

Calling `.area()` on mixed subclass instances runs each one's own implementation automatically — no type-checking or branching needed at the call site.
