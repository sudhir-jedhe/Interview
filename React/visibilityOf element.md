In React, showing and hiding elements boils down to controlling what gets rendered or displayed based on state, props, or conditions.

Depending on your requirements (DOM removal vs. CSS hiding, transition animations, or layout constraints), here are the most common scenarios and how to handle them.

---

## 1. Conditional Rendering (DOM Removal)

This is the standard React approach. The element is **completely removed from or inserted into the DOM**. Use this when you want to save memory and avoid rendering unnecessary DOM nodes when hidden.

### Scenario A: Inline Logical AND (`&&`)

Best for simple toggle states where an element should appear only when a condition is `true`.

```tsx
import { useState } from "react";

export function InlineToggle() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible((prev) => !prev)}>
        {isVisible ? "Hide" : "Show"} Details
      </button>

      {/* Renders <p> ONLY if isVisible is true */}
      {isVisible && <p>Here are the extra details!</p>}
    </div>
  );
}
```

### Scenario B: Ternary Operator (`condition ? <A/> : <B/>`)

Best when you need an **If / Else** scenario (show Component A vs. Component B).

```tsx
export function StatusDisplay({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {isLoggedIn ? (
        <button onClick={() => console.log("Logout")}>Log Out</button>
      ) : (
        <button onClick={() => console.log("Login")}>Log In</button>
      )}
    </div>
  );
}
```

### Scenario C: Early Return (`if (!data) return null;`)

Best for whole components that shouldn't render while waiting for data or permissions.

```tsx
export function UserProfile({
  user,
  isLoading,
}: {
  user: any;
  isLoading: boolean;
}) {
  if (isLoading) return <div>Loading profile...</div>;
  if (!user) return null; // Hide entire component if no user data exists

  return <div>Welcome back, {user.name}!</div>;
}
```

---

## 2. CSS-Based Hiding (Keeps Element in the DOM)

Sometimes removing an element from the DOM destroys internal component state (like inputs losing typed text) or breaks CSS layout calculations. CSS hiding preserves the DOM node and its state while making it invisible.

### Scenario A: Display (`display: none`)

Completely hides the element and **removes it from the visual document flow** (doesn't take up layout space).

```tsx
export function DisplayHide({ isVisible }: { isVisible: boolean }) {
  return (
    <div style={{ display: isVisible ? "block" : "none" }}>
      <input type="text" placeholder="Type something..." />
      <p>This retains its input value even when hidden!</p>
    </div>
  );
}
```

### Scenario B: Visibility (`visibility: hidden`)

Hides the element visually, but **keeps its physical space/dimensions in the page layout**.

```tsx
export function VisibilityHide({ isVisible }: { isVisible: boolean }) {
  return (
    <div style={{ visibility: isVisible ? "visible" : "hidden" }}>
      <p>Takes up page space even when hidden.</p>
    </div>
  );
}
```

---

## 3. Smooth Fade / Slide Animations (CSS Transitions)

Conditional rendering (`isVisible && <Child/>`) snaps elements in and out instantly without animation because the node disappears before CSS transitions can run.

To smoothly animate an element in and out, use CSS opacity + transitions:

```tsx
import { useState } from "react";

export function AnimatedToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen((prev) => !prev)}>Toggle Card</button>

      <div
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.3s ease-in-out",
          pointerEvents: isOpen ? "auto" : "none", // Prevents clicks when invisible
        }}
      >
        <div className="card">Smoothly fading in and sliding down!</div>
      </div>
    </div>
  );
}
```

---

## 4. Portals for Overlays (Modals & Tooltips)

For elements that need to appear over the rest of the application (like modals, dropdowns, or tooltips) without being clipped by parent `overflow: hidden` or `z-index` contexts, use `ReactDOM.createPortal`.

```tsx
import { createPortal } from "react-dom";

export function ModalOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-body">
        <h2>Modal Title</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body, // Appends directly to <body>
  );
}
```

---

## Summary Matrix

| Scenario / Method           | Preserves State? | Preserves Layout Space? | Supports CSS Transitions?      | Best For                        |
| --------------------------- | ---------------- | ----------------------- | ------------------------------ | ------------------------------- |
| **`&&` or Ternary**         | ❌ No            | ❌ No                   | ❌ No (requires animation lib) | Default conditional rendering   |
| **`display: none`**         | ✅ Yes           | ❌ No                   | ❌ No                          | Retaining input/component state |
| **`visibility: hidden`**    | ✅ Yes           | ✅ Yes                  | ✅ Yes (opacity)               | Layout preservation             |
| **Opacity & Transform**     | ✅ Yes           | ✅ Yes                  | ✅ Yes                         | Smooth show/hide animations     |
| **`ReactDOM.createPortal`** | Depends          | N/A (Floating)          | ✅ Yes                         | Modals, tooltips, popovers      |

In React, the **`<Activity>` component** (formerly known during experimental phases as `<Offscreen>`) is a built-in feature introduced in **React 19**. It provides a native way to **hide and preserve the state of components in the background** without destroying them.

---

## 1. The Problem `<Activity>` Solves

Historically, developers faced a trade-off when toggling UI elements like tabs, drawers, or step-based forms:

1. **Conditional Rendering (`{isOpen && <Sidebar/>}`):** Completely unmounts the component. When re-opened, all internal React state (scroll positions, form inputs, open sub-menus) is lost.
2. **CSS Hiding (`<div style={{ display: 'none' }}>`):** Keeps state intact, but all internal `useEffect` timers, animations, network subscriptions, and heavy re-renders **continue running in the background**, consuming CPU and memory.

**`<Activity>` offers a middle ground:**

- **State & DOM are preserved:** Form inputs, scroll positions, and React state are remembered.
- **Effects are suspended:** Active `useEffect` cleanup functions run when hidden (pausing subscriptions, timers, or video playback) and re-mount when made visible again.
- **Background rendering is deferred:** Re-renders due to prop changes are processed at a lower priority while hidden.

---

## 2. Basic Syntax & Usage

The `<Activity>` component accepts a `mode` prop: either `'visible'` or `'hidden'`.

```tsx
import { Activity, useState } from "react";

export function TabSystem() {
  const [activeTab, setActiveTab] = useState<"feed" | "profile">("feed");

  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab("feed")}>Feed</button>
        <button onClick={() => setActiveTab("profile")}>Profile</button>
      </nav>

      {/* Feed Tab: State preserved when hidden */}
      <Activity mode={activeTab === "feed" ? "visible" : "hidden"}>
        <NewsFeed />
      </Activity>

      {/* Profile Tab: State preserved when hidden */}
      <Activity mode={activeTab === "profile" ? "visible" : "hidden"}>
        <UserProfile />
      </Activity>
    </div>
  );
}
```

---

## 3. Key Behaviors

| Feature                | Visible (`mode="visible"`) | Hidden (`mode="hidden"`)                                  |
| ---------------------- | -------------------------- | --------------------------------------------------------- |
| **DOM Visibility**     | Normal rendering           | Applied `display: none` automatically                     |
| **React State**        | Active and updated         | Preserved in memory                                       |
| **`useEffect` Hooks**  | Mounted & running          | **Cleaned up / Suspended** (subscriptions & timers pause) |
| **Re-render Priority** | High (Immediate)           | **Low / Background** (Deferred until idle)                |

---

## 4. Common Use Cases

1. **Tabbed Navigation & Sub-views:** Keep non-active tabs mounted in the background so switching between tabs is instantaneous.
2. **Pre-rendering Next Screens:** Wrap routes or pages the user is likely to visit next in `<Activity mode="hidden">` to pre-load and pre-render assets at a low priority.
3. **Modals and Side Drawers:** Hide complex sidebars or modal dialogs without losing unsaved form drafts or filter settings.
4. **Media Players:** Pause video playback or audio stream effects when a player is hidden, but retain the seek position.
