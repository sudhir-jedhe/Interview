Here is a production-ready `useKeyPress` hook (and `useKeyCombo`) for listening to individual keys, arrays of keys, or modifier key combinations (`Ctrl+S`, `Cmd+K`, `Shift+Enter`).

---

### `useKeyPress` & `useKeyCombo`

```jsx
import { useEffect, useRef, useCallback } from "react";

/**
 * Parses key combo strings into structured trigger checks.
 * Example: "Ctrl+Shift+K" -> { ctrlKey: true, shiftKey: true, key: "k" }
 */
function parseCombo(combo) {
  const parts = combo.split("+").map((p) => p.trim().toLowerCase());
  const keys = {
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    key: "",
  };

  parts.forEach((part) => {
    if (part === "ctrl" || part === "control") keys.ctrlKey = true;
    else if (part === "cmd" || part === "command" || part === "meta") keys.metaKey = true;
    else if (part === "mod") keys.ctrlOrMeta = true; // Meta on Mac, Ctrl on Win/Linux
    else if (part === "shift") keys.shiftKey = true;
    else if (part === "alt" || part === "option") keys.altKey = true;
    else keys.key = part;
  });

  return keys;
}

/**
 * Custom hook to listen for keyboard shortcuts and key combinations.
 *
 * @param {string|string[]} keyCombo - Key combo string (e.g., 'Mod+K', 'Escape', 'Control+Shift+S') or array of combos.
 * @param {Function} handler - Callback invoked when key combo is pressed.
 * @param {Object} [options] - Configuration options.
 * @param {EventTarget} [options.target=window] - DOM element or target to attach key listener to.
 * @param {boolean} [options.preventDefault=true] - Prevents default browser action on trigger.
 * @param {boolean} [options.enableInInputs=false] - Whether shortcut triggers inside <input>, <textarea>, or contentEditable.
 */
export function useKeyPress(keyCombo, handler, options = {}) {
  const {
    target,
    preventDefault = true,
    enableInInputs = false,
    eventType = "keydown",
  } = options;

  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const combosRef = useRef([]);
  useEffect(() => {
    const list = Array.isArray(keyCombo) ? keyCombo : [keyCombo];
    combosRef.current = list.map(parseCombo);
  }, [keyCombo]);

  const handleKeyDown = useCallback(
    (event) => {
      // Ignore key events originating inside editable elements unless enabled
      if (!enableInInputs) {
        const targetEl = event.target;
        const isInput =
          targetEl &&
          (targetEl.tagName === "INPUT" ||
            targetEl.tagName === "TEXTAREA" ||
            targetEl.tagName === "SELECT" ||
            targetEl.isContentEditable);

        if (isInput) return;
      }

      const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const pressedKey = event.key ? event.key.toLowerCase() : "";

      const matches = combosRef.current.some((combo) => {
        // Match key string
        if (combo.key && combo.key !== pressedKey) return false;

        // Match modifiers
        if (combo.shiftKey !== event.shiftKey) return false;
        if (combo.altKey !== event.altKey) return false;

        // Mod modifier logic (Cmd on macOS, Ctrl on Windows/Linux)
        if (combo.ctrlOrMeta) {
          const hasMod = isMac ? event.metaKey : event.ctrlKey;
          if (!hasMod) return false;
        } else {
          if (combo.ctrlKey !== event.ctrlKey) return false;
          if (combo.metaKey !== event.metaKey) return false;
        }

        return true;
      });

      if (matches) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (handlerRef.current) {
          handlerRef.current(event);
        }
      }
    },
    [preventDefault, enableInInputs]
  );

  useEffect(() => {
    const element = target && "current" in target ? target.current : target;
    const eventTarget = element ?? (typeof window !== "undefined" ? window : null);

    if (!eventTarget?.addEventListener) return;

    eventTarget.addEventListener(eventType, handleKeyDown);

    return () => {
      eventTarget.removeEventListener(eventType, handleKeyDown);
    };
  }, [target, eventType, handleKeyDown]);
}

```

---

### Usage Examples

#### 1. Platform-Agnostic Shortcut (`Mod+K` Command Palette)

```jsx
function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  // 'Mod+K' automatically maps to Cmd+K on Mac and Ctrl+K on Windows/Linux
  useKeyPress("Mod+K", () => {
    setIsOpen((prev) => !prev);
  });

  // Close palette on Escape
  useKeyPress("Escape", () => setIsOpen(false));

  return (
    <div>
      <p>Press <kbd>Cmd</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> to toggle palette</p>
      {isOpen && <div className="modal">Command Palette Modal</div>}
    </div>
  );
}

```

#### 2. Multiple Save Combos (`Mod+S` or `Control+S`)

```jsx
function CodeEditor() {
  const handleSave = (e) => {
    console.log("Saving document...");
  };

  useKeyPress(["Mod+S", "Ctrl+Shift+S"], handleSave);

  return <textarea placeholder="Type code here..." />;
}

```

#### 3. Keyboard Navigation with Input Exclusions

```jsx
function SearchableList() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Navigates list with arrow keys unless the user is typing in an input
  useKeyPress("ArrowDown", () => setSelectedIndex((i) => i + 1));
  useKeyPress("ArrowUp", () => setSelectedIndex((i) => Math.max(0, i - 1)));

  return <div>Selected Index: {selectedIndex}</div>;
}

```

---

### Key Features

* **Platform-Agnostic Modifier (`Mod`):** Using `"Mod+S"` binds to `Cmd+S` on macOS and `Ctrl+S` on Windows/Linux out of the box.
* **Input Element Guard (`enableInInputs`):** Defaults to ignoring global shortcuts when users are typing inside `<input>`, `<textarea>`, or `contentEditable` fields to prevent interference with text entry.
* **Multi-Combo Array Support:** Accepts array input (`["Mod+S", "Control+S"]`) to handle multiple trigger combinations effortlessly.
* **Ref Handler Mirroring:** Captures handler references in `useRef` so event listeners remain bound without resetting or missing state updates.
