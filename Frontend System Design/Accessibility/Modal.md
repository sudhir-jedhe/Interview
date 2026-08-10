Building an accessible modal component in React requires managing three core areas: **ARIA attributes** (communicating semantics to screen readers), **focus trapping** (keeping keyboard navigation inside the dialog), and **focus restoration** (returning focus to the trigger element when closed).

Here is a complete, production-ready React implementation.

---

## Complete Accessible Modal Component

```tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Selector for all focusable elements within the modal
  const FOCUSABLE_ELEMENTS_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  useEffect(() => {
    if (isOpen) {
      // 1. Save currently focused element to restore focus later
      previousFocusRef.current = document.activeElement as HTMLElement;

      // 2. Prevent background scrolling while modal is open
      document.body.style.overflow = 'hidden';

      // 3. Move focus inside the modal on open
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        FOCUSABLE_ELEMENTS_SELECTOR
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        modalRef.current?.focus(); // Fallback focus on container
      }
    }

    return () => {
      // Cleanup: restore body scroll and return focus to trigger
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  // Handle Keyboard Navigation (Escape key and Tab focus trap)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Close on Escape key
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    // Trap focus inside modal on Tab key navigation
    if (event.key === 'Tab') {
      if (!modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR)
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab (navigating backward)
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } 
      // Tab (navigating forward)
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  // Render modal into document.body using React Portal
  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className="modal-container"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
        onKeyDown={handleKeyDown}
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            &times;
          </button>
        </header>

        {description && (
          <p id="modal-description" className="sr-only">
            {description}
          </p>
        )}

        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

```

---

## Key Accessibility Features Explained

### 1. ARIA Roles & Labeling

* **`role="dialog"`**: Tells the accessibility tree that this subtree is a modal dialog window.
* **`aria-modal="true"`**: Informs screen readers that content underneath the backdrop is non-interactive while the modal is open.
* **`aria-labelledby="modal-title"`**: Maps the modal's accessible name directly to the `<h2>` heading element via matching IDs.
* **`aria-describedby="modal-description"`**: Connects optional descriptive text or instructions to the modal root so screen readers read it automatically on mount.
* **`aria-label="Close dialog"`**: Provides a clear text label for icon-only close buttons (like `&times;` or SVG icons).

### 2. Focus Management Lifecycle

* **Focus Entry:** On open, `previousFocusRef` stores `document.activeElement` (the trigger button). Focus is immediately shifted to the first interactive element inside the modal.
* **Focus Trapping:** The `onKeyDown` listener intercepts `Tab` and `Shift + Tab` key presses. When reaching the last focusable element, pressing `Tab` wraps focus around to the first element (and vice versa for `Shift + Tab`).
* **Focus Restoration:** On unmount, the cleanup function restores focus back to the saved trigger element, preventing keyboard users from getting "lost" at the top of `<body>`.

### 3. Portal Rendering & Key Interactions

* **`createPortal(..., document.body)`**: Renders the modal DOM nodes outside parent layout constraints to prevent `z-index` and overflow truncation bugs.
* **`Escape` Key Handler**: Allows users to quickly dismiss the overlay without finding the close button.
* **Backdrop Click Dismissal**: Clicking outside the modal container triggers `onClose()`, while `e.stopPropagation()` on the inner container prevents accidental closes when clicking inside the dialog.

---

## Example Usage

```tsx
import React, { useState } from 'react';
import { Modal } from './Modal';

export const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <button 
        type="button" 
        onClick={() => setIsModalOpen(true)}
      >
        Edit Profile
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Profile Information"
        description="Update your personal details below. Press Escape to exit."
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" defaultValue="johndoe" />

          <div style={{ marginTop: '1rem' }}>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

```
