The core concept is **Concurrent React** (specifically powered by **Concurrent Rendering** and **Time Slicing**).

---

## How It Works

Before React 18, rendering was **synchronous and un-interruptible**. If React started rendering a component tree, it had to finish processing the entire tree before giving control back to the browser. If rendering a complex component took 100ms, the main thread froze, resulting in dropped frames and input lag.

In Concurrent React, React splits large rendering tasks into smaller chunks of work using **Time Slicing**:

1. **Work In Chunks:** React works on a chunk of the component tree for a few milliseconds ($\sim 5\text{ms}$).
2. **Yield Control:** React pauses rendering and checks if the browser has higher-priority tasks queued (like a mouse click, keypress, or animation frame).
3. **Handle Interruptions:**

- If an urgent user interaction occurred, React yields control to let the browser paint the update immediately.
- Once the user input is handled, React resumes, restarts, or discards the in-progress background render.

---

## Core Features Powered by Concurrent Rendering

This pause-and-yield capability enables several built-in React features:

- **`useTransition`:** Marks state updates as non-urgent background transitions so heavy renders don't freeze input fields.
- **`useDeferredValue`:** Defers updating heavy subtrees until higher-priority renders complete.
- **`<Suspense>`:** Allows React to pause rendering a component branch while waiting for code or data to load asynchronously, without blocking the rest of the application.
