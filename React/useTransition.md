`useTransition` is a React Hook introduced in **React 18** that allows you to update state without blocking the UI. It marks specific state updates as **non-urgent transitions**, enabling React to interrupt or defer them if the user performs a high-priority action (like typing into an input field or clicking a button).

---

## Syntax & Return Values

```tsx
const [isPending, startTransition] = useTransition();
```

- **`isPending`** _(boolean)_: Indicates whether a transition is currently being processed in the background. Useful for showing loading spinners or visual feedback.
- **`startTransition(callback)`** _(function)_: A wrapper function. Any state update placed inside `callback` is treated as low priority.

---

## Why Use `useTransition`? (The Problem It Solves)

In standard React, all state updates are urgent. If a state update triggers a heavy re-render (like filtering 10,000 items in a list), the browser main thread freezes until that re-render completes, causing input lag.

`useTransition` splits state updates into two tiers:

1. **Urgent Updates:** Immediate UI feedback (e.g., updating an input box as the user types).
2. **Transition Updates:** Non-urgent background work (e.g., re-rendering search results).

---

## Code Example: Non-Blocking Tab / List Switcher

In this example, clicking a tab updates the active tab immediately, while rendering the heavy tab content happens in the background.

```tsx
import { useState, useTransition } from "react";
import HeavyTabContent from "./HeavyTabContent";

export function TabContainer() {
  const [tab, setTab] = useState("about");

  // 1. Initialize hook
  const [isPending, startTransition] = useTransition();

  const selectTab = (nextTab: string) => {
    // 2. Wrap non-urgent state update inside startTransition
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <div>
      <div className="tab-buttons">
        <button onClick={() => selectTab("about")}>About</button>
        <button onClick={() => selectTab("posts")}>
          Posts {isPending && "(Loading...)"}
        </button>
        <button onClick={() => selectTab("contact")}>Contact</button>
      </div>

      <hr />

      {/* 3. Give visual indicator while transition is rendering */}
      <div style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s" }}>
        {tab === "about" && <AboutTab />}
        {tab === "posts" && <HeavyTabContent />}
        {tab === "contact" && <ContactTab />}
      </div>
    </div>
  );
}
```

---

## Key Rules & Considerations

1. **Synchronous Callbacks Only:** The function passed to `startTransition` must be strictly synchronous. You cannot put `setTimeout` or `await` inside `startTransition`.

```tsx
// ❌ WRONG
startTransition(async () => {
  await fetchData();
  setTab("posts");
});

// ✅ CORRECT (Call startTransition inside the resolved promise)
await fetchData();
startTransition(() => {
  setTab("posts");
});
```

2. **Must Be Tied to State:** `startTransition` only works when wrapped around state-setting functions (`setState` or `dispatch`).
3. **Interruption Handling:** If the user clicks a different tab while a transition is rendering, React cancels the previous transition render mid-way and starts rendering the new one.

---

## `useTransition` vs `useDeferredValue`

| Feature               | `useTransition`                                    | `useDeferredValue`                                           |
| --------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| **Primary Input**     | Wraps the **state update function** (`setState`).  | Wraps a **value/prop** directly.                             |
| **Control**           | Used when you own and control the `setState` call. | Used when receiving props or values from a parent component. |
| **Pending Indicator** | Provides `isPending` boolean flag automatically.   | Requires manual comparison (`value !== deferredValue`).      |
