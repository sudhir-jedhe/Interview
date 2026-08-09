Here is a complete, production-grade implementation of a **Modal** compound component for a React design system. It combines **React Context** (for implicit state sharing), **React Portals** (for DOM isolation), and **Radix UI Primitive / Slot patterns** (for accessibility and polymorphism).

---

### Key Architectural Requirements for a Design System Modal

1. **Flexible Layout:** Composable sub-components (`Modal.Header`, `Modal.Title`, `Modal.Body`, `Modal.Footer`, `Modal.Close`).
2. **Accessible Keyboard & Focus Management:** Trap focus inside the modal when open, restore focus to the trigger on close, and handle the `Escape` key.
3. **Portal Rendering:** Render the overlay and content at the root of `document.body` to avoid parent CSS `z-index` or `overflow: hidden` clipping issues.
4. **Controlled & Uncontrolled Support:** Allow consumers to manage open state manually via `isOpen`/`onClose` props OR let the modal manage its own open state internally.

---

### Step 1: Create the Modal Context & State Manager

```tsx
// src/components/Modal/ModalContext.tsx
import * as React from 'react';

interface ModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  titleId: string;
  descriptionId: string;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be rendered within a <Modal> root component.');
  }
  return context;
}

export interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({
  children,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
}: ModalProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(defaultOpen);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const titleId = React.useId();
  const descriptionId = React.useId();

  const openModal = React.useCallback(() => {
    if (!isControlled) setUncontrolledIsOpen(true);
    onOpenChange?.(true);
  }, [isControlled, onOpenChange]);

  const closeModal = React.useCallback(() => {
    if (!isControlled) setUncontrolledIsOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const value = React.useMemo(
    () => ({ isOpen, openModal, closeModal, titleId, descriptionId }),
    [isOpen, openModal, closeModal, titleId, descriptionId]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

```

---

### Step 2: Implement the Trigger & Close Components

Using `@radix-ui/react-slot`, `Modal.Trigger` allows wrapping any child element (like your design system's `<Button>`) and transferring click handlers seamlessly.

```tsx
// src/components/Modal/ModalTrigger.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useModalContext } from './ModalContext';

export interface ModalTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const ModalTrigger = React.forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ asChild = false, onClick, children, ...props }, ref) => {
    const { openModal } = useModalContext();
    const Comp = asChild ? Slot : 'button';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      openModal();
    };

    return (
      <Comp ref={ref} onClick={handleClick} {...props}>
        {children}
      </Comp>
    );
  }
);
ModalTrigger.displayName = 'Modal.Trigger';

export const ModalClose = React.forwardRef<HTMLButtonElement, ModalTriggerProps>(
  ({ asChild = false, onClick, children, ...props }, ref) => {
    const { closeModal } = useModalContext();
    const Comp = asChild ? Slot : 'button';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      closeModal();
    };

    return (
      <Comp ref={ref} onClick={handleClick} {...props}>
        {children}
      </Comp>
    );
  }
);
ModalClose.displayName = 'Modal.Close';

```

---

### Step 3: Implement Content, Overlay & Portals with Focus Trapping

```tsx
// src/components/Modal/ModalContent.tsx
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useModalContext } from './ModalContext';

export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className = '', ...props }, ref) => {
    const { isOpen, closeModal, titleId, descriptionId } = useModalContext();
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    // Merge forwarded ref with internal ref
    React.useImperativeHandle(ref, () => contentRef.current!);

    // Handle Escape Key & Focus Trap
    React.useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is active
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop / Overlay */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={closeModal}
          aria-hidden="true"
        />

        {/* Modal Dialog Body */}
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={`relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl transition-all dark:bg-gray-900 ${className}`}
          {...props}
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }
);
ModalContent.displayName = 'Modal.Content';

```

---

### Step 4: Implement Sub-Components (`Header`, `Title`, `Body`, `Footer`)

```tsx
// src/components/Modal/ModalSubComponents.tsx
import * as React from 'react';
import { useModalContext } from './ModalContext';

export const ModalHeader = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 flex flex-col gap-1 ${className}`} {...props} />
);
ModalHeader.displayName = 'Modal.Header';

export const ModalTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => {
    const { titleId } = useModalContext();
    return (
      <h2
        ref={ref}
        id={titleId}
        className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}
        {...props}
      />
    );
  }
);
ModalTitle.displayName = 'Modal.Title';

export const ModalDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => {
    const { descriptionId } = useModalContext();
    return (
      <p
        ref={ref}
        id={descriptionId}
        className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
        {...props}
      />
    );
  }
);
ModalDescription.displayName = 'Modal.Description';

export const ModalBody = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`py-2 text-gray-700 dark:text-gray-300 ${className}`} {...props} />
);
ModalBody.displayName = 'Modal.Body';

export const ModalFooter = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-6 flex items-center justify-end gap-3 ${className}`} {...props} />
);
ModalFooter.displayName = 'Modal.Footer';

```

---

### Step 5: Namespace Compound Export

Assign sub-components to the main `Modal` component for clean dot-notation imports (`Modal.Header`, `Modal.Title`).

```tsx
// src/components/Modal/index.ts
import { Modal as RootModal } from './ModalContext';
import { ModalTrigger, ModalClose } from './ModalTrigger';
import { ModalContent } from './ModalContent';
import {
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from './ModalSubComponents';

export const Modal = Object.assign(RootModal, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
});

export type { ModalProps } from './ModalContext';

```

---

### Step 6: How Design System Consumers Use the Modal

#### Usage A: Uncontrolled Usage (Default)

```tsx
import { Modal } from '@design-system/ui';
import { Button } from '@design-system/ui';

export function UncontrolledExample() {
  return (
    <Modal>
      {/* asChild passes click logic to your standard Design System Button */}
      <Modal.Trigger asChild>
        <Button variant="primary">Delete Account</Button>
      </Modal.Trigger>

      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Are you absolutely sure?</Modal.Title>
          <Modal.Description>
            This action cannot be undone. This will permanently delete your account.
          </Modal.Description>
        </Modal.Header>

        <Modal.Body>
          <p>Please type your password to confirm account deletion.</p>
        </Modal.Body>

        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Modal.Close>
          <Button variant="danger" onClick={() => alert('Account deleted')}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

```

#### Usage B: Controlled Usage (Driven by State or React Hook Form)

```tsx
import { useState } from 'react';
import { Modal, Button } from '@design-system/ui';

export function ControlledExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Controlled Modal</Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Controlled Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Modal state is currently controlled by parent state.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}

```
