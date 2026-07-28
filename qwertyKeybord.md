Here is a complete, responsive QWERTY Virtual Keyboard component built from scratch in React and plain CSS. It supports dynamic layouts (uppercase, lowercase, numbers, and symbols), backspace, enter, and interactive typing feedback.

---

## The Keyboard Component (`Keyboard.jsx`)

```jsx
import React, { useState, useEffect, useCallback } from "react";
import "./Keyboard.css";

// Layout maps for standard QWERTY, shifted, and numeric/symbol modes
const LAYOUTS = {
  default: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["shift", "z", "x", "c", "v", "b", "n", "m", "backspace"],
    ["123", "space", "enter"],
  ],
  shift: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["shift", "Z", "X", "C", "V", "B", "N", "M", "backspace"],
    ["123", "space", "enter"],
  ],
  numbers: [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["@", "#", "$", "%", "&", "-", "+", "(", ")"],
    ["ABC", "!", '"', "'", ":", ";", "?", "backspace"],
    ["space", "enter"],
  ],
};

export default function Keyboard({ onKeyPress, onBackspace, onEnter }) {
  const [layoutMode, setLayoutMode] = useState("default"); // 'default' | 'shift' | 'numbers'
  const [activeKey, setActiveKey] = useState(null);

  // Handle virtual key clicks
  const handleKeyClick = useCallback(
    (key) => {
      setActiveKey(key);
      setTimeout(() => setActiveKey(null), 150);

      switch (key) {
        case "shift":
          setLayoutMode((prev) => (prev === "shift" ? "default" : "shift"));
          break;
        case "123":
          setLayoutMode("numbers");
          break;
        case "ABC":
          setLayoutMode("default");
          break;
        case "backspace":
          if (onBackspace) onBackspace();
          break;
        case "enter":
          if (onEnter) onEnter();
          break;
        case "space":
          if (onKeyPress) onKeyPress(" ");
          break;
        default:
          if (onKeyPress) onKeyPress(key);
          // Auto un-shift after typing a character
          if (layoutMode === "shift") {
            setLayoutMode("default");
          }
          break;
      }
    },
    [layoutMode, onKeyPress, onBackspace, onEnter],
  );

  // Sync with physical hardware keyboard presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      let key = e.key;

      if (key === "Backspace") key = "backspace";
      else if (key === "Enter") key = "enter";
      else if (key === " ") key = "space";
      else if (key === "Shift") {
        setLayoutMode((prev) => (prev === "shift" ? "default" : "shift"));
        return;
      }

      // Check if key exists in current layout
      const currentRows = LAYOUTS[layoutMode];
      const keyExists = currentRows.some((row) =>
        row.some((k) => k.toLowerCase() === key.toLowerCase() || k === key),
      );

      if (
        keyExists ||
        key === "backspace" ||
        key === "enter" ||
        key === "space"
      ) {
        setActiveKey(key === " " ? "space" : key);
        setTimeout(() => setActiveKey(null), 150);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [layoutMode]);

  // Render label or icon for special keys
  const getKeyLabel = (key) => {
    switch (key) {
      case "shift":
        return layoutMode === "shift" ? "⇪" : "⇧";
      case "backspace":
        return "⌫";
      case "enter":
        return "↵";
      case "space":
        return "space";
      default:
        return key;
    }
  };

  const currentLayout = LAYOUTS[layoutMode];

  return (
    <div
      className="keyboard-container"
      role="region"
      aria-label="Virtual Keyboard"
    >
      {currentLayout.map((row, rowIndex) => (
        <div className="keyboard-row" key={`row-${rowIndex}`}>
          {row.map((key) => {
            const isSpecial = [
              "shift",
              "backspace",
              "enter",
              "123",
              "ABC",
              "space",
            ].includes(key);
            const isActive =
              activeKey === key || (key === "shift" && layoutMode === "shift");

            return (
              <button
                key={key}
                type="button"
                className={`key ${isSpecial ? `key-${key}` : ""} ${isActive ? "active" : ""}`}
                onClick={() => handleKeyClick(key)}
              >
                {getKeyLabel(key)}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
```

---

## Responsive Styles (`Keyboard.css`)

Using CSS Grid/Flexbox and **Viewport Width (`vw`) / `cqw**` units ensures key sizes auto-scale smoothly across mobile screens, tablets, and desktop displays.

```css
:root {
  --key-bg: #e2e8f0;
  --key-bg-hover: #cbd5e1;
  --key-bg-active: #94a3b8;
  --key-special-bg: #cbd5e1;
  --key-text-color: #0f172a;
  --keyboard-bg: #f8fafc;
  --border-radius: 6px;
}

/* Dark mode support out of the box */
@media (prefers-color-scheme: dark) {
  :root {
    --key-bg: #334155;
    --key-bg-hover: #475569;
    --key-bg-active: #64748b;
    --key-special-bg: #1e293b;
    --key-text-color: #f8fafc;
    --keyboard-bg: #0f172a;
  }
}

.keyboard-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: var(--keyboard-bg);
  border-radius: 12px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  user-select: none;
  touch-action: manipulation;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 6px;
  width: 100%;
}

/* Default styling for standard keys */
.key {
  flex: 1;
  min-width: 0;
  height: clamp(40px, 6vw, 54px);
  background-color: var(--key-bg);
  color: var(--key-text-color);
  border: none;
  border-radius: var(--border-radius);
  font-size: clamp(14px, 2.5vw, 18px);
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.1s ease,
    transform 0.05s ease;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.15);
}

.key:hover {
  background-color: var(--key-bg-hover);
}

.key:active,
.key.active {
  background-color: var(--key-bg-active);
  transform: translateY(2px);
  box-shadow: none;
}

/* Flex sizing for special modifier keys */
.key-shift,
.key-backspace {
  flex: 1.5;
  background-color: var(--key-special-bg);
}

.key-123,
.key-ABC {
  flex: 1.5;
  background-color: var(--key-special-bg);
  font-size: clamp(12px, 2vw, 14px);
}

.key-enter {
  flex: 2;
  background-color: #2563eb;
  color: #ffffff;
}

.key-enter:hover {
  background-color: #1d4ed8;
}

.key-space {
  flex: 5;
  font-size: 13px;
  color: var(--key-text-color);
  opacity: 0.8;
}

/* Mobile viewport adjustments */
@media (max-width: 480px) {
  .keyboard-container {
    gap: 5px;
    padding: 8px;
    border-radius: 0;
  }

  .keyboard-row {
    gap: 4px;
  }

  .key {
    height: 48px;
    border-radius: 4px;
  }
}
```

---

## Example Usage App (`App.jsx`)

Here is how you wire up the `Keyboard` component to a text field state:

```jsx
import React, { useState } from "react";
import Keyboard from "./Keyboard";

export default function App() {
  const [text, setText] = useState("");

  const handleKeyPress = (char) => {
    setText((prev) => prev + char);
  };

  const handleBackspace = () => {
    setText((prev) => prev.slice(0, -1));
  };

  const handleEnter = () => {
    setText((prev) => prev + "\n");
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Virtual QWERTY Keyboard</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here or click virtual keys below..."
        rows={5}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          marginBottom: "20px",
          boxSizing: "border-box",
          resize: "vertical",
        }}
      />

      <Keyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onEnter={handleEnter}
      />
    </div>
  );
}
```

---

### Key Features Included

1. **Dynamic Layout Switching:** Handles uppercase/lowercase toggling (`⇧ Shift`) and numeric/symbol layouts (`123` / `ABC`).
2. **Physical Hardware Sync:** Captures `keydown` events from physical desktop keyboards to trigger visual press animations on the virtual keys.
3. **Fluid Responsiveness:** Uses CSS `clamp()` and flex ratios (`flex: 1.5`, `flex: 5`) so key sizes automatically fit everything from small smartphones to large desktops without overflowing.
4. **Dark Mode Support:** Automatically detects system theme preference using `@media (prefers-color-scheme: dark)`.
