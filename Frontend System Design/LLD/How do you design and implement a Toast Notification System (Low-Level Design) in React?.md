Designing a **Toast Notification System** requires building a global, non-blocking alert queue that can trigger floating messages from anywhere in the application—including outside React components (e.g., inside API interceptors or async utility functions).

---

## 1. Requirements & System Overview

### Functional Requirements

1. **Trigger from Anywhere:** Call `toast.success()`, `toast.error()`, or `toast.info()` from React components, Redux/Zustand stores, or standalone API utilities (like Axios interceptors).
2. **Auto-Dismissal & Pause on Hover:** Notifications automatically auto-dismiss after a configurable duration (e.g., 4000ms), but timers pause when the user hovers over a toast.
3. **Queue Limit & Positioning:** Limit maximum visible toasts (e.g., max 5) and support multiple positions (`top-right`, `bottom-left`, etc.).
4. **Manual Dismissal:** Users can manually close notifications using an explicit action or dismiss button.

### WAI-ARIA Accessibility Requirements

* **`role="status"`** or **`role="alert"`**: Informs screen readers of dynamic updates.
* Use `role="status"` (`aria-live="polite"`) for general info/success messages.
* Use `role="alert"` (`aria-live="assertive"`) for urgent errors.

* **`aria-atomic="true"`**: Ensures screen readers announce the entire toast message content rather than partial updates.

---

## 2. Low-Level API & Data Interface

```typescript
// toast.types.ts
import { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: ReactNode;
  duration?: number; // Duration in ms (default: 4000)
}

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

```

---

## 3. Global Observer / Event-Emitter Store

To allow triggering toasts from non-React JavaScript code (e.g., API clients), we use the **Observer (Pub/Sub) Pattern** to maintain state outside the React render tree.

```typescript
// toastStore.ts
import { ToastItem, ToastOptions } from './toast.types';

type Listener = (toasts: ToastItem[]) => void;

class ToastStore {
  private toasts: ToastItem[] = [];
  private listeners: Set<Listener> = new Set();
  private maxToasts = 5;

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.toasts);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  public addToast(message: string, options: ToastOptions = {}) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration ?? 4000,
    };

    // Prepend new toast and enforce maximum stack limit
    this.toasts = [newToast, ...this.toasts].slice(0, this.maxToasts);
    this.notify();
  }

  public removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  // Convenience helper methods
  public success(message: string, duration?: number) {
    this.addToast(message, { type: 'success', duration });
  }

  public error(message: string, duration?: number) {
    this.addToast(message, { type: 'error', duration });
  }

  public info(message: string, duration?: number) {
    this.addToast(message, { type: 'info', duration });
  }

  public warning(message: string, duration?: number) {
    this.addToast(message, { type: 'warning', duration });
  }
}

export const toast = new ToastStore();

```

---

## 4. Single Toast Item Component with Timer Management

Handles individual timer logic, hover pause state, and cleanup.

```tsx
// ToastElement.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ToastItem } from './toast.types';
import { toast } from './toastStore';

interface ToastElementProps {
  item: ToastItem;
}

const TYPE_STYLES = {
  success: { background: '#10B981', color: '#fff' },
  error: { background: '#EF4444', color: '#fff' },
  info: { background: '#3B82F6', color: '#fff' },
  warning: { background: '#F59E0B', color: '#fff' },
};

export const ToastElement: React.FC<ToastElementProps> = ({ item }) => {
  const [isPaused, setIsPaused] = useState(false);
  const remainingTimeRef = useRef(item.duration ?? 4000);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (remainingTimeRef.current <= 0) return;

    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerIdRef.current = setTimeout(() => {
        toast.removeToast(item.id);
      }, remainingTimeRef.current);
    } else if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      // Deduct elapsed time from remaining duration
      remainingTimeRef.current -= Date.now() - startTimeRef.current;
    }

    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
    };
  }, [isPaused, item.id]);

  const isAlert = item.type === 'error';

  return (
    <div
      role={isAlert ? 'alert' : 'status'}
      aria-live={isAlert ? 'assertive' : 'polite'}
      aria-atomic="true"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        minWidth: '280px',
        maxWidth: '420px',
        transition: 'all 0.2s ease-in-out',
        ...TYPE_STYLES[item.type],
      }}
    >
      <span>{item.message}</span>
      <button
        onClick={() => toast.removeToast(item.id)}
        aria-label="Close notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'currentColor',
          cursor: 'pointer',
          fontSize: '1.1rem',
          padding: '0 4px',
        }}
      >
        &times;
      </button>
    </div>
  );
};

```

---

## 5. Toast Container with React Portal

Renders active toasts dynamically into `document.body` via a Portal.

```tsx
// ToastContainer.tsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ToastItem, ToastPosition } from './toast.types';
import { toast } from './toastStore';
import { ToastElement } from './ToastElement';

interface ToastContainerProps {
  position?: ToastPosition;
}

const POSITION_STYLES: Record<ToastPosition, React.CSSProperties> = {
  'top-right': { top: '20px', right: '20px' },
  'top-left': { top: '20px', left: '20px' },
  'bottom-right': { bottom: '20px', right: '20px' },
  'bottom-left': { bottom: '20px', left: '20px' },
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    // Subscribe component state to the global ToastStore
    const unsubscribe = toast.subscribe((updatedToasts) => {
      setToasts(updatedToasts);
    });
    return () => unsubscribe();
  }, []);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      aria-label="Notifications"
      style={{
        position: 'fixed',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none', // Allows clicking elements underneath container boundaries
        ...POSITION_STYLES[position],
      }}
    >
      {toasts.map((item) => (
        <div key={item.id} style={{ pointerEvents: 'auto' }}>
          <ToastElement item={item} />
        </div>
      ))}
    </div>,
    document.body
  );
};

```

---

## 6. Real-World Usage Example

### Step A: Mount Container at App Root

```tsx
// App.tsx
import React from 'react';
import { ToastContainer } from './ToastContainer';

export default function App() {
  return (
    <div>
      <h1>My Application</h1>
      {/* Mount Portal Container Once */}
      <ToastContainer position="top-right" />
    </div>
  );
}

```

### Step B: Trigger Toasts from Components or Axios Interceptors

```typescript
// api/client.ts (Non-React File)
import { toast } from './toastStore';

export async function fetchUserData() {
  try {
    const res = await fetch('/api/user');
    if (!res.ok) throw new Error('Failed to load profile');
    return await res.json();
  } catch (err: any) {
    // Trigger toast outside of React components
    toast.error(err.message || 'Network error occurred');
  }
}

```

```tsx
// UserProfile.tsx (React Component)
import React from 'react';
import { toast } from './toastStore';

export function UserProfile() {
  const handleSave = () => {
    // Save logic...
    toast.success('Profile settings updated successfully!');
  };

  return <button onClick={handleSave}>Save Profile</button>;
}

```

---

## Technical Summary Matrix

| Problem                       | Root Cause                                                                | Low-Level Solution                                                                            |
| ----------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Triggering outside React**  | Context API requires React tree placement.                                | Use the **Pub/Sub (Observer) Pattern** in a standalone JavaScript store (`toastStore.ts`).    |
| **Hover behavior bugs**       | Simple `setTimeout` continues counting during hover.                      | Track remaining time using `Date.now()` delta calculations inside `useRef`.                   |
| **CSS Stacking Context Clip** | Modals or parent containers with `overflow: hidden` clip floating toasts. | Render container at `document.body` root using **`createPortal`**.                            |
| **Screen Reader Flashes**     | Missing ARIA live properties.                                             | Use `role="status"` (`polite`) for standard info and `role="alert"` (`assertive`) for errors. |

How do you implement smooth entering and exiting CSS animations for a custom React Toast system?

Implementing smooth enter and exit CSS animations in React requires solving a core lifecycle problem: **React immediately removes components from the DOM when state updates**, which abruptly cuts off any exit transitions unless the unmount is explicitly deferred until the animation finishes.

There are two primary ways to solve this in Low-Level Design (LLD):

1. **Unmounted-State Deferral Pattern** (Pure React/CSS — zero external dependencies).
2. **Web Animations API (WAAPI)** (Imperative JS-driven animations with full lifecycle control).

Below is the production-ready implementation of the **Unmounted-State Deferral Pattern**.

---

## 1. High-Level Lifecycle Flow

```
[Trigger Dismiss] ──> Set internal state `isExiting = true` 
                             │
                             ▼
                    Apply `.toast-exit` CSS class
                             │
                             ▼
                   Wait for transition duration (e.g., 300ms)
                             │
                             ▼
                    Call `toast.removeToast(id)` to purge from DOM

```

---

## 2. CSS Animation Classes (`toast.css`)

Define CSS transitions using standard hardware-accelerated properties (`transform` and `opacity`) to ensure 60fps rendering without layout thrashing.

```css
/* toast.css */

/* Base Toast Style */
.toast-item {
  transform: translate3d(0, 0, 0);
  opacity: 1;
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 300ms cubic-bezier(0.16, 1, 0.3, 1),
              max-height 300ms ease-in-out,
              margin 300ms ease-in-out;
  max-height: 100px; /* Upper bound for collapsing space smoothly */
  will-change: transform, opacity, max-height;
}

/* Enter Animation (Slide in from top/right) */
.toast-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.toast-enter-active {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* Exit Animation (Fade out + slide right + collapse height) */
.toast-exit {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
  max-height: 0;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  overflow: hidden;
}

```

---

## 3. Deferred Unmounting Custom Hook (`useToastAnimation`)

This hook tracks two internal states: **entering** (for the initial trigger) and **exiting** (to delay parent state updates until the exit transition ends).

```typescript
// useToastAnimation.ts
import { useState, useEffect, useCallback, useRef } from 'react';

export function useToastAnimation(
  onAnimationEnd: () => void,
  animationDuration = 300
) {
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Initial Enter Animation Frame
  useEffect(() => {
    // Force a paint frame before removing enter class
    const frameId = requestAnimationFrame(() => {
      setIsEntering(false);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Trigger Exit Animation Sequence
  const triggerExit = useCallback(() => {
    if (isExiting) return; // Prevent duplicate triggers
    setIsExiting(true);

    // Wait for CSS transition to finish before triggering parent state cleanup
    exitTimerRef.current = setTimeout(() => {
      onAnimationEnd();
    }, animationDuration);
  }, [isExiting, onAnimationEnd, animationDuration]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  return {
    isEntering,
    isExiting,
    triggerExit,
  };
}

```

---

## 4. Animated Toast Element Component

Integrate `useToastAnimation` with the hover-pause and auto-dismiss logic.

```tsx
// ToastElement.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ToastItem } from './toast.types';
import { toast } from './toastStore';
import { useToastAnimation } from './useToastAnimation';
import './toast.css';

interface ToastElementProps {
  item: ToastItem;
}

export const ToastElement: React.FC<ToastElementProps> = ({ item }) => {
  const [isPaused, setIsPaused] = useState(false);
  const remainingTimeRef = useRef(item.duration ?? 4000);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // 1. Hook into custom animation lifecycle
  const { isEntering, isExiting, triggerExit } = useToastAnimation(
    () => toast.removeToast(item.id), // Called after 300ms CSS transition completes
    300
  );

  // 2. Timer Management with Auto-Dismiss triggering transition
  useEffect(() => {
    if (remainingTimeRef.current <= 0 || isExiting) return;

    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerIdRef.current = setTimeout(() => {
        triggerExit(); // Trigger exit transition instead of instant removal
      }, remainingTimeRef.current);
    } else if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      remainingTimeRef.current -= Date.now() - startTimeRef.current;
    }

    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
    };
  }, [isPaused, isExiting, triggerExit]);

  // Determine CSS classes dynamically
  let animationClass = '';
  if (isEntering) {
    animationClass = 'toast-enter';
  } else if (isExiting) {
    animationClass = 'toast-exit';
  } else {
    animationClass = 'toast-enter-active';
  }

  return (
    <div
      className={`toast-item ${animationClass}`}
      role={item.type === 'error' ? 'alert' : 'status'}
      aria-live={item.type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        background: item.type === 'error' ? '#EF4444' : '#10B981',
        color: '#ffffff',
      }}
    >
      <span>{item.message}</span>
      <button
        onClick={triggerExit} // Manual close triggers graceful exit
        aria-label="Close notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'currentColor',
          cursor: 'pointer',
          fontSize: '1.2rem',
          marginLeft: '12px',
        }}
      >
        &times;
      </button>
    </div>
  );
};

```

---

## 5. Alternative Approach: Web Animations API (WAAPI)

If you prefer pure JavaScript without maintaining class lists or external CSS files, use the native **Web Animations API** inside a `useRef` hook:

```tsx
// WAAPI implementation variant inside ToastElement
const toastRef = useRef<HTMLDivElement>(null);

const triggerNativeExit = () => {
  const element = toastRef.current;
  if (!element) return;

  // Keyframe animation executed directly by browser compositor thread
  const animation = element.animate(
    [
      { opacity: 1, transform: 'translate3d(0, 0, 0)', maxHeight: '100px' },
      { opacity: 0, transform: 'translate3d(100%, 0, 0)', maxHeight: '0px' },
    ],
    {
      duration: 300,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards',
    }
  );

  // Listen for native animation completion event
  animation.onfinish = () => {
    toast.removeToast(item.id);
  };
};

```

---

## Technical Edge Cases Handled

| Edge Case                 | Problem                                                                        | Solution                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Instant Unmounting**    | Removing state from array abruptly clips animations.                           | Delay `removeToast(id)` invocation until CSS `transitionend` or `setTimeout` duration finishes.   |
| **Layout Shift (Jank)**   | Removing a toast causes lower toasts to snap upward instantly.                 | Animate `max-height`, `margin`, and `padding` to `0` simultaneously with `opacity` during exit.   |
| **Frame Skipping**        | Initial `toast-enter` styles applied simultaneously with `toast-enter-active`. | Wrap transition trigger inside `requestAnimationFrame` to guarantee initial paint cycle executes. |
| **Hardware Acceleration** | Animating `top`/`right` causes browser layout recalculations (Reflow).         | Restrict transforms exclusively to `translate3d(x, y, z)` to run calculations on the GPU layer.   |
