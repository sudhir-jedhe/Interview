Extracting focus trapping, focus restoration, keydown management, and body-scroll locking into a custom hook decouples accessibility logic from rendering. This allows you to apply accessibility management to modals, slide-over drawers, comboboxes, and mobile navigation menus without repeating logic.

Here is how to design and build a clean `useDialog` hook.

---

## 1. The `useDialog` Custom Hook

```tsx
import { useEffect, useRef, useCallback } from 'react';

export interface UseDialogOptions {
  isOpen: boolean;
  onClose: () => void;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDialog<T extends HTMLElement = HTMLDivElement>({
  isOpen,
  onClose,
  closeOnEscape = true,
  lockScroll = true,
  initialFocusRef,
}: UseDialogOptions) {
  const containerRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus Trapping & Restoration Logic
  useEffect(() => {
    if (!isOpen) return;

    // 1. Store trigger element for restoration
    previousFocusRef.current = document.activeElement as HTMLElement;

    // 2. Lock body scroll if enabled
    const originalStyle = document.body.style.overflow;
    if (lockScroll) {
      document.body.style.overflow = 'hidden';
    }

    // 3. Move initial focus
    const timer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        const firstFocusable = containerRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          containerRef.current.focus();
        }
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      if (lockScroll) {
        document.body.style.overflow = originalStyle;
      }
      // Restore focus to trigger
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, lockScroll, initialFocusRef]);

  // Keydown Handler for Tab Trapping and Escape key
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent | KeyboardEvent) => {
      if (!isOpen || !containerRef.current) return;

      // Handle Escape Key
      if (closeOnEscape && event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      // Handle Focus Trapping via Tab
      if (event.key === 'Tab') {
        const focusables = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );

        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [isOpen, closeOnEscape, onClose]
  );

  // Props helper for spreading onto the dialog container element
  const getDialogProps = useCallback(
    () => ({
      ref: containerRef,
      tabIndex: -1,
      role: 'dialog' as const,
      'aria-modal': true as const,
      onKeyDown: handleKeyDown,
    }),
    [handleKeyDown]
  );

  return {
    containerRef,
    getDialogProps,
    handleKeyDown,
  };
}

```

---

## 2. Using `useDialog` in a Modal Component

By spreading `getDialogProps()`, the modal component becomes declarative and free of imperative DOM or keyboard-handling logic:

```tsx
import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDialog } from './useDialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Hook handles focus trap, scroll lock, restoration, and escape key
  const { getDialogProps } = useDialog<HTMLDivElement>({
    isOpen,
    onClose,
    initialFocusRef: submitButtonRef, // Optional: auto-focus primary action instead of first element
  });

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        {...getDialogProps()}
        aria-labelledby="dialog-title"
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="dialog-title">{title}</h2>
          <button type="button" aria-label="Close dialog" onClick={onClose}>
            &times;
          </button>
        </header>

        <div className="modal-body">{children}</div>

        <footer className="modal-footer">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          {/* Receives focus on mount via initialFocusRef */}
          <button ref={submitButtonRef} type="button" onClick={onClose}>
            Confirm
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

```

---

## Why This Architecture Works

1. **`getDialogProps` Pattern:** Encapsulates `ref`, `role="dialog"`, `aria-modal="true"`, `tabIndex={-1}`, and the keyboard handler into a single object spread.
2. **Flexible Initial Focus (`initialFocusRef`):** Destructive or complex dialogs often require focusing a specific action (e.g., "Cancel" or a primary submit) rather than the default first focusable node.
3. **Timer-based Focus Mounting:** Using `setTimeout(..., 0)` inside `useEffect` ensures DOM nodes mounted asynchronously or via React Portals are present in the layout tree before invoking `.focus()`.
4. **Reusability across Surfaces:** The hook works identically for slide-out drawers, full-screen mobile menus, and modal dialogs without duplicating focus management code.

To handle nested dialogs (e.g., opening a confirmation modal on top of an edit modal), we need to manage focus as a **stack** (Last-In, First-Out).

Without a stack, two competing dialog hooks will clash over:

1. **Focus Restoration:** Closing Modal B might return focus to the trigger that opened Modal A instead of Modal B's trigger.
2. **Keyboard Events:** Pressing `Escape` or `Tab` might trigger listeners on both Modal A and Modal B simultaneously.
3. **Body Scroll Lock:** Closing Modal B might unlock `document.body.style.overflow` while Modal A is still open.

Here is how to adapt `useDialog` using a global **Dialog Manager Stack**.

---

## 1. The Global Dialog Stack Manager

We create a lightweight module-level stack to track active dialog instances in order of opening.

```typescript
// dialogStack.ts
interface DialogInstance {
  id: string;
  container: HTMLElement;
  restoreFocusTo: HTMLElement | null;
  onClose: () => void;
}

class DialogStack {
  private stack: DialogInstance[] = [];

  push(instance: DialogInstance) {
    this.stack.push(instance);
  }

  pop(id: string): DialogInstance | undefined {
    const index = this.stack.findIndex((item) => item.id === id);
    if (index !== -1) {
      const [removed] = this.stack.splice(index, 1);
      return removed;
    }
    return undefined;
  }

  // Check if a specific dialog is currently at the top of the stack
  isTop(id: string): boolean {
    return this.stack.length > 0 && this.stack[this.stack.length - 1].id === id;
  }

  get count(): number {
    return this.stack.length;
  }

  peek(): DialogInstance | undefined {
    return this.stack[this.stack.length - 1];
  }
}

export const dialogStack = new DialogStack();

```

---

## 2. Updated `useDialog` Hook with Stack Support

We update `useDialog` to register itself with `dialogStack` on mount and verify `dialogStack.isTop(id)` before reacting to `Escape` or `Tab` keys.

```tsx
// useDialog.ts
import { useEffect, useRef, useCallback, useId } from 'react';
import { dialogStack } from './dialogStack';

export interface UseNestedDialogOptions {
  isOpen: boolean;
  onClose: () => void;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDialog<T extends HTMLElement = HTMLDivElement>({
  isOpen,
  onClose,
  closeOnEscape = true,
  lockScroll = true,
  initialFocusRef,
}: UseNestedDialogOptions) {
  const dialogId = useId(); // Unique ID for each dialog instance
  const containerRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Capture currently focused element (the trigger button)
    const activeEl = document.activeElement as HTMLElement;
    previousFocusRef.current = activeEl;

    // Register this instance at the top of the stack
    if (containerRef.current) {
      dialogStack.push({
        id: dialogId,
        container: containerRef.current,
        restoreFocusTo: activeEl,
        onClose,
      });
    }

    // Only lock scroll if this is the FIRST dialog opening
    if (lockScroll && dialogStack.count === 1) {
      document.body.style.overflow = 'hidden';
    }

    // Set initial focus inside this new dialog
    const timer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        const firstFocusable = containerRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          containerRef.current.focus();
        }
      }
    }, 0);

    return () => {
      clearTimeout(timer);

      // Remove from stack
      dialogStack.pop(dialogId);

      // Restore body scroll ONLY when the LAST dialog closes
      if (lockScroll && dialogStack.count === 0) {
        document.body.style.overflow = '';
      }

      // Restore focus specifically to the element that opened THIS dialog
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, dialogId, lockScroll, initialFocusRef, onClose]);

  // Keydown Handler - Gated by stack top check
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent | KeyboardEvent) => {
      if (!isOpen || !containerRef.current) return;

      // CRITICAL: Only process keyboard shortcuts if THIS dialog is active on top!
      if (!dialogStack.isTop(dialogId)) return;

      // 1. Handle Escape Key (Only closes the top dialog)
      if (closeOnEscape && event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      // 2. Handle Focus Trapping via Tab
      if (event.key === 'Tab') {
        const focusables = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );

        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [isOpen, dialogId, closeOnEscape, onClose]
  );

  const getDialogProps = useCallback(
    () => ({
      ref: containerRef,
      tabIndex: -1,
      role: 'dialog' as const,
      'aria-modal': true as const,
      onKeyDown: handleKeyDown,
    }),
    [handleKeyDown]
  );

  return {
    containerRef,
    getDialogProps,
    isTopDialog: dialogStack.isTop(dialogId),
  };
}

```

---

## How Stack Management Solves Nested Dialog Problems

1. **Isolation of Key Events (`dialogStack.isTop`):**
When Modal B is open on top of Modal A, pressing `Escape` only triggers Modal B's `onClose()`. Modal A stays intact underneath.
2. **Strict Focus Restoration Hierarchy:**
When Modal B closes, focus moves cleanly back to the button inside Modal A that opened Modal B. When Modal A closes later, focus returns back to the original page trigger.
3. **Reference-Counted Body Scroll Lock:**
`document.body.style.overflow` is set to `'hidden'` when `dialogStack.count === 1` and cleared only when `dialogStack.count === 0`, preventing background page jitter as sub-dialogs open and close.
4. **ARIA tree separation (`aria-hidden`):**
*(Optional Extension)* You can extend `dialogStack` to automatically apply `aria-hidden="true"` to lower dialogs in the stack so screen readers only announce the top active layer.
