**Render Props** is an advanced React pattern used for sharing code/state between components using a **prop whose value is a function**.

Instead of a component hardcoding its own UI, it accepts a function that returns a React element and calls that function to render its output.

---

## 1. The Core Concept

A component with a render prop takes stateful logic and passes its internal state into a function provided by the parent.

### Simple Syntax

```jsx
// A component that exposes its state via a render prop function
<MouseTracker render={(mouse) => (
  <h1>The mouse position is ({mouse.x}, {mouse.y})</h1>
)} />

```

---

## 2. Practical Example: Mouse Position Tracker

Here is a full working example of encapsulation using the Render Props pattern:

### Step 1: Create the Logic Component

The `MouseTracker` component manages the event listener and mouse coordinates state, but delegates the UI rendering to the `render` prop.

```jsx
import { useState, useEffect } from 'react';

function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Pass internal state into the render prop function
  return render(position);
}

```

### Step 2: Consume the Logic with Different UI Layouts

Different components can now reuse `MouseTracker` without duplicating mouse listener logic.

```jsx
function App() {
  return (
    <div>
      <h2>Render Props Example</h2>

      {/* Render layout 1: Text display */}
      <MouseTracker
        render={({ x, y }) => (
          <p>Mouse Coordinates: <strong>{x}px</strong>, <strong>{y}px</strong></p>
        )}
      />

      {/* Render layout 2: Visual red dot follower */}
      <MouseTracker
        render={({ x, y }) => (
          <div
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 15,
              height: 15,
              borderRadius: '50%',
              backgroundColor: 'red',
              pointerEvents: 'none',
            }}
          />
        )}
      />
    </div>
  );
}

```

---

## 3. Alternative: Using `children` as a Render Prop

You do not have to name the prop `render`. A popular variation is using React's `children` prop as a function:

```jsx
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(!on);

  return children({ on, toggle });
}

// Usage:
function App() {
  return (
    <Toggle>
      {({ on, toggle }) => (
        <button onClick={toggle}>
          {on ? 'Status: ON' : 'Status: OFF'}
        </button>
      )}
    </Toggle>
  );
}

```

---

## 4. Render Props vs. Custom Hooks

In modern React (v16.8+), **Custom Hooks** are generally preferred over Render Props because they avoid nested JSX wrapper trees ("wrapper hell").

### Comparison

| Feature               | Render Props                               | Custom Hooks (`useMouse()`)        |
| --------------------- | ------------------------------------------ | ---------------------------------- |
| **Primary Mechanism** | Component passing state to a function prop | Custom JS function returning state |
| **JSX Tree**          | Adds wrapper components to DOM tree        | Zero extra DOM nodes / wrappers    |
| **Readability**       | Can cause deep nesting ("callback hell")   | Flat, linear code execution        |

### Refactoring Render Props to a Custom Hook

```javascript
// Modern Equivalent Custom Hook
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

// Usage in Component
function App() {
  const { x, y } = useMouse();
  return <p>Coordinates: {x}, {y}</p>;
}

```

---

## When Should You Still Use Render Props Today?

1. **Building Flexible UI Libraries:** Libraries like Formik, Downshift, or TanStack Table use render props so consumers have total control over HTML markup and styling.
2. **Dynamic UI Rendering:** When a component needs to dynamically customize how *individual items* in a list render (e.g., virtualized lists like `react-window`).

Both **Render Props** and **Higher-Order Components (HOCs)** are advanced React design patterns used to **share reusable stateful logic** across components without duplicating code.

With the introduction of React Hooks, both patterns have largely been superseded by **Custom Hooks**, but they remain frequent interview questions and key architecture concepts in major UI libraries.

---

## Key Differences at a Glance

| Feature                    | Higher-Order Component (HOC)                                           | Render Props                                                |
| -------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Definition**             | A **function** that takes a component and returns a *new* component.   | A **component** that accepts a function prop to render UI.  |
| **Syntax**                 | `const EnhancedComp = withLogic(BaseComp)`                             | `<LogicComp render="{(data)"> <UIComp data="{data}"/>} />`  |
| **Composition Time**       | **Static / Compile Time** (outside render method).                     | **Dynamic / Runtime** (inside JSX render tree).             |
| **Prop Naming Collisions** | **High Risk** (HOC props can silently overwrite base component props). | **No Risk** (arguments are explicitly destructured/scoped). |
| **JSX Tree Overhead**      | Creates wrapper components in DevTools ("Wrapper Hell").               | Creates nested JSX callback trees ("Callback Hell").        |
| **Source Transparency**    | **Implicit** (hard to trace where injected props come from).           | **Explicit** (arguments clearly passed to render function). |

---

## 1. Higher-Order Component (HOC)

An HOC is a pure function that wraps a component to inject additional props or behavior.

### Example: Injecting User Auth Data

```jsx
// 1. Define the HOC
function withAuth(WrappedComponent) {
  return function GuardedComponent(props) {
    const user = { name: "Alice", role: "Admin" }; // Shared state/logic
    
    // Injects 'user' prop into WrappedComponent
    return <WrappedComponent user={user} {...props} />;
  };
}

// 2. Base Component
function Dashboard({ user, title }) {
  return <h1>{title} - Welcome, {user.name}</h1>;
}

// 3. Enhance Component
export default withAuth(Dashboard);

```

### Disadvantages of HOCs

1. **Prop Collisions:** If two HOCs (`withAuth` and `withTheme`) inject a prop with the same name (e.g., `data`), one will overwrite the other without warning.
2. **Indirection:** Looking at `<Dashboard title="Home"/>` usage in JSX, it's unclear where the `user` prop comes from.
3. **Ref Forwarding Issues:** Refs are not automatically passed through to the wrapped component unless explicitly forwarded using `React.forwardRef`.

---

## 2. Render Props Pattern

Instead of wrapping a component at export time, a component with a render prop delegates its UI rendering to a callback function provided directly in JSX.

### Example: Injecting User Auth Data

```jsx
// 1. Define Logic Component
function AuthProvider({ render }) {
  const user = { name: "Alice", role: "Admin" }; // Shared state/logic
  
  return render(user);
}

// 2. Consume Logic Dynamically in JSX
function Dashboard({ title }) {
  return (
    <AuthProvider
      render={(user) => (
        <h1>{title} - Welcome, {user.name}</h1>
      )}
    />
  );
}

```

### Advantages of Render Props over HOCs

1. **No Prop Collisions:** Arguments passed to the callback function are locally scoped and explicitly named by the consumer (`user => ...`).
2. **Dynamic Behavior:** Logic can be configured dynamically at runtime using JSX props directly inside the render tree.
3. **Explicit Data Flow:** You can immediately trace where `user` comes from by looking at the parent `<AuthProvider>` tag.

---

## Modern Solution: Custom Hooks (`useAuth`)

In modern React (v16.8+), both patterns are usually replaced by **Custom Hooks**, which offer clean logic reuse without wrapper components or callback nesting.

```jsx
// Custom Hook
function useAuth() {
  const [user] = useState({ name: "Alice", role: "Admin" });
  return user;
}

// Usage in Component
function Dashboard({ title }) {
  const user = useAuth(); // Clean, flat, explicit
  return <h1>{title} - Welcome, {user.name}</h1>;
}

```

---

## Summary Checklist for Interviews

* Use **HOCs** when extending third-party legacy components or applying global cross-cutting concerns (e.g., `connect()` in React Redux v7 or `withRouter()` in legacy React Router).
* Use **Render Props** when building flexible UI components that need to give consumers direct control over rendering internal list items or layout slots (e.g., Formik or TanStack Table).
* Use **Custom Hooks** for virtually all new logic reuse in modern React applications.
