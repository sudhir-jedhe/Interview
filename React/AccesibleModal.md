# Accessible Modal Dialog with Keyboard Interactions (React)

This is one of the most common accessibility-focused React interview questions.

## Requirements

✅ Open Modal

✅ Close Modal

✅ Close on `ESC`

✅ Focus Trap (`TAB` stays inside modal)

✅ Return focus to trigger button

✅ Close on backdrop click

✅ Accessible (`role="dialog"`)

✅ ARIA Support

---

# App.jsx

```jsx
import React, { useRef, useState } from "react";

import Modal from "./Modal";

export default function App() {
  const [open, setOpen] = useState(false);

  const buttonRef = useRef(null);

  return (
    <div>
      <h1>Modal Dialog</h1>

      <button ref={buttonRef} onClick={() => setOpen(true)}>
        Open Modal
      </button>

      {open && (
        <Modal
          onClose={() => {
            setOpen(false);

            buttonRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}
```

---

# Modal.jsx

```jsx
import React, { useEffect, useRef } from "react";

export default function Modal({ onClose }) {
  const modalRef = useRef(null);

  const firstFocusableRef = useRef(null);

  const lastFocusableRef = useRef(null);

  useEffect(() => {
    firstFocusableRef.current?.focus();

    const handleKeyDown = (e) => {
      // ESC

      if (e.key === "Escape") {
        onClose();
      }

      // Focus Trap

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableRef.current) {
            e.preventDefault();

            lastFocusableRef.current?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableRef.current) {
            e.preventDefault();

            firstFocusableRef.current?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div ref={modalRef} className="backdrop" onClick={handleBackdropClick}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal"
      >
        <h2 id="modal-title">Confirm Action</h2>

        <p>Are you sure you want to continue?</p>

        <div>
          <button ref={firstFocusableRef} onClick={onClose}>
            Cancel
          </button>

          <button
            ref={lastFocusableRef}
            onClick={() => {
              alert("Confirmed");

              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

# CSS

```css
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
```

---

# Keyboard Support

## ESC Close

```jsx
if (e.key === "Escape") {
  onClose();
}
```

Behaviour:

```text
ESC
↓
Modal Closes
```

---

## TAB Focus Trap

Before:

```text
Button1
Button2
↓
Focus leaves modal ❌
```

After:

```text
Button1
Button2
↓
Button1 ✅
```

---

## Shift + TAB

```text
Button1
↑ Shift+Tab
↓
Button2 ✅
```

---

# Accessibility

```jsx
role="dialog"
aria-modal="true"
aria-labelledby="modal-title"
```

Screen readers understand:

```text
Dialog Opened
Focus Moved
Modal Active
```

---

# Advanced Production Features

```text
✅ Portal (ReactDOM.createPortal)

✅ Body Scroll Lock

✅ Focus Restoration

✅ Nested Modals

✅ Animations

✅ Framer Motion

✅ Focus Trap Library

✅ Click Outside

✅ Escape Close

✅ Screen Reader Support

✅ Trap Screen Reader Navigation
```

---

# Interview Follow-Up Questions

### Why trap focus?

Without it:

```text
TAB
↓
User reaches page behind modal
```

Bad accessibility.

---

### Why restore focus?

```text
Open Modal
↓
Close Modal
↓
Return to trigger button
```

Required for accessibility.

---

### Why use Portal?

```jsx
ReactDOM.createPortal(modal, document.body);
```

Avoids:

```text
overflow: hidden
z-index issues
stacking-context issues
```

---

# Senior-Level Architecture

```text
ModalProvider
      ↓
Portal
      ↓
FocusTrap
      ↓
Keyboard Manager
      ↓
Modal Component
```

This is the accessibility-compliant implementation typically expected in Senior React machine-coding interviews.

# Production Modal Architecture (Senior / Staff Level)

```text
App
 │
 ▼
ModalProvider
 │
 ▼
Portal Layer
 │
 ▼
FocusTrap
 │
 ▼
Keyboard Manager
 │
 ▼
Modal Component
```

This architecture separates concerns and scales to:

```text
✅ Multiple Modals
✅ Nested Modals
✅ Global Modal Service
✅ Accessibility
✅ ESC Handling
✅ Focus Management
✅ Portals
✅ Animations
✅ Modal Queue
```

---

# Folder Structure

```text
src
│
├── modal
│   ├── ModalProvider.jsx
│   ├── ModalContext.js
│   ├── ModalRoot.jsx
│   ├── FocusTrap.jsx
│   ├── KeyboardManager.jsx
│   ├── Modal.jsx
│   └── useModal.js
│
├── App.jsx
│
└── index.js
```

---

# 1. Modal Context

```jsx
import { createContext, useContext } from "react";

export const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);
```

---

# 2. ModalProvider

Global modal management.

```jsx
import { useState } from "react";

import { ModalContext } from "./ModalContext";

import ModalRoot from "./ModalRoot";

export default function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = (modal) => setModals((prev) => [...prev, modal]);

  const closeModal = () => setModals((prev) => prev.slice(0, -1));

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      {children}

      <ModalRoot modals={modals} />
    </ModalContext.Provider>
  );
}
```

---

# 3. Portal Layer

```jsx
import { createPortal } from "react-dom";

import Modal from "./Modal";

export default function ModalRoot({ modals }) {
  return createPortal(
    <>
      {modals.map((ModalComponent, index) => (
        <Modal key={index}>
          <ModalComponent />
        </Modal>
      ))}
    </>,
    document.body,
  );
}
```

Why Portal?

```text
Avoid z-index issues

Avoid overflow hidden

Render above page
```

---

# 4. Focus Trap

Accessibility requirement.

```jsx
import { useEffect, useRef } from "react";

export default function FocusTrap({ children }) {
  const containerRef = useRef();

  useEffect(() => {
    const focusable = containerRef.current.querySelectorAll(
      "button,input,select,textarea,a[href]",
    );

    const first = focusable[0];

    const last = focusable[focusable.length - 1];

    const handleTab = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();

          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();

          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);

    first?.focus();

    return () => document.removeEventListener("keydown", handleTab);
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
```

---

# 5. Keyboard Manager

Handles all modal keyboard interactions.

```jsx
import { useEffect } from "react";

export default function KeyboardManager({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return null;
}
```

---

# 6. Modal Component

```jsx
import { useModal } from "./ModalContext";

import FocusTrap from "./FocusTrap";

import KeyboardManager from "./KeyboardManager";

export default function Modal({ children }) {
  const { closeModal } = useModal();

  const backdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="backdrop" onClick={backdropClick}>
      <KeyboardManager onClose={closeModal} />

      <FocusTrap>
        <div role="dialog" aria-modal="true" className="modal">
          {children}
        </div>
      </FocusTrap>
    </div>
  );
}
```

---

# Example Usage

```jsx
import { useModal } from "./modal/ModalContext";

function UserModal() {
  const { closeModal } = useModal();

  return (
    <>
      <h2>User Details</h2>

      <button onClick={closeModal}>Close</button>
    </>
  );
}
```

---

# Open Modal Anywhere

```jsx
function Dashboard() {
  const { openModal } = useModal();

  return <button onClick={() => openModal(UserModal)}>Open User Modal</button>;
}
```

---

# Enterprise Extensions

## Modal Queue

```text
Modal A
↓
Modal B
↓
Modal C
```

Stack automatically maintained.

---

## Nested Modals

```text
Settings
  ↓
Theme
   ↓
Theme Preview
```

Supported via stack.

---

## Animation Layer

```jsx
AnimatePresence;
motion.div;
```

Framer Motion integration.

---

## Body Scroll Lock

```jsx
useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "";
  };
}, []);
```

---

# Interview Discussion

### Why Portal?

```text
Modal must render outside
application DOM hierarchy.
```

---

### Why Focus Trap?

```text
Accessibility

TAB
stays inside dialog
```

---

### Why ModalProvider?

```text
Open modal from anywhere

Without prop drilling
```

---

### Why Keyboard Manager?

```text
Single place for

ESC
Enter
Shortcuts

instead of every modal
implementing them
```

---

# Staff Engineer Answer

> A scalable modal system separates modal state management, rendering, accessibility, and keyboard interactions into independent layers. A `ModalProvider` manages the modal stack, a Portal handles rendering outside the DOM hierarchy, a FocusTrap enforces accessibility, a Keyboard Manager centralises shortcut handling, and the Modal component remains a simple presentation layer. This architecture supports nested modals, global modal orchestration, animations, and enterprise-scale applications.
