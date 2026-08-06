Building a production-ready Toast Notification System is a classic React Low-Level Design (LLD) interview question. It tests your ability to handle **global state management, cleanup/memory leak prevention, event-driven architecture, and UI queueing**.

𝗛𝗼𝘄 𝘄𝗼𝘂𝗹𝗱 𝘆𝗼𝘂 𝗶𝗺𝗽𝗹𝗲𝗺𝗲𝗻𝘁 𝗮 𝘁𝗼𝗮𝘀𝘁 𝗻𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝘀𝘆𝘀𝘁𝗲𝗺 𝗶𝗻 𝗥𝗲𝗮𝗰𝘁?

- Describe how to handle global notification state and display logic.
- How would you queue multiple notifications, set timeouts, and avoid overlapping?
- Would you use Context, Redux, or a custom event system?
Below is a complete, step-by-step design breakdown, architectural comparison, and production code implementation using TypeScript.

---

## 1. State & Event Architecture Options

When designing a toast library (like `react-hot-toast` or `react-toastify`), you have three primary state choices:

```text
┌─────────────────────────────────────────────────────────┐
│                     Design Options                      │
├───────────────────┬───────────────────┬─────────────────┤
│    1. Context     │     2. Redux      │ 3. Observer /   │
│       API         │     / Zustand     │ Custom Event    │
└───────────────────┴───────────────────┴─────────────────┘

```

| Strategy                                  | Pros                                                                                                                                 | Cons                                                                                                                                   | Verdict                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **1. React Context API**                  | Built into React, simple, no third-party dependencies.                                                                               | Calling `toast()` from **outside** React components (e.g., inside Axios interceptors or utility functions) is difficult or impossible. | Great for purely UI-driven apps.       |
| **2. Redux / Zustand**                    | Global access, supports middleware.                                                                                                  | Boilerplate heavy; ties your toast system directly to a specific state management library.                                             | Overkill for a reusable library.       |
| **3. Observer / Event Bus (Recommended)** | **Framework-agnostic trigger.** Can call `toast.success()` anywhere—inside React components, API interceptors, or pure JS utilities. | Requires manual subscription/listener cleanup.                                                                                         | **Best Practice / Industry Standard**. |

---

## 2. Low-Level System Design Mechanics

To make the toast system robust, the design must handle three core requirements:

```text
  toast.show("Saved!") ──► [ Event Bus ]
                               │
                               ▼
                   [ Toast Container State ]
                   ┌───────────────────────┐
                   │ Queue: [T1, T2, T3]   │
                   └───────────┬───────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
[ Auto-Dismiss Timers ]                 [ Max Limit & Stacking ]
- Each Toast has a `setTimeout`.        - If Toast Count > Max (e.g., 5),
- Pause timer on `onMouseEnter`.        - Enqueue or drop oldest (FIFO).
- Resume timer on `onMouseLeave`.

```

1. **Queueing & Stacking:** Store toasts in an array (`toasts: Toast[]`). New toasts append to the list. If a `maxCount` limit is reached, dismiss the oldest toast (FIFO).
2. **Auto-Dismissal & Timer Management:** Each toast schedules its own `setTimeout`.
3. **Hover-to-Pause Execution:** Mouse hover pauses active timers so users can read or click actionable toasts.
4. **React Portals:** Render toasts at the root DOM level (`document.body`) using `createPortal` so CSS properties on parent containers (`overflow: hidden`, `z-index`, `transform`) don't clip the toasts.

---

## 3. Complete Production Implementation (TypeScript)

### Step 1: Types & Toast Store Observer (`toastStore.ts`)

This Singleton Event Bus allows triggering toasts from anywhere in your application.

```typescript
// toastStore.ts
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastOptions {
  id?: string;
  message: string;
  type?: ToastType;
  duration?: number; // In milliseconds (default 4000)
  position?: ToastPosition;
}

export interface ToastItem extends Required<ToastOptions> {
  createdAt: number;
}

type Listener = (toasts: ToastItem[]) => void;

class ToastStore {
  private toasts: ToastItem[] = [];
  private listeners: Set<Listener> = new Set();
  private maxToasts = 5;

  // Subscribe React component to store updates
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  addToast(options: ToastOptions): string {
    const id = options.id || Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration ?? 4000,
      position: options.position || 'top-right',
      createdAt: Date.now(),
    };

    // Queue limit management (FIFO: remove oldest if exceeding limit)
    if (this.toasts.length >= this.maxToasts) {
      this.toasts.shift();
    }

    this.toasts.push(newToast);
    this.notify();
    return id;
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clearAll() {
    this.toasts = [];
    this.notify();
  }
}

export const toastStore = new ToastStore();

// Imperative Helper Methods (Usable ANYWHERE in code)
export const toast = {
  success: (message: string, options?: Partial<ToastOptions>) =>
    toastStore.addToast({ ...options, message, type: 'success' }),
  error: (message: string, options?: Partial<ToastOptions>) =>
    toastStore.addToast({ ...options, message, type: 'error' }),
  info: (message: string, options?: Partial<ToastOptions>) =>
    toastStore.addToast({ ...options, message, type: 'info' }),
  warning: (message: string, options?: Partial<ToastOptions>) =>
    toastStore.addToast({ ...options, message, type: 'warning' }),
  dismiss: (id: string) => toastStore.removeToast(id),
};

```

---

### Step 2: Individual Toast Item with Hover-Pause (`ToastItem.tsx`)

Manages the auto-dismiss timer and hover-pause behavior.

```tsx
// ToastItem.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ToastItem as ToastItemType, toastStore } from './toastStore';

interface ToastItemProps {
  toast: ToastItemType;
}

export const ToastItemComponent: React.FC<ToastItemProps> = ({ toast }) => {
  const [remainingTime, setRemainingTime] = useState(toast.duration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const startTimer = () => {
    if (toast.duration === 0) return; // Infinite duration

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      toastStore.removeToast(toast.id);
    }, remainingTime);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      // Calculate remaining duration for smooth resume
      const elapsed = Date.now() - startTimeRef.current;
      setRemainingTime((prev) => Math.max(0, prev - elapsed));
    }
  };

  useEffect(() => {
    startTimer();
    // Cleanup timer on unmount to prevent memory leaks!
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={`toast-card toast-${toast.type}`}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      role="alert"
    >
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close-btn"
        onClick={() => toastStore.removeToast(toast.id)}
        aria-label="Close Toast"
      >
        ×
      </button>
    </div>
  );
};

```

---

### Step 3: Toast Container with Portals & Positions (`ToastContainer.tsx`)

Subscribes to the `toastStore`, groups toasts by position (`top-right`, `bottom-left`), and renders them via React Portal.

```tsx
// ToastContainer.tsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ToastItem, ToastPosition, toastStore } from './toastStore';
import { ToastItemComponent } from './ToastItem';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = toastStore.subscribe((updatedToasts) => {
      setToasts(updatedToasts);
    });
    return () => unsubscribe();
  }, []);

  // Group toasts by position
  const positions: ToastPosition[] = [
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
  ];

  const renderPositionGroup = (pos: ToastPosition) => {
    const group = toasts.filter((t) => t.position === pos);
    if (group.length === 0) return null;

    return (
      <div key={pos} className={`toast-container toast-position-${pos}`}>
        {group.map((t) => (
          <ToastItemComponent key={t.id} toast={t} />
        ))}
      </div>
    );
  };

  // Render outside component hierarchy via Portal
  return createPortal(
    <div className="toast-portal-root">
      {positions.map((pos) => renderPositionGroup(pos))}
    </div>,
    document.body
  );
};

```

---

### Step 4: Styling & Animation (`toast.css`)

```css
.toast-portal-root {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}

.toast-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  pointer-events: auto;
}

.toast-position-top-right { top: 0; right: 0; }
.toast-position-top-left { top: 0; left: 0; }
.toast-position-bottom-right { bottom: 0; right: 0; }
.toast-position-bottom-left { bottom: 0; left: 0; }

.toast-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 280px;
  padding: 12px 16px;
  border-radius: 6px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-in-out;
}

.toast-success { background-color: #10b981; }
.toast-error   { background-color: #ef4444; }
.toast-info    { background-color: #3b82f6; }
.toast-warning { background-color: #f59e0b; }

.toast-close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  margin-left: 12px;
}

@keyframes slideIn {
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

```

---

## 4. Usage in Real Applications

### A. Inside React Components

```tsx
import React from 'react';
import { toast, ToastContainer } from './toast';

export const App = () => {
  return (
    <div>
      <ToastContainer />
      <button onClick={() => toast.success('Profile updated!')}>
        Update Profile
      </button>
      <button onClick={() => toast.error('Payment failed', { position: 'bottom-right' })}>
        Trigger Error
      </button>
    </div>
  );
};

```

### B. Outside React (e.g., Axios Interceptor)

```typescript
// api/client.ts
import axios from 'axios';
import { toast } from './toast';

export const apiClient = axios.create({ baseURL: 'https://api.example.com' });

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Triggers UI toast seamlessly from pure JavaScript!
    toast.error(error.response?.data?.message || 'Network error occurred');
    return Promise.reject(error);
  }
);

```

---

## Key Interview Talking Points

1. **Accessibility (a11y):** Use `role="alert"` or `aria-live="polite"` so screen readers announce incoming notifications.
2. **Memory Leak Prevention:** Always clean up `setTimeout` timers on unmount using `useEffect` return functions.
3. **Decoupled Architecture:** Using an Observer pattern decouples the notification trigger from the React render tree, enabling calls from API interceptors or WebSocket event listeners.
