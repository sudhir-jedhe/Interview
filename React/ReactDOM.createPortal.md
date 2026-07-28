**`ReactDOM.createPortal`** is a built-in React DOM method that allows you to render a component's JSX into a **different DOM node** outside the parent component's DOM hierarchy, while still preserving its position in the React component tree.

It is primarily used to break out of CSS containers that have `overflow: hidden`, `z-index`, or `transform` styles that constrain child elements.

---

## Syntax

```tsx
import { createPortal } from 'react-dom';

createPortal(children, containerDomNode, key?)

```

- **`children`**: Anything that React can render (JSX, string, component, fragment).
- **`containerDomNode`**: A real DOM element where you want the JSX to render (e.g., `document.body` or `document.getElementById('modal-root')`).
- **`key`** _(optional)_: A unique string or number to use as the portal's key.

---

## Common Use Cases

- **Modals / Dialogs:** Overlays that need to be centered over the entire page.
- **Tooltips / Popovers:** Floating elements positioned relative to a trigger without getting clipped by overflow containers.
- **Dropdown Menus:** Menus that should escape overflowing cards or scrollable tables.
- **Toasts / Notifications:** Fixed notifications positioned at the screen edge.

---

## Code Example: Accessible Modal Portal

### 1. HTML Container (`index.html`)

Add a dedicated DOM node outside your main `#root` div:

```html
<body>
  <div id="root"></div>
  <!-- Dedicated target container for portals -->
  <div id="modal-root"></div>
</body>
```

### 2. Modal Component (`Modal.tsx`)

```tsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure portals only attempt client-side rendering (protects SSR/Next.js)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      {/* Stop click propagation so clicking inside the modal content doesn't close it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>,
    modalRoot, // Renders inside <div id="modal-root"> instead of the parent hierarchy
  );
}
```

---

## Important Rules & Behavior

### 1. Event Bubbling Still Follows the React Tree

Even though a portaled element physically resides elsewhere in the real DOM tree, **React synthetic events bubble up through the React tree**, not the DOM tree.

```tsx
// Example: The button inside the portal triggers the parent's onClick handler!
function Parent() {
  return (
    <div onClick={() => console.log("Parent received click event!")}>
      <Modal isOpen={true}>
        {/* Even though this button is in document.body, clicking it triggers Parent's onClick */}
        <button>Click Me</button>
      </Modal>
    </div>
  );
}
```

### 2. Context Protection

Portals retain access to React Context provided by their parents higher up in the React tree. Theme providers, Router contexts, and state stores work seamlessly inside a portal.

### 3. Server-Side Rendering (SSR) Guard

Because `document.getElementById` and `document.body` do not exist during Server-Side Rendering (SSR) in frameworks like Next.js, portals should only render on the client side (after component mounting inside `useEffect` or using `typeof window !== 'undefined'`).
