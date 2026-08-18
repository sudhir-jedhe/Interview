Managing nested modals requires solving three distinct challenges:

1. **Dynamic $Z$-Index Hierarchy:** Ensuring each child modal automatically renders above its parent backdrop and content.
2. **Layered Focus Traps:** Ensuring only the **topmost (active) modal** traps keyboard navigation and intercepts the `Escape` key, while underlying parent modals temporarily suspend their listeners.
3. **Accessibility Isolation (`aria-hidden`):** Hiding background layers and underlying parent modals from assistive technologies while a nested child dialog is open.

---

### 1. The Modal Stack Manager (`context/ModalStackContext.tsx`)

A global stack tracks the active modal instances. When a new modal registers, it receives an incremented $z$-index offset, and only the modal at the top of the stack (`modalId === activeModalId`) activates its focus trap and `Escape` listeners.

```tsx
import React, { createContext, useContext, useState, useCallback, useId } from 'react';

interface ModalStackContextType {
  registerModal: (id: string) => number; // Returns dynamic z-index
  unregisterModal: (id: string) => void;
  isTopModal: (id: string) => boolean;
}

const ModalStackContext = createContext<ModalStackContextType | null>(null);

const BASE_Z_INDEX = 1000;
const Z_INDEX_STEP = 20;

export const ModalStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<string[]>([]);

  const registerModal = useCallback((id: string) => {
    setStack((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });

    // Compute z-index based on index depth in stack
    const index = stack.indexOf(id);
    const depth = index === -1 ? stack.length : index;
    return BASE_Z_INDEX + depth * Z_INDEX_STEP;
  }, [stack]);

  const unregisterModal = useCallback((id: string) => {
    setStack((prev) => prev.filter((modalId) => modalId !== id));
  }, []);

  const isTopModal = useCallback(
    (id: string) => {
      return stack.length > 0 && stack[stack.length - 1] === id;
    },
    [stack]
  );

  return (
    <ModalStackContext.Provider value={{ registerModal, unregisterModal, isTopModal }}>
      {children}
    </ModalStackContext.Provider>
  );
};

export const useModalStack = () => {
  const context = useContext(ModalStackContext);
  if (!context) throw new Error('useModalStack must be used within ModalStackProvider');
  return context;
};

```

---

### 2. Focus Trap with Stack Awareness (`hooks/useStackedFocusTrap.ts`)

This hook checks `isTopModal(id)`. If this modal is buried under a nested modal, it suspends its `Tab` cycling and `Escape` handlers until the nested modal closes.

```typescript
import { useEffect, useRef } from 'react';

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled]):not([aria-hidden="true"])',
  'textarea:not([disabled]):not([aria-hidden="true"])',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
  'select:not([disabled]):not([aria-hidden="true"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function useStackedFocusTrap<T extends HTMLElement>(
  isOpen: boolean,
  isTop: boolean,
  onClose: () => void
) {
  const containerRef = useRef<T | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Cache the active trigger element when the modal first opens
    if (!triggerRef.current) {
      triggerRef.current = document.activeElement as HTMLElement | null;
    }

    const container = containerRef.current;
    if (!container) return;

    // Only autofocus and trap if this modal is currently at the top of the stack
    if (isTop) {
      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        container.focus();
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only the topmost modal handles ESC and Tab cycling
      if (!isTop) return;

      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusableNodes = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
        ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);

        if (focusableNodes.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusableNodes[0];
        const last = focusableNodes[focusableNodes.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first || !container.contains(document.activeElement)) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !container.contains(document.activeElement)) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isTop, onClose]);

  // Restore focus to trigger button when modal completely unmounts
  useEffect(() => {
    return () => {
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, []);

  return containerRef;
}

```

---

### 3. Nested Modal Component (`components/Modal.tsx`)

```tsx
import React, { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useModalStack } from '../context/ModalStackContext';
import { useStackedFocusTrap } from '../hooks/useStackedFocusTrap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalId = useId();
  const { registerModal, unregisterModal, isTopModal } = useModalStack();

  const isTop = isTopModal(modalId);
  const modalRef = useStackedFocusTrap<HTMLDivElement>(isOpen, isTop, onClose);

  useEffect(() => {
    if (isOpen) {
      registerModal(modalId);
      // Lock root body scroll
      document.body.style.overflow = 'hidden';
    } else {
      unregisterModal(modalId);
    }

    return () => {
      unregisterModal(modalId);
      document.body.style.overflow = '';
    };
  }, [isOpen, modalId, registerModal, unregisterModal]);

  if (!isOpen) return null;

  const zIndex = registerModal(modalId);

  return createPortal(
    <div
      role="presentation"
      onClick={isTop ? onClose : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex, // Dynamic stacked z-index
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal={isTop}
        aria-hidden={!isTop} // Hide inactive parent modals from screen readers
        aria-labelledby={`title-${modalId}`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          outline: 'none',
          pointerEvents: isTop ? 'auto' : 'none', // Disable interactions on parent modal
          opacity: isTop ? 1 : 0.85, // Subtle visual dimming for parent dialogs
          transform: isTop ? 'scale(1)' : 'scale(0.97)',
          transition: 'all 0.15s ease-out',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 id={`title-${modalId}`} style={{ margin: 0, fontSize: '18px' }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}
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

### 4. Nested Modals in Action

```tsx
import React, { useState } from 'react';
import { ModalStackProvider } from './context/ModalStackContext';
import { Modal } from './components/Modal';

function DemoAppContent() {
  const [isParentOpen, setIsParentOpen] = useState(false);
  const [isChildOpen, setIsChildOpen] = useState(false);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <button
        type="button"
        onClick={() => setIsParentOpen(true)}
        style={{ padding: '10px 18px', cursor: 'pointer' }}
      >
        Open Parent Modal
      </button>

      {/* Layer 1: Parent Modal */}
      <Modal
        isOpen={isParentOpen}
        onClose={() => setIsParentOpen(false)}
        title="Parent Settings Modal"
      >
        <p>This is the primary modal window (Base $z$-index: 1000).</p>
        <button
          type="button"
          onClick={() => setIsChildOpen(true)}
          style={{ padding: '8px 14px', marginTop: '12px', cursor: 'pointer' }}
        >
          Open Nested Confirmation
        </button>

        {/* Layer 2: Nested Child Modal */}
        <Modal
          isOpen={isChildOpen}
          onClose={() => setIsChildOpen(false)}
          title="Confirm Nested Action"
        >
          <p>This child modal stacks on top ($z$-index: 1020). Pressing <code>ESC</code> or <code>Tab</code> controls only this box.</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsChildOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setIsChildOpen(false);
                setIsParentOpen(false);
              }}
              style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
            >
              Confirm & Close All
            </button>
          </div>
        </Modal>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <ModalStackProvider>
      <DemoAppContent />
    </ModalStackProvider>
  );
}

```

---

### Architectural Highlights

* **Single Escape Key Interception:** `event.stopPropagation()` on the active topmost modal ensures pressing `Escape` closes only the innermost child rather than dismissing the entire modal stack simultaneously.
* **Assistive Tech Isolation:** Setting `aria-hidden={!isTop}` and `pointer-events: none` on underlying modals prevents screen readers and touch events from interacting with background dialogs.
* **Portal Stacking:** Rendering every modal directly into `document.body` ensures DOM siblings stack cleanly by CSS `z-index` without clipping from parent container overflow boundaries.
