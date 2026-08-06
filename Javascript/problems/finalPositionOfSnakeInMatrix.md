The problem is asking for the final position of a snake that starts at the top-left corner of a 2D grid and moves based on a sequence of commands. The grid is of size `n x n`, and each cell in the grid can be represented by a unique position derived from its row and column, with the formula:

\[
\text{position} = i \times n + j
\]

Where \( i \) is the row index and \( j \) is the column index of the cell.

### Problem Breakdown:

- We need to process each movement command ("UP", "RIGHT", "DOWN", "LEFT").
- The snake starts at position `0`, which corresponds to the top-left corner `(0, 0)` on the grid.
- The movement commands adjust the snake's coordinates and the final position needs to be calculated after all the commands are processed.

### Key Points:

1. **Up (U)**: Decrease the row index by 1.
2. **Down (D)**: Increase the row index by 1.
3. **Left (L)**: Decrease the column index by 1.
4. **Right (R)**: Increase the column index by 1.

### Approach:

We start by defining two variables `x` and `y` to track the current position of the snake in the grid, where:

- `x` represents the row number.
- `y` represents the column number.

Then, for each command:

- We adjust `x` and `y` according to the direction specified.
- Finally, the position in the grid can be computed using the formula:

\[
\text{position} = x \times n + y
\]

### Plan:

1. Initialize the snake's starting position at `(0, 0)`, so `x = 0` and `y = 0`.
2. Iterate through the `commands` array and adjust the position of the snake based on the command.
3. After processing all commands, compute the final position using the formula above.

### Solution:

```typescript
function finalPositionOfSnake(n: number, commands: string[]): number {
  let x = 0,
    y = 0; // Starting position at top-left corner

  // Loop through each command and update the position
  for (const command of commands) {
    if (command === "UP") {
      x--; // Move up (decrease row)
    } else if (command === "DOWN") {
      x++; // Move down (increase row)
    } else if (command === "LEFT") {
      y--; // Move left (decrease column)
    } else if (command === "RIGHT") {
      y++; // Move right (increase column)
    }
  }

  // Return the final position as (x * n + y)
  return x * n + y;
}
```

### Explanation:

1. **Initialization**: The snake starts at the top-left corner `(0, 0)`, so both `x` and `y` are initialized to `0`.
2. **Command Processing**: For each command:
   - "UP" decreases the row (`x--`).
   - "DOWN" increases the row (`x++`).
   - "LEFT" decreases the column (`y--`).
   - "RIGHT" increases the column (`y++`).
3. **Final Position Calculation**: After processing all commands, we calculate the final position using the formula `x * n + y` to map the `(x, y)` coordinates into a single index in a 1D array.

### Example Walkthrough:

#### Example 1:

```typescript
let n = 2;
let commands = ["RIGHT", "DOWN"];
console.log(finalPositionOfSnake(n, commands)); // Output: 3
```

- The grid looks like this:

```
0 1
2 3
```

- Starting at position 0 (coordinates `(0, 0)`):
  1. "RIGHT" moves the snake to `(0, 1)` (position 1).
  2. "DOWN" moves the snake to `(1, 1)` (position 3).

The final position is 3.

#### Example 2:

```typescript
let n = 3;
let commands = ["DOWN", "RIGHT", "UP"];
console.log(finalPositionOfSnake(n, commands)); // Output: 1
```

- The grid looks like this:

```
0 1 2
3 4 5
6 7 8
```

- Starting at position 0 (coordinates `(0, 0)`):
  1. "DOWN" moves the snake to `(1, 0)` (position 3).
  2. "RIGHT" moves the snake to `(1, 1)` (position 4).
  3. "UP" moves the snake to `(0, 1)` (position 1).

The final position is 1.

### Time Complexity:

- **O(m)**: Where `m` is the length of the `commands` array, since we process each command once.

### Space Complexity:

- **O(1)**: We use only a constant amount of space regardless of the input size.

### Final Thoughts:

This solution efficiently processes the snake's movement in the grid based on the given commands and computes the final position using simple coordinate manipulation and arithmetic.
