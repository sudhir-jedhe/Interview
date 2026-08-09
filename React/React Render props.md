**Render Props** is a React design pattern where a component receives a function as a prop—usually named `render` or passed as `children`—and calls that function to decide what to render.

This pattern allows you to share stateful behavior or logic between components while giving the caller full control over the rendered output.

---

## 1. Syntax & Core Concept

Instead of hardcoding what a component renders, the component exposes its internal state by calling a render prop function:

```tsx
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  // Render prop function that receives internal state and returns JSX
  render: (position: MousePosition) => React.ReactNode;
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = React.useState<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div style={{ height: '200px', border: '1px solid #ccc' }} onMouseMove={handleMouseMove}>
      {/* Call the render function, passing state to it */}
      {render(position)}
    </div>
  );
}

```

### Usage

The consuming component decides *how* to render that position data:

```tsx
export function App() {
  return (
    <div>
      <h3>Mouse Tracker</h3>
      {/* Pass a function that uses the x, y coordinates */}
      <MouseTracker
        render={({ x, y }) => (
          <p>
            The mouse position is <strong>({x}, {y})</strong>
          </p>
        )}
      />
    </div>
  );
}

```

---

## 2. Using `children` as a Render Prop

It is common practice to pass the render function as the `children` prop instead of a named `render` prop. This leads to cleaner JSX syntax:

```tsx
interface ToggleProps {
  children: (data: { on: boolean; toggle: () => void }) => React.ReactNode;
}

function Toggle({ children }: ToggleProps) {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn((prev) => !prev);

  // Invoke children as a function
  return <>{children({ on, toggle })}</>;
}

// Usage
export function ToggleExample() {
  return (
    <Toggle>
      {({ on, toggle }) => (
        <div>
          <button onClick={toggle}>{on ? 'Turn Off' : 'Turn On'}</button>
          {on && <p>The secret content is revealed!</p>}
        </div>
      )}
    </Toggle>
  );
}

```

---

## 3. Render Props vs. Custom Hooks vs. HOCs

Render Props was popular before React Hooks (16.8) as a cleaner alternative to Higher-Order Components (HOCs).

| Feature                      | Render Props                              | Custom Hooks                          | Higher-Order Components (HOC)           |
| ---------------------------- | ----------------------------------------- | ------------------------------------- | --------------------------------------- |
| **Syntax**                   | Callback function in JSX tree             | Function call inside component body   | Component wrapper function              |
| **DOM Tree Impact**          | Adds wrapper components to React DevTools | Adds **zero** extra components        | Adds extra wrapper component nodes      |
| **Name Collisions**          | None (arguments are scoped locally)       | None (variables destructured locally) | High (HOC can overwrite existing props) |
| **Modern Preferred Choice?** | Legacy / Libraries with JSX slots         | **Primary Standard**                  | Legacy                                  |

---

## 4. When Should You Still Use Render Props Today?

While Custom Hooks have largely replaced Render Props for pure stateful logic, Render Props remain useful in specific UI composition scenarios:

1. **Virtualization & Heavy List Libraries:** Libraries like `react-window` or `tanstack-virtual` use render props so you can specify exact custom row templates (`itemRenderer={({ index, style }) => <Row/>}`).
2. **Flexible Container Components:** Design system containers (like a tooltips, popovers, or drag-and-drop providers) where the container controls geometry/positioning while you control the inner markup.

Here is a side-by-side comparison of sharing logic (a window resize listener tracking screen dimensions) using a **Render Prop** component versus a **Custom React Hook**.

---

## 1. Implementation

### Approach A: Render Prop (`WindowSize`)

The component holds state and side effects, then calls a `children` or `render` function to expose the data to the JSX tree:

```tsx
// WindowSize.tsx (Render Prop)
import React, { useState, useEffect } from 'react';

interface WindowSizeData {
  width: number;
  height: number;
}

interface WindowSizeProps {
  children: (size: WindowSizeData) => React.ReactNode;
}

export function WindowSize({ children }: WindowSizeProps) {
  const [size, setSize] = useState<WindowSizeData>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Executes the function passed as children
  return <>{children(size)}</>;
}

```

### Approach B: Custom React Hook (`useWindowSize`)

The custom hook encapsulates the same state and side effect, returning the data directly to local variables:

```typescript
// useWindowSize.ts (Custom Hook)
import { useState, useEffect } from 'react';

interface WindowSizeData {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSizeData {
  const [size, setSize] = useState<WindowSizeData>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

```

---

## 2. Consuming in a Component

### Consuming the Render Prop Component

The UI component wraps its JSX in the Render Prop component and receives coordinates via a function parameter:

```tsx
// Header.tsx (Render Prop Usage)
import React from 'react';
import { WindowSize } from './WindowSize';

export function Header() {
  return (
    <header style={{ padding: '16px', background: '#f8fafc' }}>
      <h1>Site Header</h1>
      
      {/* JSX callback nesting required */}
      <WindowSize>
        {({ width }) => (
          <p>
            Current Layout Mode:{' '}
            <strong>{width < 768 ? 'Mobile Drawer' : 'Desktop Navbar'}</strong>
          </p>
        )}
      </WindowSize>
    </header>
  );
}

```

### Consuming the Custom Hook

The UI component invokes the hook at the top level and uses the variables directly anywhere in its body:

```tsx
// Header.tsx (Custom Hook Usage)
import React from 'react';
import { useWindowSize } from './useWindowSize';

export function Header() {
  // Direct variable assignment at the top of the component
  const { width } = useWindowSize();

  return (
    <header style={{ padding: '16px', background: '#f8fafc' }}>
      <h1>Site Header</h1>
      <p>
        Current Layout Mode:{' '}
        <strong>{width < 768 ? 'Mobile Drawer' : 'Desktop Navbar'}</strong>
      </p>
    </header>
  );
}

```

---

## 3. Side-by-Side Architectural Comparison

| Feature                     | Render Props                                                                         | Custom React Hook                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **Component Hierarchy**     | Introduces wrapper components in the React DevTools tree.                            | Adds **zero extra nodes** to the virtual DOM tree.                                              |
| **Nesting & Readable Code** | Combining 3+ logic providers leads to **"callback hell"** inside JSX.                | Multiple hooks run flat sequentially inside the function body.                                  |
| **Scope Availability**      | Exposed state is only accessible *inside* the render callback function.              | Exposed state is accessible anywhere in the component (handlers, effects, conditional renders). |
| **TypeScript Support**      | Requires typing function props and children generics.                                | Inferred or standard function return typing.                                                    |
| **Performance Overhead**    | Inline JSX functions inside render props are re-instantiated on every parent render. | Stable variable references across renders.                                                      |

---

## 4. Multiple Logic Providers Comparison

Notice how nesting multiple logic features (e.g., screen size + user auth + scroll position) highlights the readability gap:

### Render Props (Nested "Pyramid of Doom")

```tsx
<WindowSize>
  {({ width }) => (
    <UserSession>
      {({ user }) => (
        <ScrollPosition>
          {({ scrollY }) => (
            <div>
              <p>User: {user.name}</p>
              <p>Width: {width}</p>
              <p>Scroll: {scrollY}</p>
            </div>
          )}
        </ScrollPosition>
      )}
    </UserSession>
  )}
</WindowSize>

```

### Custom Hooks (Flat & Clean)

```tsx
const { width } = useWindowSize();
const { user } = useUserSession();
const { scrollY } = useScrollPosition();

return (
  <div>
    <p>User: {user.name}</p>
    <p>Width: {width}</p>
    <p>Scroll: {scrollY}</p>
  </div>
);

```

---

## Verdict

* **Custom Hooks** are the universal standard for sharing stateful/effectful logic in modern React. They keep JSX flat and expose data directly to your component scope.
* **Render Props** are reserved primarily for component frameworks or virtualization libraries (e.g., TanStack Virtual, React Window) where a parent component controls layout or rendering slots and needs you to supply custom item templates.
