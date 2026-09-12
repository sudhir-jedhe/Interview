There are two fundamental approaches to hiding elements in React: **removing them completely from the DOM** (unmounting/conditional rendering) and **keeping them in the DOM while concealing them visually** (CSS-based approaches).

| Method                          | Remains in DOM? | Resets State/Lifecycle? | Layout Impact            |
| ------------------------------- | --------------- | ----------------------- | ------------------------ |
| **Short-Circuit (`&&`)**        | No              | Yes (unmounts)          | Collapses completely     |
| **Ternary Operator**            | No              | Yes (unmounts)          | Collapses completely     |
| **Inline `display: none**`      | Yes             | No (retains state)      | Collapses space          |
| **Inline `visibility: hidden**` | Yes             | No (retains state)      | Preserves occupied space |
| **Tailwind / CSS Classes**      | Yes             | No (retains state)      | Depends on class used    |
| **HTML `hidden` Attribute**     | Yes             | No (retains state)      | Collapses space          |

---

### 1. Completely Removing from the DOM (Conditional Rendering)

These unmount the component when hidden. Any child state, internal timer, or DOM focus is destroyed.

* **Short-Circuit Logical AND (`&&`):**

```jsx
{isVisible && <UserCard />}

```

> **Watch out:** Avoid numbers in the condition like `count && <UserCard/>` where `count = 0`, as React renders the number `0` to the screen. Use boolean casts: `Boolean(count)` or `count > 0`.

* **Ternary Operator:**

```jsx
{isVisible ? <UserCard /> : null}

```

* **Early Return in Component:**

```jsx
function UserCard({ isVisible }) {
  if (!isVisible) return null;
  return <div>User Details</div>;
}

```

---

### 2. Retaining in the DOM (CSS Hiding)

These keep the element and its children mounted, preserving input state, scroll position, audio/video playback, and DOM focus.

* **`display: none` (Removes from layout flow):**
Hides the element and collapses the space it occupies.

```jsx
<div style={{ display: isVisible ? 'block' : 'none' }}>
  <VideoPlayer />
</div>

```

* **`visibility: hidden` (Preserves layout space):**
Hides the element visually and from screen readers, but leaves an invisible blank gap preserving the element's width and height.

```jsx
<div style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
  Invisible element preserving layout
</div>

```

* **Tailwind CSS Utility Classes:**

```jsx
{/* display: none */}
<div className={isVisible ? 'block' : 'hidden'}>Content</div>

{/* visibility: hidden */}
<div className={isVisible ? 'visible' : 'invisible'}>Content</div>

```

* **Native HTML `hidden` attribute:**
Standard browser attribute equivalent to user-agent `display: none`.

```jsx
<div hidden={!isVisible}>Content</div>

```

* **Accessible Screen-Reader Only Hiding (Visually Hidden):**
Hides the element visually from the screen while keeping it readable by screen readers for accessibility (a11y).

```jsx
{/* Tailwind sr-only */}
<span className="sr-only">Only screen readers read this</span>

```

---

### When to Use Which?

* **Use Conditional Rendering (`&&` / `null`)** for heavy components, modaled forms, tabs, or items containing network fetchers to save memory and avoid rendering unnecessary DOM nodes.
* **Use CSS (`display: none` / classes)** when you must preserve user input (e.g., active form data in an inactive tab), avoid refetching API data, or run entry/exit CSS transitions and animations.

In React 19 / modern React, **`<Activity>`** is the official built-in component used for **Offscreen pre-rendering** and **preserving DOM state without destroying component instances**.

It acts as an evolution of the internal `<Offscreen>` API, allowing you to hide and restore UI subtrees without losing their internal state, scroll position, or DOM nodes.

---

### What Problem Does `<Activity>` Solve?

In standard React, hiding an element conditionally removes it from the tree:

```jsx
// Destroys state, resets scroll, unmounts effects
{isActive ? <HeavyChart /> : null}

```

If you hide it via CSS (`display: none`), the component stays mounted, but React still re-renders it whenever parent state updates:

```jsx
// Still incurs render and reconciliation cost even though invisible
<div style={{ display: isActive ? 'block' : 'none' }}>
  <HeavyChart />
</div>

```

**`<Activity>` gives you the best of both worlds:**

1. **Preserves State & DOM:** When hidden, the component's state, DOM nodes, input values, and scroll position are kept in memory.
2. **Suspends Work / Defers Priority:** React stops background re-renders, pauses layout effects, and deprioritizes work on the hidden tree while inactive.
3. **Instant Restore:** When switching back to active, the UI appears immediately without mounting costs or blank flashes.

---

### Basic Syntax & Usage

`<Activity>` accepts a `mode` prop with two values: `'visible'` or `'hidden'`.

```jsx
import { Activity, useState } from 'react';

export default function TabContainer() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <nav className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('overview')}>Overview</button>
        <button onClick={() => setActiveTab('telemetry')}>Telemetry</button>
        <button onClick={() => setActiveTab('reports')}>Reports</button>
      </nav>

      {/* Tab 1: Kept alive and preserved in background */}
      <Activity mode={activeTab === 'overview' ? 'visible' : 'hidden'}>
        <OverviewDashboard />
      </Activity>

      {/* Tab 2: Inputs, map positions, or live feeds do not reset */}
      <Activity mode={activeTab === 'telemetry' ? 'visible' : 'hidden'}>
        <LiveTelemetryFeed />
      </Activity>

      {/* Tab 3 */}
      <Activity mode={activeTab === 'reports' ? 'visible' : 'hidden'}>
        <ReportGenerator />
      </Activity>
    </div>
  );
}

```

---

### Lifecycle Behavior in `<Activity>`

When `mode="hidden"`:

* **Passive Effects (`useEffect`):** Cleanup functions run when hidden, and setup effects re-run when switched back to `'visible'`. This allows background timers, subscriptions, or WebSocket listeners to pause automatically.
* **Layout Effects (`useLayoutEffect`):** Fired when switching between modes.
* **State Retention:** All `useState`, `useReducer`, and `useRef` values are retained untouched.
* **DOM Presence:** The HTML elements remain in the DOM tree, hidden with CSS user-agent rules (`display: none !important;`).

---

### Comparison: `<Activity>` vs. Conditional Rendering vs. CSS `hidden`

| Behavior                | Conditional Rendering (`{show && <Comp/>}`) | CSS Hiding (`className="hidden"`)   | `<Activity mode="{...}"/>`              |
| ----------------------- | ------------------------------------------- | ----------------------------------- | --------------------------------------- |
| **DOM Nodes**           | Removed                                     | Kept                                | Kept                                    |
| **Component State**     | Destroyed on hide                           | Preserved                           | Preserved                               |
| **Re-render Cost**      | Zero (unmounted)                            | Full render overhead                | Paused / Deprioritized                  |
| **`useEffect` Cleanup** | Runs on unmount                             | Never runs                          | Runs on hide, resumes on show           |
| **Best For**            | Modal teardown, disposable routes           | Simple CSS toggles, fast animations | Heavy tabs, multi-step forms, map views |
