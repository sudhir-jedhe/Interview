# Problem: A factory function that creates different "shape" objects based on a type parameter

**Task:** Write a factory function `createShape(type, ...args)` that returns different object shapes (circle, rectangle, triangle) sharing a common interface (`area()`, `perimeter()`, `describe()`), without exposing separate classes to the caller.

## Full solution

```js
function createShape(type, ...args) {
  switch (type) {
    case "circle": {
      const [radius] = args;
      return {
        type,
        area: () => Math.PI * radius ** 2,
        perimeter: () => 2 * Math.PI * radius,
        describe() {
          return `${this.type} with radius ${radius}: area=${this.area().toFixed(2)}, perimeter=${this.perimeter().toFixed(2)}`;
        },
      };
    }
    case "rectangle": {
      const [width, height] = args;
      return {
        type,
        area: () => width * height,
        perimeter: () => 2 * (width + height),
        describe() {
          return `${this.type} ${width}x${height}: area=${this.area()}, perimeter=${this.perimeter()}`;
        },
      };
    }
    case "triangle": {
      const [base, height, sideB, sideC] = args;
      return {
        type,
        area: () => 0.5 * base * height,
        perimeter: () => base + sideB + sideC,
        describe() {
          return `${this.type} base=${base}: area=${this.area()}, perimeter=${this.perimeter()}`;
        },
      };
    }
    default:
      throw new Error(`Unknown shape type: "${type}"`);
  }
}

const circle = createShape("circle", 3);
const rect = createShape("rectangle", 4, 5);
const tri = createShape("triangle", 6, 4, 5, 5);

console.log(circle.describe()); // circle with radius 3: area=28.27, perimeter=18.85
console.log(rect.describe());   // rectangle 4x5: area=20, perimeter=18
console.log(tri.describe());    // triangle base=6: area=12, perimeter=16

try {
  createShape("hexagon");
} catch (err) {
  console.log(err.message); // Unknown shape type: "hexagon"
}
```

## Why a factory here

The caller never needs to know there are three different construction paths behind `createShape` — they just ask for a `"circle"` and get back an object with a consistent `area()`/`perimeter()`/`describe()` interface. This centralizes "which concrete shape to build" logic in one place, makes adding a fourth shape type a one-file change, and avoids forcing every caller to `import Circle, Rectangle, Triangle` and pick the right constructor themselves.
