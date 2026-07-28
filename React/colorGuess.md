# Color Game (React) – Complete Solution

This challenge uses an **8×8 grid (64 squares)** where one square has a slightly different colour. The goal is to find it and advance levels. The React Challenges description explicitly mentions identifying the slightly different square in an 8×8 grid and levelling up. [\[reactchallenges.com\]](https://www.reactchallenges.com/challenges/color-game), [\[dev.to\]](https://dev.to/reactchallenges/new-challenge-color-game-394b)

---

## App.tsx

```tsx
import { useState } from "react";

import { getRandomColor, getRandomNumber, getSimilarColor } from "./utils";

const TOTAL_SQUARES = 64;

function createGameState() {
  const baseColor = getRandomColor();

  const correctIndex = getRandomNumber();

  const differentColor = getSimilarColor(baseColor, 20);

  return {
    baseColor,
    differentColor,
    correctIndex,
  };
}

export default function App() {
  const [level, setLevel] = useState(1);

  const [gameOver, setGameOver] = useState(false);

  const [gameState, setGameState] = useState(createGameState());

  function nextLevel() {
    setLevel((prev) => prev + 1);

    setGameState(createGameState());
  }

  function resetGame() {
    setLevel(1);

    setGameOver(false);

    setGameState(createGameState());
  }

  function handleSquareClick(index: number) {
    if (gameOver) return;

    if (index === gameState.correctIndex) {
      nextLevel();
      return;
    }

    setGameOver(true);
  }

  return (
    <div>
      <h1>Color Game</h1>

      <h2 data-testid="level">Level: {level}</h2>

      {gameOver && <h3 data-testid="game-over">Game Over</h3>}

      <button data-testid="reset-btn" onClick={resetGame}>
        Reset Game
      </button>

      <div className="grid grid-cols-8 gap-1" data-testid="board">
        {Array.from({
          length: TOTAL_SQUARES,
        }).map((_, index) => {
          const isCorrect = index === gameState.correctIndex;

          const color = isCorrect
            ? gameState.differentColor
            : gameState.baseColor;

          return (
            <button
              key={index}
              data-testid={`square-${index}`}
              onClick={() => handleSquareClick(index)}
              className={`
                h-10
                w-10
                ${gameOver && isCorrect ? "border-2" : ""}
              `}
              style={{
                backgroundColor: color,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
```

---

# Why This Passes The Tests

### ✅ Renders 64 Squares

```tsx
Array.from({
  length: 64,
});
```

---

### ✅ Correct Square

```tsx
correctIndex = getRandomNumber();
```

One square gets:

```tsx
getSimilarColor(...)
```

while the rest get:

```tsx
baseColor;
```

---

### ✅ Level Up

```tsx
setLevel((prev) => prev + 1);
```

also creates:

```tsx
new baseColor();
new differentColor();
new correctIndex();
```

---

### ✅ Game Over

Wrong click:

```tsx
setGameOver(true);
```

Shows:

```tsx
Game Over
```

---

### ✅ Highlight Correct Answer

After game over:

```tsx
gameOver && isCorrect ? "border-2" : "";
```

Required by test.

---

### ✅ Block Further Clicks

```tsx
if (gameOver) return;
```

No state changes after losing.

---

### ✅ Reset Game

```tsx
setLevel(1);
setGameOver(false);
setGameState(createGameState());
```

Creates:

```text
new colour
new similar colour
new correct square
```

and hides:

```text
Game Over
```

---

## Senior Interview Answer

> I keep the game state separated into `level`, `gameOver`, and the colour configuration (`baseColor`, `differentColor`, `correctIndex`). When the user selects the correct square, I generate a completely new game state and increment the level. When the user selects an incorrect square, the game enters a terminal state and the correct square is revealed with a border. A reset generates a fresh board, resets the level to 1, and clears the game-over state. This keeps the logic predictable and easy to test. [\[reactchallenges.com\]](https://www.reactchallenges.com/challenges/color-game), [\[dev.to\]](https://dev.to/reactchallenges/new-challenge-color-game-394b)
