In React, **`children`** is a special prop automatically passed to every component. It contains whatever content (text, HTML elements, or other React components) is placed **between a component's opening and closing tags**.

The `children` prop is the foundation of **component composition** in React, allowing you to build flexible wrapper components like layouts, cards, modals, and accordions.

---

## 1. Basic Usage

Instead of passing content through standard props like `title="Hello"`, you nest elements inside the component.

### Example: A Reusable Card Component

```tsx
import React from 'react';

// Define props with React.ReactNode for TypeScript
interface CardProps {
  children: React.ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Renders whatever is placed inside <Card>...</Card> */}
      {children}
    </div>
  );
}

```

### How to Consume It

```tsx
export function App() {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {/* Card 1: Text and Button */}
      <Card>
        <h2>User Profile</h2>
        <p>Name: Sudhir Jedhe</p>
        <button>Edit Profile</button>
      </Card>

      {/* Card 2: Image and Description */}
      <Card>
        <img src="/avatar.png" alt="Avatar" width={50} />
        <p>Status: Active</p>
      </Card>
    </div>
  );
}

```

---

## 2. Advanced Pattern: Render Props / Function as Children

`children` doesn't have to be JSX elements—it can also be a **function**. This is known as the **Render Prop pattern**, where the parent component passes data back to the child function.

### Example: Toggle Component

```tsx
import React, { useState } from 'react';

interface ToggleProps {
  // children is a function that receives internal state
  children: (on: boolean, toggle: () => void) => React.ReactNode;
}

export function Toggle({ children }: ToggleProps) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn((prev) => !prev);

  // Call children as a function and pass state
  return <>{children(on, toggle)}</>;
}

```

### Usage

```tsx
export function App() {
  return (
    <Toggle>
      {(on, toggle) => (
        <div>
          <button onClick={toggle}>{on ? 'Disable' : 'Enable'}</button>
          <p>The switch is currently {on ? 'ON' : 'OFF'}.</p>
        </div>
      )}
    </Toggle>
  );
}

```

---

## 3. Manipulating Children with `React.Children` API

If a component needs to iterate over, count, or modify its children, React provides the **`React.Children`** helper utilities:

* **`React.Children.map(children, fn)`:** Safely maps over `children` even if it's a single element or `null`.
* **`React.Children.count(children)`:** Returns the total number of child nodes.
* **`React.Children.toArray(children)`:** Converts `children` into a standard flat JavaScript array with assigned keys.

```tsx
import React from 'react';

export function ListWithSeparators({ children }: { children: React.ReactNode }) {
  const childrenArray = React.Children.toArray(children);

  return (
    <ul>
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          <li>{child}</li>
          {/* Add a separator between items */}
          {index < childrenArray.length - 1 && <hr />}
        </React.Fragment>
      ))}
    </ul>
  );
}

```

---

## Key Benefits of Using `children`

1. **Performance (Prevents Re-renders):** When heavy components are passed via `children`, state changes inside the wrapper component **do not cause the `children` subtree to re-render**.
2. **Flexible Composition:** decouples layout logic from business content.
3. **Reduces Prop Drilling:** Allows deeply nested components to be passed directly from top-level parents.

Show me how to use named component slots in React with TypeScript for complex layouts.

The **Named Component Slots pattern** is an extension of the `children` prop. Instead of passing a single block of JSX inside `children`, you pass multiple named JSX elements as explicit props (e.g., `headerSlot`, `sidebarSlot`, `contentSlot`).

This pattern is widely used in complex layouts (dashboards, admin panels, modal dialogs, resizable split views) because it separates structural layout logic from feature content without hardcoding child components or creating prop-drilling bottlenecks.

---

## 1. Defining Named Component Slots (`DashboardLayout.tsx`)

In TypeScript, define slot props using **`React.ReactNode`**. You can mark slots as optional (`?`) if certain areas like sidebars or footers are conditional.

```tsx
import React, { useState } from 'react';

// 1. Define Slot Props Interface
interface DashboardLayoutProps {
  headerSlot: React.ReactNode;
  sidebarSlot?: React.ReactNode;
  mainSlot: React.ReactNode;
  footerSlot?: React.ReactNode;
}

export function DashboardLayout({
  headerSlot,
  sidebarSlot,
  mainSlot,
  footerSlot,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Slot */}
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '12px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {sidebarSlot && (
            <button onClick={() => setIsSidebarOpen((prev) => !prev)}>
              {isSidebarOpen ? '◄ Collapse' : '► Expand'}
            </button>
          )}
          <div style={{ flex: 1 }}>{headerSlot}</div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div style={{ display: 'flex', flex: 1 }}>
        {sidebarSlot && isSidebarOpen && (
          <aside
            style={{
              width: '260px',
              borderRight: '1px solid #e2e8f0',
              padding: '16px',
              backgroundColor: '#f8fafc',
            }}
          >
            {sidebarSlot}
          </aside>
        )}

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '24px', backgroundColor: '#ffffff' }}>
          {mainSlot}
        </main>
      </div>

      {/* Footer Slot */}
      {footerSlot && (
        <footer
          style={{
            borderTop: '1px solid #e2e8f0',
            padding: '12px 24px',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          {footerSlot}
        </footer>
      )}
    </div>
  );
}

```

---

## 2. Consuming Named Slots (`AdminPage.tsx`)

When consuming the component, instantiate each panel directly in the parent scope and pass it to its designated slot.

```tsx
import React from 'react';
import { DashboardLayout } from './DashboardLayout';

export function AdminPage() {
  return (
    <DashboardLayout
      headerSlot={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Admin Portal</h2>
          <span>Welcome, Sudhir</span>
        </div>
      }
      sidebarSlot={
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="#analytics">Analytics</a></li>
            <li><a href="#users">User Management</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </nav>
      }
      mainSlot={
        <div>
          <h3>System Metrics</h3>
          <p>This area renders the primary dashboard widgets and charts.</p>
        </div>
      }
      footerSlot={<p>© 2026 Admin Portal Inc. All rights reserved.</p>}
    />
  );
}

```

---

## 3. Alternative Compound Component Slot Pattern

For components like Modals, Cards, or Accordions where standard JSX nesting feels cleaner than prop attributes, you can use **Compound Components** as named sub-slots.

```tsx
import React from 'react';

// Sub-components used as named markers
const ModalHeader = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ModalBody = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const ModalFooter = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  // Extract slots dynamically from children array
  const childrenArray = React.Children.toArray(children);
  const header = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === ModalHeader
  );
  const body = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === ModalBody
  );
  const footer = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === ModalFooter
  );

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '8px', width: '400px', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #ddd' }}>{header}</div>
        <div style={{ padding: '16px' }}>{body}</div>
        <div style={{ padding: '16px', borderTop: '1px solid #ddd', textAlign: 'right' }}>{footer}</div>
      </div>
    </div>
  );
}

// Attach slots to main component
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

```

### Consuming Compound Slot Component

```tsx
export function ModalExample() {
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <Modal.Header>
        <h3>Delete Account</h3>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to proceed? This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <button style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>
          Confirm Delete
        </button>
      </Modal.Footer>
    </Modal>
  );
}

```

---

## Why Use Named Slots?

1. **Performance (Zero Re-renders of Inner Trees):** Toggling layout state (like opening/closing a sidebar or resizing split panels) only re-renders the layout shell. The JSX elements passed into slots maintain stable references and skip re-renders.
2. **Type Safety:** TypeScript forces consumers to supply required layout areas while preventing invalid layout configurations.
3. **Clean Decoupling:** Layout components handle CSS grid/flexbox positioning and responsive behavior, while feature components focus strictly on business logic and data fetching.
