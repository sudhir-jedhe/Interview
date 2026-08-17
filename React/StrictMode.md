**`<StrictMode>`** is a development-only tool designed to help you catch subtle bugs, impure functions, and deprecated APIs in your component tree before they make it to production.

It does **not** render any visible UI of its own, and it has **zero impact on production builds**—all checks and double-invocations are automatically stripped out when you build your app for production.

---

## 1. Reference

### `<StrictMode>...</StrictMode>`

* **`children`**: The component tree (either your entire app or a specific sub-tree) that you want to audit for common React bugs.

---

## 2. Usage Scenarios & What It Catches

### Enabling Strict Mode for the entire app

Most modern React applications wrap the root render call in `<StrictMode>` to audit the entire component tree from day one.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

```

### Enabling Strict Mode for a part of the app

If you are migrating a large legacy codebase, you can enable Strict Mode selectively around individual components or sections to clean up warnings incrementally without breaking the rest of the app.

```jsx
import { StrictMode } from 'react';

function Dashboard() {
  return (
    <div>
      <LegacySidebar /> {/* Strict Mode is off here */}
      <StrictMode>
        <NewAnalyticsWidget /> {/* Strict Mode audits this subtree */}
      </StrictMode>
    </div>
  );
}

```

---

## 3. How Strict Mode Finds Bugs (Development-Only Behaviors)

To ensure your code follows React's strict design principles (like component purity and proper cleanup), Strict Mode intentionally double-runs certain functions in development.

### 1. Fixing bugs found by double rendering

* **What it does:** Strict Mode renders every component **twice** on initial mount.
* **Why:** React assumes that component render functions are **pure** (they only calculate JSX based on props/state and never mutate external variables or DOM elements directly during render). If your render function has side effects (like modifying a global array or mutating variables), double-rendering exposes it immediately.

### 2. Fixing bugs found by re-running Effects

* **What it does:** For components with Effects (`useEffect`), Strict Mode runs a simulated mount-unmount-mount cycle in development (**Setup → Cleanup → Setup**).
* **Why:** This tests whether your `useEffect` has a proper cleanup function. If you forgot to return a cleanup function (e.g., leaving a global event listener or interval running), Strict Mode makes the bug obvious by leaving duplicate listeners active.

### 3. Fixing bugs found by re-running ref callbacks

* **What it does:** When you use callback refs (functions passed to the `ref` attribute), Strict Mode calls the ref callback with the DOM node, immediately calls it with `null` (simulating an unmount), and then calls it with the node again (**Node → `null` → Node**).
* **Why:** This forces you to handle the cleanup pass inside your ref callback (such as removing event listeners when the node becomes `null`).

### 4. Catching deprecated APIs

* **What it does:** Scans your component tree for older, unsafe APIs that are slated for removal in future React versions.
* **Common warnings include:**
* Legacy string refs (`ref="myInput"`).
* Unsafe lifecycle methods (`UNSAFE_componentWillMount`).
* `findDOMNode` usage.
