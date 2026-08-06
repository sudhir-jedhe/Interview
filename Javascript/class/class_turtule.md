```js
class Turtle {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  forward(distance) {
    this.x += distance * Math.cos(this.direction);
    this.y += distance * Math.sin(this.direction);
  }

  backward(distance) {
    this.forward(-distance);
  }

  left(angle) {
    this.direction += angle;
  }

  right(angle) {
    this.direction -= angle;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  get heading() {
    return this.direction;
  }
}

const turtle = new Turtle(0, 0, 0);

turtle.forward(100);
turtle.left(90);
turtle.forward(100);

console.log(turtle.position); // { x: 100, y: 100 }

```

The `Turtle` class you've written defines a simple 2D coordinate system where a "turtle" can move around a canvas using basic commands like `forward`, `backward`, `left`, and `right`. Here's an explanation of how the class works:

### Class Breakdown:
- **Constructor:**
  - The `constructor(x, y, direction)` initializes the turtle at a specific `(x, y)` position with a certain `direction`. The `direction` is in radians, with `0` being to the right (East), `π/2` being up (North), and so on.
  
- **Methods:**
  - `forward(distance)`: Moves the turtle forward in its current direction. The distance moved is computed using basic trigonometry, where the turtle’s `x` and `y` positions are updated based on the angle (`direction`).
  - `backward(distance)`: Moves the turtle backward by the same distance (just in the opposite direction).
  - `left(angle)`: Rotates the turtle counterclockwise by the specified angle (in radians).
  - `right(angle)`: Rotates the turtle clockwise by the specified angle (in radians).

- **Getters:**
  - `position`: A getter that returns the current position of the turtle as an object `{ x, y }`.
  - `heading`: A getter that returns the turtle’s current direction (angle in radians).

### Example Usage:
```javascript
const turtle = new Turtle(0, 0, 0); // Initialize turtle at (0, 0) facing right (0 radians)

// Move the turtle forward by 100 units
turtle.forward(100);

// Turn the turtle left by 90 degrees (π/2 radians)
turtle.left(Math.PI / 2);

// Move the turtle forward by another 100 units
turtle.forward(100);

// Output the current position of the turtle
console.log(turtle.position); // { x: 100, y: 100 }
```

### How the Code Works:
1. The turtle starts at `(0, 0)` with a direction of `0` (facing right).
2. The first `forward(100)` call moves the turtle 100 units to the right, updating its position to `(100, 0)`.
3. The `left(Math.PI / 2)` call turns the turtle 90 degrees counterclockwise, so it now faces upward.
4. The second `forward(100)` call moves the turtle 100 units upwards, updating its position to `(100, 100)`.
5. The final `console.log(turtle.position)` outputs `{ x: 100, y: 100 }`, which is the turtle's position after both movements.

### Improvements or Considerations:
- **Angle Normalization:** You might want to ensure that the `direction` always stays within a certain range (e.g., between `0` and `2π`), since turning by large angles could push the direction beyond the typical range.
- **Units:** The class assumes that distances are in the same unit system as the `x` and `y` coordinates, which is fine for most cases, but depending on the context, you might need to clarify or specify the unit (pixels, meters, etc.).

Otherwise, the code looks solid and gives a good simulation of turtle graphics using basic trigonometry for movement and rotation.