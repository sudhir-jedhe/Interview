# `useCycle` Custom Hook (React)

`useCycle` is popular in **Framer Motion** and cycles through a predefined set of values. Under the hood, it can be implemented using `useState` and an index that wraps back to the beginning when it reaches the end. [\[learnreact.design\]](https://learnreact.design/course-posts/prototyping-react-framer/module6-react-state/6.8-understanding-usecycle)

---

# Basic Implementation

```jsx
import { useState, useCallback } from "react";

export function useCycle(...items) {
  const [index, setIndex] = useState(0);

  const cycle = useCallback(() => {
    setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  return [items[index], cycle];
}
```

---

# Usage Example

```jsx
import { useCycle } from "./useCycle";

export default function App() {
  const [mode, cycleMode] = useCycle("light", "dark", "system");

  return (
    <div>
      <h2>Theme: {mode}</h2>

      <button onClick={cycleMode}>Change Theme</button>
    </div>
  );
}
```

---

# Output

```text
light
 ↓
dark
 ↓
system
 ↓
light
 ↓
dark
```

---

# Advanced Production Version

Supports:

```text
✅ next()
✅ previous()
✅ setIndex()
✅ reset()
✅ currentIndex
```

---

## useCycle.js

```jsx
import { useState, useCallback } from "react";

export function useCycle(...items) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const previous = useCallback(() => {
    setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const reset = useCallback(() => {
    setIndex(0);
  }, []);

  return {
    value: items[index],
    index,
    next,
    previous,
    reset,
    setIndex,
  };
}
```

---

# Usage

```jsx
import { useCycle } from "./useCycle";

export default function App() {
  const { value, index, next, previous, reset } = useCycle(
    "Low",
    "Medium",
    "High",
  );

  return (
    <div>
      <h2>
        Priority:
        {value}
      </h2>

      <p>
        Index:
        {index}
      </p>

      <button onClick={previous}>Prev</button>

      <button onClick={next}>Next</button>

      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

# Real Interview Use Cases

## Theme Switcher

```jsx
const [theme, cycleTheme] = useCycle("light", "dark");
```

---

## Traffic Light

```jsx
const [signal, nextSignal] = useCycle("Red", "Yellow", "Green");
```

---

## Stepper

```jsx
const { value: step, next } = useCycle(1, 2, 3, 4);
```

---

## Carousel

```jsx
const { value: image, next, previous } = useCycle(image1, image2, image3);
```

---

# TypeScript Version

```tsx
import { useState, useCallback } from "react";

export function useCycle<T>(...items: T[]) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  return [items[index], next] as const;
}
```

---

# Senior Interview Answer

> `useCycle` is a reusable state hook that cycles through a fixed set of values. It's useful for toggles, themes, steppers, traffic lights, carousels, and animation states. Internally it uses an index maintained with `useState` and wraps around using modulo arithmetic to move from the last value back to the first. This mirrors the behaviour commonly associated with Framer Motion's `useCycle`. [\[learnreact.design\]](https://learnreact.design/course-posts/prototyping-react-framer/module6-react-state/6.8-understanding-usecycle), [\[stackoverflow.com\]](https://stackoverflow.com/questions/71483575/set-the-initial-value-of-framer-motion-usecycle-based-on-screen-width)
