A custom focus trap hook must satisfy four core accessibility requirements:

1. **Initial Focus:** Move focus to the first focusable element (or the modal container itself) upon mounting.
2. **Focus Retention & Cycling:** Intercept `Tab` and `Shift + Tab` key events so focus loops between the first and last focusable elements inside the modal.
3. **Focus Restoration:** Cache `document.activeElement` before the modal opens and restore focus to that exact triggering element when the modal unmounts.
4. **DOM Mutation Resilience:** Dynamically query focusable elements inside the container on each `Tab` press so conditionally rendered inputs/buttons are included without stale references.

---

### 1. Focusable Selectors & Helper Utilities (`utils/focusUtils.ts`)

Identify all interactive DOM elements that can receive keyboard focus and are not disabled or explicitly hidden:

```typescript
export const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
  'select:not([disabled]):not([aria-hidden="true"])',
  'textarea:not([disabled]):not([aria-hidden="true"])',
  'button:not([disabled]):not([aria-hidden="true"])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
].join(', ');

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
  );

  // Filter out elements hidden via CSS display/visibility or zero dimensions
  return elements.filter((el) => {
    return (
      el.offsetWidth > 0 ||
      el.offsetHeight > 0 ||
      el.getClientRects().length > 0
    );
  });
}

```

---

### 2. The Custom Hook (`hooks/useFocusTrap.ts`)

```typescript
import { useEffect, useRef } from 'react';
import { getFocusableElements } from '../utils/focusUtils';

interface UseFocusTrapOptions {
  /** Enables or disables the focus trap */
  isActive: boolean;
  /** Optional initial element selector to focus (defaults to the first focusable element) */
  initialFocusSelector?: string;
  /** Restore focus to the triggering element on unmount/deactivation */
  restoreFocus?: boolean;
}

export function useFocusTrap<T extends HTMLElement>({
  isActive,
  initialFocusSelector,
  restoreFocus = true,
}: UseFocusTrapOptions) {
  const containerRef = useRef<T | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // 1. Cache currently focused element to restore upon close
    triggerElementRef.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    // 2. Set initial focus
    const focusable = getFocusableElements(container);
    if (initialFocusSelector) {
      const explicitElement = container.querySelector<HTMLElement>(initialFocusSelector);
      if (explicitElement) {
        explicitElement.focus();
      }
    } else if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      // Fallback: If no interactive elements exist, ensure container is focusable
      if (!container.hasAttribute('tabindex')) {
        container.setAttribute('tabindex', '-1');
      }
      container.focus();
    }

    // 3. Keydown Listener to Trap 'Tab' and 'Shift + Tab'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableNodes = getFocusableElements(container);

      // If the modal has no focusable elements, prevent default tabbing out
      if (focusableNodes.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableNodes[0];
      const lastElement = focusableNodes[focusableNodes.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: If focused on first element or outside container, loop to last
        if (
          document.activeElement === firstElement ||
          !container.contains(document.activeElement)
        ) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: If focused on last element or outside container, loop to first
        if (
          document.activeElement === lastElement ||
          !container.contains(document.activeElement)
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // 4. Focus Guard: Re-intercept focus if user clicks outside into browser chrome
    const handleFocusIn = (event: FocusEvent) => {
      if (!container.contains(event.target as Node)) {
        const focusableNodes = getFocusableElements(container);
        if (focusableNodes.length > 0) {
          focusableNodes[0].focus();
        } else {
          container.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);

      // 5. Restore focus to the trigger button
      if (restoreFocus && triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    };
  }, [isActive, initialFocusSelector, restoreFocus]);

  return containerRef;
}

```

---

### 3. Accessible Modal Implementation (`Modal.tsx`)

Pair `useFocusTrap` with standard WAI-ARIA dialog attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`):

```tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from './hooks/useFocusTrap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Attach the focus trap to the modal dialog container
  const modalRef = useFocusTrap<HTMLDivElement>({
    isActive: isOpen,
    restoreFocus: true,
  });

  // Handle ESC key press & Body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(2px)',
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
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal body
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 id="modal-title" style={{ margin: 0, fontSize: '1.25rem' }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

```

---

### 4. Verification & Testing

```tsx
import React, { useState } from 'react';
import { Modal } from './Modal';

export function DemoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        style={{ padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}
      >
        Open Account Settings
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Account Details"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <label>
            Username
            <input type="text" style={{ display: 'block', width: '100%', marginTop: '4px' }} />
          </label>
          <label>
            Email Address
            <input type="email" style={{ display: 'block', width: '100%', marginTop: '4px' }} />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

```

---

### Core Mechanics & Edge-Case Protections

* **Dynamic Focus Querying:** `getFocusableElements(container)` is invoked inside the `keydown` event listener rather than once on mount. If child inputs are conditionally shown (e.g., expanding an accordion inside the modal), the focus trap immediately detects the new elements without state desynchronization.
* **`focusin` Guard:** If the user clicks into an un-trapped browser element or extension overlay, the `focusin` listener detects that `document.activeElement` is outside `containerRef` and routes focus back to the first available element inside the modal.
* **Visibility Filtering:** Checking `offsetWidth > 0 || offsetHeight > 0` prevents screen readers and keyboard users from focusing elements hidden via `display: none` or zero height.
