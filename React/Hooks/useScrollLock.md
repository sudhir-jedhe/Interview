Here is a production-ready `useScrollLock` React hook. It prevents background scrolling on `<body>` when modals, drawers, or dialogs are open, accounts for scrollbar layout shift (preventing content jump), supports nested modals with an internal lock counter, and cleans up safely on unmount.

```jsx
import { useEffect, useRef, useCallback } from "react";

// Keeps track of active locks globally so nested modals don't prematurely unlock scrolling
let lockCount = 0;
let originalOverflow = "";
let originalPaddingRight = "";

/**
 * Calculates the width of the browser scrollbar to prevent layout shift when locking.
 */
function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * Custom hook to lock body scrolling when overlays/modals are active.
 *
 * @param {boolean} [isLocked=true] - Whether body scrolling should be locked.
 * @param {Object} [options] - Configuration options.
 * @param {boolean} [options.reserveScrollBarGap=true] - Adds padding to body to prevent layout shift.
 */
export function useScrollLock(isLocked = true, options = {}) {
  const { reserveScrollBarGap = true } = options;
  const isLockedRef = useRef(false);

  const lock = useCallback(() => {
    if (typeof document === "undefined" || isLockedRef.current) return;

    const body = document.body;

    if (lockCount === 0) {
      // Store original styles before modifying body
      originalOverflow = body.style.overflow;
      originalPaddingRight = body.style.paddingRight;

      const scrollbarWidth = getScrollbarWidth();

      // Reserve gap to prevent content layout jump when scrollbar disappears
      if (reserveScrollBarGap && scrollbarWidth > 0) {
        const computedPaddingRight = window.getComputedStyle(body).paddingRight;
        const currentPadding = parseFloat(computedPaddingRight) || 0;
        body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
      }

      body.style.overflow = "hidden";
    }

    lockCount += 1;
    isLockedRef.current = true;
  }, [reserveScrollBarGap]);

  const unlock = useCallback(() => {
    if (typeof document === "undefined" || !isLockedRef.current) return;

    lockCount = Math.max(0, lockCount - 1);
    isLockedRef.current = false;

    if (lockCount === 0) {
      const body = document.body;
      body.style.overflow = originalOverflow;
      body.style.paddingRight = originalPaddingRight;
    }
  }, []);

  useEffect(() => {
    if (isLocked) {
      lock();
    } else {
      unlock();
    }

    return () => {
      unlock();
    };
  }, [isLocked, lock, unlock]);

  return { isLocked: isLockedRef.current, lock, unlock };
}

```

---

### Usage Examples

#### 1. Standard Modal Dialog

```jsx
import { useState } from "react";

function Modal({ isOpen, onClose }) {
  // Locks scrolling on mount / when isOpen is true
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Modal Title</h2>
        <p>Background scrolling is disabled while this modal is visible.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

```

#### 2. Imperative Control (`lock` and `unlock`)

```jsx
function Drawer() {
  const { lock, unlock } = useScrollLock(false);

  const handleOpen = () => {
    lock();
    // Open drawer logic...
  };

  const handleClose = () => {
    unlock();
    // Close drawer logic...
  };

  return (
    <div>
      <button onClick={handleOpen}>Open Drawer</button>
      <button onClick={handleClose}>Close Drawer</button>
    </div>
  );
}

```

---

### Key Features

* **Prevents Layout Shift (`reserveScrollBarGap`):** Dynamically calculates scrollbar width (`window.innerWidth - clientWidth`) and adds right padding to `<body>`, avoiding content jump when `overflow: hidden` removes the scrollbar.
* **Nested Overlay Safety (`lockCount`):** Uses an internal counter so that opening a second nested modal doesn't accidentally unlock body scrolling when the nested modal unmounts.
* **Automatic Cleanup:** Safely unlocks scrolling and restores initial body styles on unmount or when `isLocked` becomes `false`.
* **SSR Safe:** Guards against `document` and `window` being undefined during server-side rendering.
