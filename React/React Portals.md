**React Portals** provide a way to render a component's children into a DOM node that exists **outside the DOM hierarchy** of the parent component, while still preserving React's component tree behavior (such as context and event bubbling).

They are most commonly used for UI elements that need to break out of their parent container's CSS styling (e.g., `overflow: hidden`, `z-index`, or `position: relative`), such as **modals, dialogs, tooltips, popovers, and dropdown menus**.

---

## 1. Syntax & Core Usage

Portals are created using `ReactDOM.createPortal(child, container)`:

```tsx
import { createPortal } from 'react-dom';

function Modal({ children }: { children: React.ReactNode }) {
  // Renders `children` into `document.body` instead of its parent DOM node
  return createPortal(
    children,
    document.body
  );
}

```

* **`child`**: Any renderable React child (JSX, element, fragment, string, etc.).
* **`container`**: A valid HTML DOM element (e.g., `document.body` or a specific element like `document.getElementById('modal-root')`).

---

## 2. Complete Example: Accessible Modal Component

### Step 1: Add a Portal Target to `index.html` (Optional but Recommended)

While you can target `document.body`, creating a dedicated root element keeps your HTML clean and organized:

```html
<!-- index.html -->
<div id="root"></div>
<div id="modal-root"></div> <!-- Target for modals -->

```

### Step 2: Create the Portal Modal Component

```tsx
// src/Modal.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  const targetNode = document.getElementById('modal-root') || document.body;

  return createPortal(
    <div style={overlayStyle} onClick={onClose}>
      {/* Prevent clicks inside the modal content from closing it */}
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    targetNode
  );
}

// Inline styles for demonstration
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  padding: '24px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '100%',
  position: 'relative',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};

```

### Step 3: Use the Modal in a Parent Component

Even if the parent container has `overflow: hidden`, the modal will render smoothly on top of everything because it sits inside `#modal-root`.

```tsx
// src/App.tsx
import React, { useState } from 'react';
import { Modal } from './Modal';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '20px', overflow: 'hidden', height: '100px' }}>
      <h1>React Portals Example</h1>
      
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Modal Title</h2>
        <p>This content is rendered outside the parent container DOM node!</p>
      </Modal>
    </div>
  );
}

```

---

## 3. Key Concepts to Remember

### Event Bubbling Through Portals

Even though a portal renders in a different DOM node, **it still behaves like a normal React child in the React virtual DOM tree**. This means event bubbling works seamlessly across portals.

An event fired from inside a portal will bubble up to ancestors in the **React tree**, even if those elements are not ancestors in the **DOM tree**:

```tsx
function Parent() {
  return (
    // Clicks originating from inside Modal will trigger this handler!
    <div onClick={() => console.log('Click caught in Parent!')}>
      <Modal>
        <button>Click me</button>
      </Modal>
    </div>
  );
}

```

### React Context Preservation

Portals maintain access to all React Context providers (`ThemeProvider`, custom contexts, state hooks) established higher up in the React component tree, regardless of where they reside in the actual DOM.

---

## 4. Portals vs. Standard DOM Nodes

| Feature            | Standard Component Render                             | React Portal                                         |
| ------------------ | ----------------------------------------------------- | ---------------------------------------------------- |
| **DOM Position**   | Nested inside parent DOM node                         | Appended to specified target (e.g., `document.body`) |
| **CSS Context**    | Affected by parent `overflow`, `z-index`, `transform` | Escapes parent CSS stacking context                  |
| **React Context**  | Maintained                                            | Maintained                                           |
| **Event Bubbling** | Native DOM & React tree                               | Follows React virtual component tree                 |
