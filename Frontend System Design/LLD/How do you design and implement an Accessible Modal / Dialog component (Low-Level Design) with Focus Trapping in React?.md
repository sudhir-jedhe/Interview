Designing an **Accessible Modal / Dialog** (WAI-ARIA Dialog Pattern) requires strictly managing keyboard focus, background interaction, screen reader announcements, and scroll locking.

Without proper Low-Level Design (LLD), modals create severe accessibility gaps—such as "keyboard traps" in reverse, where screen readers or `Tab` keys leak focus into hidden background DOM nodes behind the overlay.

---

## 1. Requirements & WAI-ARIA Specifications

### Functional Requirements

1. **Focus Trapping:** Cycling forward (`Tab`) or backward (`Shift + Tab`) stays constrained within the modal while open.
2. **Focus Restoration:** Closing the modal immediately returns DOM focus to the element that originally triggered it.
3. **Escape to Close:** Pressing `Escape` closes the modal.
4. **Backdrop & Scroll Locking:** Clicking the backdrop closes the modal, and the underlying page background is disabled from scrolling (`overflow: hidden`).
5. **Portal Rendering:** Renders at the root of the document body (`document.body`) via React Portals to prevent parent container CSS stacking context issues (`z-index` / `overflow: hidden` clips).

### WAI-ARIA Accessibility Requirements

* **`role="dialog"`** (or `role="alertdialog"` for confirmation prompts).
* **`aria-modal="true"`**: Informs screen readers that content beneath the overlay is inert.
* **`aria-labelledby="title-id"`**: Links the modal container to its title element.
* **`aria-describedby="desc-id"`**: Links optional descriptive text.
* **Initial Focus:** Automatically shifts focus to the first focusable element (or close button) upon opening.

---

## 2. Low-Level Component Interface Design

```typescript
// Modal.types.ts
import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  closeOnBackdropClick?: boolean;
}

```

---

## 3. Custom Hooks for Isolation of Concerns

### Custom Hook 1: `useFocusTrap`

Handles capturing, trapping, and restoring keyboard focus.

```typescript
// useFocusTrap.ts
import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';

export function useFocusTrap(
  isOpen: boolean,
  onClose: () => void,
  initialFocusRef?: React.RefObject<HTMLElement | null>
) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store currently focused element to restore focus on unmount
    previousActiveElement.current = document.activeElement as HTMLElement;

    const modalNode = modalRef.current;
    if (!modalNode) return;

    // Find all focusable elements within the modal
    const getFocusableElements = (): HTMLElement[] => {
      return Array.from(
        modalNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
    };

    // Set initial focus
    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus();
    } else {
      const focusables = getFocusableElements();
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        modalNode.focus(); // Fallback focus to container
      }
    }

    // Keydown Handler for Tab Trapping and Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusables = getFocusableElements();
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      // Shift + Tab (Backward cycling)
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } 
      // Tab (Forward cycling)
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to original trigger element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, initialFocusRef]);

  return modalRef;
}

```

### Custom Hook 2: `useBodyScrollLock`

Prevents background page scrolling while the modal is active.

```typescript
// useBodyScrollLock.ts
import { useEffect } from 'react';

export function useBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);
}

```

---

## 4. Component Implementation with React Portals

```tsx
// Modal.tsx
import React, { useId, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { ModalProps } from './Modal.types';
import { useFocusTrap } from './useFocusTrap';
import { useBodyScrollLock } from './useBodyScrollLock';

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
  closeOnBackdropClick = true,
}: ModalProps) {
  const modalRef = useFocusTrap(isOpen, onClose, initialFocusRef);
  useBodyScrollLock(isOpen);

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descId = description ? `${baseId}-desc` : undefined;

  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1} // Makes container focusable as fallback
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          outline: 'none',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id={titleId} style={{ margin: 0, fontSize: '1.25rem' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            &times;
          </button>
        </div>

        {/* Optional Description */}
        {description && (
          <p id={descId} style={{ color: '#666', marginTop: '8px' }}>
            {description}
          </p>
        )}

        {/* Content Body */}
        <div style={{ marginTop: '16px' }}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

```

---

## 5. Usage Example

```tsx
// App.tsx
import React, { useState, useRef } from 'react';
import { Modal } from './Modal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div style={{ padding: '40px' }}>
      <h1>Frontend LLD Modal Demo</h1>
      
      <button onClick={() => setIsModalOpen(true)}>
        Edit User Profile
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Profile"
        description="Update your personal details below."
        initialFocusRef={inputRef} // Directs focus to the input instead of close button
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '4px' }}>
              Username
            </label>
            <input
              ref={inputRef}
              id="username"
              type="text"
              defaultValue="john_doe"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" style={{ backgroundColor: '#0066cc', color: '#fff', border: 'none', padding: '8px 16px' }}>
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

```

---

## Key Edge Cases & Advanced LLD Architecture

| Edge Case                           | Problem                                                                                                                           | Solution                                                                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nested Modals**                   | Opening a second modal over an existing one breaks single `previousActiveElement` restoration and scroll lock reference counting. | Maintain a **Global Modal Stack / Manager** service to keep track of active instances and only restore `overflow: auto` when the stack depth reaches zero. |
| **CSS Stacking Contexts**           | Modal rendered inside a container with `overflow: hidden` or `z-index: 1` gets clipped visually.                                  | Use **`createPortal(children, document.body)`** to break out of local parent DOM constraints.                                                              |
| **Dynamic Content / No Focusables** | If modal content has no buttons or inputs, focus trapping throws `undefined` errors.                                              | Fallback to setting focus directly on the modal container element (`tabIndex={-1}`).                                                                       |
