# Chess Path Finder Visualiser (React Machine Coding Interview)

This is an excellent **Frontend + Algorithm** interview problem.

The goal is:

> Visualise the shortest path between two positions on a chessboard for a chess piece (usually a Knight) and animate the path. The shortest-path version is commonly solved using **Breadth-First Search (BFS)** because each valid move has equal cost. [\[baeldung.com\]](https://www.baeldung.com/cs/knights-shortest-path-chessboard), [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/dsa/minimum-steps-reach-target-knight/)

---

# Requirements

✅ Render 8×8 Chess Board

✅ Select Start Cell

✅ Select End Cell

✅ Choose Piece

```text
Knight
Bishop
Rook
Queen
King
```

✅ Find Shortest Path

✅ Visualize Path

✅ Animate Movement

---

# UI

```text
     A B C D E F G H

8    □ □ □ □ □ □ □ □
7    □ □ □ □ □ □ □ □
6    □ □ □ □ □ □ □ □
5    □ □ □ ♞ □ □ □ □
4    □ □ □ □ □ □ □ □
3    □ □ □ □ □ □ □ □
2    □ □ □ □ □ □ □ □
1    □ □ □ □ □ □ □ □

Start: D5
End: H8

[ Find Path ]
```

---

# Data Model

```ts
interface Cell {
  row: number;
  col: number;
}

interface PathNode {
  row: number;
  col: number;
}
```

---

# Knight Moves

Knight can move:

```js
const moves = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];
```

These are the standard knight moves used when modelling the chessboard as a graph. [\[baeldung.com\]](https://www.baeldung.com/cs/knights-shortest-path-chessboard), [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/dsa/minimum-steps-reach-target-knight/)

---

# Why BFS?

Chess Board:

```text
Every square = node

Every legal move = edge
```

Graph:

```text
A1
 │
 ├────► C2
 │
 └────► B3
```

Because all moves cost the same:

```text
Shortest Path
      ↓
Use BFS
```

BFS is a standard approach for knight shortest-path problems on a chessboard. [\[baeldung.com\]](https://www.baeldung.com/cs/knights-shortest-path-chessboard), [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/dsa/minimum-steps-reach-target-knight/), [\[finalroundai.com\]](https://www.finalroundai.com/articles/knights-shortest-path)

---

# BFS Solution

```js
function shortestKnightPath(start, target) {
  const queue = [
    {
      position: start,
      path: [start],
    },
  ];

  const visited = new Set();

  while (queue.length) {
    const { position, path } = queue.shift();

    const key = `${position.row}-${position.col}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (position.row === target.row && position.col === target.col) {
      return path;
    }

    for (const [dx, dy] of moves) {
      const next = {
        row: position.row + dx,
        col: position.col + dy,
      };

      if (next.row >= 0 && next.row < 8 && next.col >= 0 && next.col < 8) {
        queue.push({
          position: next,
          path: [...path, next],
        });
      }
    }
  }

  return [];
}
```

---

# React State

```tsx
const [start, setStart] = useState(null);

const [target, setTarget] = useState(null);

const [path, setPath] = useState([]);
```

---

# Board Rendering

```tsx
<div className="board">
  {Array.from({ length: 8 }).map((_, row) =>
    Array.from({ length: 8 }).map((_, col) => (
      <Cell key={`${row}-${col}`} row={row} col={col} />
    )),
  )}
</div>
```

---

# Visualise Path

```tsx
{
  path.map((position, index) => (
    <div key={index} className="path">
      {position.row},{position.col}
    </div>
  ));
}
```

---

# Animation

```js
function animatePath(path) {
  let index = 0;

  const timer = setInterval(() => {
    setCurrentPosition(path[index]);

    index++;

    if (index >= path.length) {
      clearInterval(timer);
    }
  }, 300);
}
```

---

# Advanced Version

Add Obstacles:

```text
♞ = Knight

💣 = Blocked Cell
```

Now BFS ignores:

```js
if (
  obstacleSet.has(
    nextKey
  )
) {
  continue;
}
```

Obstacle-aware path visualisers are common extensions of pathfinding visualisation tools. [\[github.com\]](https://github.com/cemkagba/-Knight-Path-Finder---Algorithm-Visualizer)

---

# Multi-Piece Support

```ts
interface PieceStrategy {
  getMoves(row: number, col: number): Position[];
}
```

Examples:

```text
Knight
Bishop
Rook
Queen
King
```

Use Strategy Pattern.

---

# Complexity

### Chessboard

```text
Vertices = 64
```

### BFS

```text
Time:
O(64)

Space:
O(64)
```

For a standard chessboard, BFS visits board positions and guarantees the minimum-move solution. [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/dsa/minimum-steps-reach-target-knight/), [\[finalroundai.com\]](https://www.finalroundai.com/articles/knights-shortest-path)

---

# Senior Interview Answer

> I would model the chessboard as an unweighted graph where each square is a node and every legal move is an edge. To find the shortest path for a Knight, I would use BFS because it guarantees the shortest path in an unweighted graph. The React UI would render the board, allow start/end selection, compute the BFS path, and animate traversal step-by-step. For extensibility, I'd use a Strategy Pattern so different chess pieces can provide their own movement rules. [\[baeldung.com\]](https://www.baeldung.com/cs/knights-shortest-path-chessboard), [\[geeksforgeeks.org\]](https://www.geeksforgeeks.org/dsa/minimum-steps-reach-target-knight/)
