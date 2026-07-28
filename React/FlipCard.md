# Flipping Card Component (React + TypeScript)

A **Flipping Card** is a popular React machine-coding interview question that tests:

✅ CSS 3D Transforms  
✅ State Management  
✅ Animations  
✅ Reusable Components  
✅ Accessibility

---

## Features

- Click to Flip
- Hover to Flip (optional)
- Front and Back Content
- Smooth 3D Animation
- Reusable API
- Keyboard Accessibility

---

# Folder Structure

```text
src/
├── components/
│   ├── FlipCard.tsx
│   └── FlipCard.css
├── App.tsx
└── main.tsx
```

---

# FlipCard.tsx

```tsx
import { useState } from "react";
import "./FlipCard.css";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  width?: string;
  height?: string;
  flipOnHover?: boolean;
}

export default function FlipCard({
  front,
  back,
  width = "320px",
  height = "220px",
  flipOnHover = false,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (!flipOnHover) {
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <div
      className={`flip-card ${flipOnHover ? "hover-flip" : ""}`}
      style={{
        width,
        height,
      }}
      onClick={handleFlip}
      tabIndex={0}
      role="button"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleFlip();
        }
      }}
    >
      <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card-front">{front}</div>

        <div className="flip-card-back">{back}</div>
      </div>
    </div>
  );
}
```

---

# FlipCard.css

```css
.flip-card {
  perspective: 1000px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;

  transition: transform 0.7s ease;

  transform-style: preserve-3d;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

/* Hover Flip */

.hover-flip:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;

  width: 100%;
  height: 100%;

  backface-visibility: hidden;

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  font-weight: bold;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.flip-card-front {
  background: #2563eb;
  color: white;
}

.flip-card-back {
  background: #111827;
  color: white;

  transform: rotateY(180deg);
}
```

---

# App.tsx

```tsx
import FlipCard from "./components/FlipCard";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        justifyContent: "center",
        marginTop: "80px",
      }}
    >
      <FlipCard
        front={
          <div>
            <h2>React JS</h2>
          </div>
        }
        back={
          <div>
            <p>React is a JavaScript library for building UI.</p>
          </div>
        }
      />

      <FlipCard
        flipOnHover
        front={
          <div>
            <h2>TypeScript</h2>
          </div>
        }
        back={
          <div>
            <p>Strongly typed JavaScript.</p>
          </div>
        }
      />
    </div>
  );
}
```

---

# Vertical Flip Version

Instead of:

```css
rotateY(180deg)
```

Use:

```css
transform: rotateX(180deg);
```

```css
.flip-card-back {
  transform: rotateX(180deg);
}
```

Result:

```text
Top
 ↓
Bottom
```

instead of

```text
Left
 ↔
Right
```

---

# Advanced Version (Auto Flip)

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setIsFlipped((prev) => !prev);
  }, 3000);

  return () => clearInterval(timer);
}, []);
```

Card flips every 3 seconds.

---

# Flash Card Version

Useful for interview questions.

```tsx
<FlipCard front="What is React?" back="React is a UI library." />
```

Perfect for:

```text
Learning Apps
Quiz Applications
Interview Preparation Apps
```

---

# Multiple Cards Grid

```tsx
const cards = [
  {
    question: "React",
    answer: "Library",
  },
  {
    question: "Redux",
    answer: "State Management",
  },
];

return (
  <div className="grid">
    {cards.map((card) => (
      <FlipCard key={card.question} front={card.question} back={card.answer} />
    ))}
  </div>
);
```

---

# Interview Discussion Points

### CSS Concepts

```css
perspective
transform-style: preserve-3d
backface-visibility
rotateY
rotateX
```

### Performance

Use:

```css
transform
```

instead of:

```css
left
top
width
height
```

because transforms are GPU accelerated.

### Accessibility

```tsx
role="button"
tabIndex={0}
```

Support:

```text
Enter
Space
```

for keyboard users.

---

# Design System API

```tsx
<FlipCard
  front={<Front />}
  back={<Back />}
  direction="horizontal"
  trigger="click"
  duration={700}
/>
```

```ts
interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;

  trigger?: "click" | "hover";

  direction?: "horizontal" | "vertical";

  duration?: number;
}
```

---

# Senior-Level Enhancements

✅ Touch Support (Mobile)

✅ Swipe to Flip

✅ Lazy Loaded Content

✅ Skeleton Loading

✅ Analytics Tracking

✅ Flip Groups

✅ Auto Flip

✅ Portal Rendering

✅ Framer Motion Animations

✅ ARIA Accessibility

This is the level of implementation typically expected in a **Senior React / Frontend machine-coding interview** for a reusable **Flipping Card Component**.
