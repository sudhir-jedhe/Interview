**Priority-Based Modals** is a very common **Frontend System Design** question, especially for React Lead/Frontend Architect interviews.

## Problem

Multiple modals can be triggered simultaneously:

```text
1. Session Expired Modal       Priority = 100
2. Security Warning Modal      Priority = 90
3. App Update Modal            Priority = 50
4. Survey Modal                Priority = 20
```

If all arrive together:

```text
✅ Session Expired
✅ Security Warning
✅ App Update
✅ Survey
```

Only the highest-priority modal should be shown first.

---

# High-Level Design

```text
                    Modal Requests
                           |
                           ▼
                ┌─────────────────┐
                │ Modal Manager   │
                └─────────────────┘
                           |
                 Priority Queue
                           |
                           ▼
                  Current Modal
                           |
                           ▼
                     React Portal
```

---

# Modal Configuration

```ts
export interface ModalConfig {
  id: string;
  component: React.ReactNode;
  priority: number;
  dismissible?: boolean;
}
```

Example:

```ts
{
  id: "session-expired",
  priority: 100,
  component: <SessionExpiredModal />
}
```

---

# Modal Manager Context

```tsx
import { createContext, useContext, useState } from "react";

interface ModalConfig {
  id: string;
  component: React.ReactNode;
  priority: number;
}

interface ModalContextType {
  showModal: (modal: ModalConfig) => void;

  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export const useModal = () => useContext(ModalContext);
```

---

# Priority Queue Logic

```tsx
export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<ModalConfig[]>([]);

  const [activeModal, setActiveModal] = useState<ModalConfig | null>(null);

  const showModal = (modal: ModalConfig) => {
    setQueue((prev) => {
      const updated = [...prev, modal];

      updated.sort((a, b) => b.priority - a.priority);

      return updated;
    });
  };

  const closeModal = () => {
    setQueue((prev) => {
      const [current, ...remaining] = prev;

      setActiveModal(remaining[0] || null);

      return remaining;
    });
  };

  return (
    <ModalContext.Provider
      value={{
        showModal,
        closeModal,
      }}
    >
      {children}

      {queue.length > 0 && <div className="modal">{queue[0].component}</div>}
    </ModalContext.Provider>
  );
}
```

---

# Usage

```tsx
const { showModal } = useModal();

showModal({
  id: "survey",
  priority: 10,
  component: <SurveyModal />,
});

showModal({
  id: "security",
  priority: 90,
  component: <SecurityAlertModal />,
});

showModal({
  id: "session",
  priority: 100,
  component: <SessionExpiredModal />,
});
```

Display order:

```text
1. Session Expired
2. Security Alert
3. Survey
```

---

# Better Solution: Binary Heap

Sorting every insertion:

```ts
O(n log n)
```

Use a Max Heap:

```ts
Insert  -> O(log n)
Remove  -> O(log n)
Peek    -> O(1)
```

---

# Priority Queue Class

```ts
class PriorityQueue {
  private heap: ModalConfig[] = [];

  enqueue(item: ModalConfig) {
    this.heap.push(item);

    this.heap.sort((a, b) => b.priority - a.priority);
  }

  dequeue() {
    return this.heap.shift();
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}
```

In production use a proper binary heap implementation.

---

# Prevent Duplicate Modals

```ts
showModal({
  id: "session-expired",
  ...
});
```

Before inserting:

```ts
if (queue.some((m) => m.id === modal.id)) {
  return;
}
```

---

# Modal Preemption

Critical modal arrives while another modal is open:

```text
User sees:

Survey Modal
```

Then:

```text
Session Expired
```

Priority:

```text
Survey = 10
Session Expired = 100
```

Replace immediately.

```ts
if (newModal.priority > currentModal.priority) {
  pushCurrentToQueue();

  showNewModal();
}
```

---

# Modal Categories

```ts
enum ModalType {
  CRITICAL,
  WARNING,
  INFO,
}
```

Priority mapping:

```ts
CRITICAL = 100;
WARNING = 50;
INFO = 10;
```

Usage:

```ts
showModal({
  type: ModalType.CRITICAL,
});
```

---

# React Portal Support

Always render modals through a portal.

```tsx
return createPortal(<Modal />, document.body);
```

Benefits:

- Correct z-index layering
- Escapes parent overflow
- Better accessibility

---

# Accessibility

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
```

Support:

```text
✅ ESC close
✅ Focus trap
✅ Screen readers
✅ Keyboard navigation
```

---

# Production-Level Modal Manager API

```tsx
showModal({
  id: "security-alert",

  priority: 100,

  component: SecurityAlertModal,

  props: {},

  dismissible: false,

  persistent: true,

  onClose() {},
});
```

---

# Interview Discussion Points

### Naive Solution

```text
Array + sort
```

Complexity:

```text
Insert = O(n log n)
```

---

### Optimised Solution

```text
Priority Queue (Max Heap)
```

Complexity:

```text
Insert = O(log n)
Remove = O(log n)
Peek = O(1)
```

---

### Enterprise Considerations

- React Context for global modal state
- Priority Queue / Binary Heap
- Portal rendering
- Focus management
- Duplicate prevention
- Modal preemption
- Modal stacking
- Analytics tracking
- Lazy-loaded modal components

### Architecture

```text
Feature Modules
       │
       ▼
showModal()
       │
       ▼
Priority Modal Manager
       │
       ▼
Max Heap Queue
       │
       ▼
React Portal
       │
       ▼
Visible Modal
```

This is the **Senior Frontend Architect** approach typically expected in React system-design interviews at large-scale companies.

This is an exceptional breakdown of the **Priority-Based Modal System** design! It hits all the core pillars that staff and principal interviewers evaluate: state management, algorithm efficiency, edge cases like preemption, accessibility, and clean DX.

To make this architecture fully production-ready, here are a few critical enhancements and refinements to address subtle bugs in the naive implementation, complete the Binary Heap logic, and improve accessibility.

---

## 1. Bug Fixes & Edge Cases in State Management

### A. Fixing the State Sync Bug in `ModalProvider`

In your initial `ModalProvider` example:

```tsx
const closeModal = () => {
  setQueue((prev) => {
    const [current, ...remaining] = prev;
    setActiveModal(remaining[0] || null); // ❌ BUG: State setter inside queue setter
    return remaining;
  });
};
```

Setting state (`setActiveModal`) inside a functional update of another state variable (`setQueue`) leads to race conditions and unnecessary re-renders.

**Solution:** Use **Derived State**. You don't need a separate `activeModal` state variable at all. The currently visible modal is simply the head of the queue (`queue[0]`).

```tsx
export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<ModalConfig[]>([]);

  // Derived state: Active modal is always the highest priority item in the queue
  const activeModal = queue[0] || null;

  const showModal = useCallback((modal: ModalConfig) => {
    setQueue((prev) => {
      // Duplicate prevention
      if (prev.some((m) => m.id === modal.id)) return prev;

      // Insert and sort
      const updated = [...prev, modal];
      return updated.sort((a, b) => b.priority - a.priority);
    });
  }, []);

  const closeModal = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, closeModal, activeModal }}>
      {children}
      {activeModal &&
        createPortal(
          <ModalWrapper modal={activeModal} onClose={closeModal} />,
          document.body,
        )}
    </ModalContext.Provider>
  );
}
```

---

## 2. Complete Max Heap (Binary Heap) Implementation

Using `Array.prototype.sort()` inside `.enqueue()` still runs in $O(n \log n)$ time. To impress in system design interviews, implement an actual array-backed **Max Binary Heap**:

```ts
export class MaxHeap<T extends { priority: number }> {
  private heap: T[] = [];

  public peek(): T | undefined {
    return this.heap[0];
  }

  public size(): number {
    return this.heap.length;
  }

  public enqueue(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  public dequeue(): T | undefined {
    if (this.size() === 0) return undefined;
    if (this.size() === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.sinkDown(0);
    return root;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].priority <= this.heap[parentIndex].priority) break;

      // Swap
      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];
      index = parentIndex;
    }
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      let largest = index;
      const leftIndex = 2 * index + 1;
      const rightIndex = 2 * index + 2;

      if (
        leftIndex < length &&
        this.heap[leftIndex].priority > this.heap[largest].priority
      ) {
        largest = leftIndex;
      }
      if (
        rightIndex < length &&
        this.heap[rightIndex].priority > this.heap[largest].priority
      ) {
        largest = rightIndex;
      }

      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [
        this.heap[largest],
        this.heap[index],
      ];
      index = largest;
    }
  }
}
```

---

## 3. Handling Modal Preemption & Stacking UX

When a high-priority modal preempts a lower-priority modal (e.g., `Session Expired` interrupts `Survey Modal`), how should the UX react?

1. **Preemption (Replace Mode):** The lower-priority modal remains cached in the queue behind the scene. When the critical modal is closed, the lower-priority modal automatically reappears.
2. **Stacking Mode (Backdrop Overlay):** Sometimes critical alerts must render _on top of_ the existing modal without unmounting it (e.g., a "Unsaved Changes" dialog over a multi-step form modal).

### Stacking Support via Z-Index Layers

To support stacking without destroying lower-priority DOM state:

```tsx
// Render the active modal, but allow visual stacking via z-index
{
  queue.map((modal, index) => {
    // Only render the top-most modal, OR render top N stacked modals
    const isTop = index === 0;
    if (!isTop && !modal.allowStacking) return null;

    return (
      <ModalWrapper
        key={modal.id}
        style={{ zIndex: 1000 + (queue.length - index) }}
        aria-hidden={!isTop}
      >
        {modal.component}
      </ModalWrapper>
    );
  });
}
```

---

## 4. Production-Grade Accessibility (a11y) & Focus Management

An enterprise modal manager **must** satisfy WAI-ARIA standards:

- **Focus Restoration:** When a modal closes, focus must return to the element that triggered it (`document.activeElement`).
- **Focus Trap:** Tabbing inside the modal must loop through focusable elements and not bleed into the background document.
- **Scroll Locking:** Disable `document.body` scrolling when at least one modal is active.

```tsx
function ModalWrapper({
  modal,
  onClose,
}: {
  modal: ModalConfig;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 1. Lock Body Scroll & Store Previous Focus
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      // Restore focus on unmount
      previousFocusRef.current?.focus();
    };
  }, []);

  // 2. Escape Key Listener & Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modal.dismissible !== false) {
        onClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal.dismissible, onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={modal.dismissible !== false ? onClose : undefined}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${modal.id}`}
        className="modal-container"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click
      >
        {modal.component}
      </div>
    </div>
  );
}
```

---

## Summary Matrix for Interview Evaluation

| Feature                | Basic Modal                     | Production-Grade Priority Manager           |
| ---------------------- | ------------------------------- | ------------------------------------------- |
| **Ordering**           | FIFO / DOM Order                | Max Heap Priority Queue ($O(\log n)$)       |
| **Overlap Resolution** | Blurs together / Breaks Z-index | Priority preemption & stacking              |
| **Duplication**        | Multi-render bugs               | Idempotent insertion by `id`                |
| **Focus Handling**     | Wanders back to body            | Focus trapped & restored to trigger element |
| **Mounting**           | Relative DOM node               | React Portal attached to `document.body`    |
