A **"Slot"** in UI frameworks (like Vue, Web Components, or Radix UI) is a pattern that allows a parent component to pass custom UI elements into designated placeholders inside a child component.

In React, slots are typically built using either **named React props (JSX props)** or the **Compound Component pattern (Child Types)**.

Here is how to build a React Slot system from scratch, ranging from simple prop slots to an advanced, flexible Radix-style `Slot` utility.

---

### Method 1: Named Prop Slots (Simple & Standard)

The simplest way to implement slots in React is by defining props that accept `React.ReactNode`.

#### Component: `Card.jsx`

```jsx
import React from 'react';

export function Card({ header, footer, children }) {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white dark:bg-gray-800">
      {/* Header Slot */}
      {header && <div className="border-b pb-2 mb-3">{header}</div>}

      {/* Main Default Slot */}
      <div className="py-2">{children}</div>

      {/* Footer Slot */}
      {footer && <div className="border-t pt-2 mt-3">{footer}</div>}
    </div>
  );
}

```

#### Usage

```jsx
<Card
  header={<h2 className="text-xl font-bold">Card Title</h2>}
  footer={
    <div className="flex justify-end gap-2">
      <button className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
      <button className="px-3 py-1 bg-blue-600 text-white rounded">Submit</button>
    </div>
  }
>
  <p>This is the main body content passed via the default children slot.</p>
</Card>

```

---

### Method 2: Compound Component Slots (Vue-style JSX syntax)

If you want a syntax that feels closer to Vue's `<template #slotName>`, you can create sub-components and filter `children` by their component type.

#### Component: `CardSlots.jsx`

```jsx
import React from 'react';

// 1. Define Slot sub-components
export function CardHeader({ children }) {
  return <>{children}</>;
}

export function CardBody({ children }) {
  return <>{children}</>;
}

export function CardFooter({ children }) {
  return <>{children}</>;
}

// 2. Main Parent Component that sorts children into slots
export function CardCompound({ children }) {
  const childrenArray = React.Children.toArray(children);

  // Find specific slot components by type
  const header = childrenArray.find((child) => child.type === CardHeader);
  const footer = childrenArray.find((child) => child.type === CardFooter);
  
  // Anything not in Header or Footer goes into the body slot
  const body = childrenArray.filter(
    (child) => child.type !== CardHeader && child.type !== CardFooter
  );

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white dark:bg-gray-800">
      {header && <div className="border-b pb-2 mb-3">{header}</div>}
      <div className="py-2">{body}</div>
      {footer && <div className="border-t pt-2 mt-3">{footer}</div>}
    </div>
  );
}

// Attach slots to main component
CardCompound.Header = CardHeader;
CardCompound.Body = CardBody;
CardCompound.Footer = CardFooter;

```

#### Usage

```jsx
<CardCompound>
  <CardCompound.Header>
    <h2 className="text-xl font-bold">Compound Slot Title</h2>
  </CardCompound.Header>

  <p>Main content inside the body slot.</p>

  <CardCompound.Footer>
    <button className="px-3 py-1 bg-blue-600 text-white rounded">Action</button>
  </CardCompound.Footer>
</CardCompound>

```

---

### Method 3: Advanced Radix-style `Slot` Component (`asChild` pattern)

Libraries like **Radix UI** use a `<Slot>` component that merges its props (and ref) directly onto its immediate child element. This allows a component like `<Button asChild>` to render a link (`<a>`), route link (`<Link>`), or native `<button>` while retaining button styling.

Here is how to build Radix's `Slot` utility from scratch using `React.cloneElement` and prop merging.

#### 1. The `Slot` Engine (`Slot.jsx`)

```jsx
import React from 'react';

// Helper to merge classNames, event handlers, and styles
function mergeProps(parentProps, childProps) {
  const overrideProps = { ...childProps };

  for (const propName in parentProps) {
    const parentProp = parentProps[propName];
    const childProp = childProps[propName];

    // 1. Merge Event Handlers (e.g. onClick)
    if (/^on[A-Z]/.test(propName)) {
      if (parentProp && childProp) {
        overrideProps[propName] = (...args) => {
          childProp(...args);
          parentProp(...args);
        };
      } else if (parentProp) {
        overrideProps[propName] = parentProp;
      }
    }
    // 2. Merge Class Names
    else if (propName === 'className') {
      overrideProps[propName] = [parentProp, childProp].filter(Boolean).join(' ');
    }
    // 3. Merge Styles
    else if (propName === 'style') {
      overrideProps[propName] = { ...parentProp, ...childProp };
    }
    // 4. Default to parent props if child didn't specify
    else if (parentProp !== undefined && childProp === undefined) {
      overrideProps[propName] = parentProp;
    }
  }

  return overrideProps;
}

export const Slot = React.forwardRef(({ children, ...slotProps }, ref) => {
  // Ensure child is a valid single React element
  if (!React.isValidElement(children)) {
    return null;
  }

  const childProps = children.props;

  // Merge slot props with child element props
  const mergedProps = mergeProps(slotProps, childProps);

  // If a ref was passed to Slot, handle ref merging
  if (ref) {
    const existingRef = children.ref;
    mergedProps.ref = (node) => {
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;

      if (typeof existingRef === 'function') existingRef(node);
      else if (existingRef) existingRef.current = node;
    };
  }

  return React.cloneElement(children, mergedProps);
});

Slot.displayName = 'Slot';

```

#### 2. Building a Component with `asChild` Support (`Button.jsx`)

```jsx
import React from 'react';
import { Slot } from './Slot';

export const Button = React.forwardRef(({ asChild, className = '', ...props }, ref) => {
  // If asChild is true, render the Slot component instead of a native <button>
  const Component = asChild ? Slot : 'button';

  const defaultClasses = "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-block text-center";

  return (
    <Component
      ref={ref}
      className={`${defaultClasses} ${className}`}
      {...props}
    />
  );
});

Button.displayName = 'Button';

```

#### 3. Usage Examples

##### Default Usage (Renders `<button>`)

```jsx
<Button onClick={() => alert('Clicked!')}>
  Standard Button
</Button>

```

##### `asChild` Usage (Renders an `<a>` link with Button Styles)

```jsx
<Button asChild>
  <a href="https://example.com" target="_blank" rel="noreferrer">
    Link Styled as Button
  </a>
</Button>

```

##### `asChild` with React Router / Next.js Link

```jsx
import { Link } from 'react-router-dom';

<Button asChild className="shadow-lg">
  <Link to="/docs">
    Navigate to Docs
  </Link>
</Button>

```

---

### Which Method Should You Use?

| Approach                                | Best Used For                                                  | Pros                                                                                      | Cons                                                    |
| --------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Named Props** (`header={...}`)        | Simple cards, modals, headers.                                 | Zero overhead, native React pattern.                                                      | Verbose when passing complex multi-line JSX tree props. |
| **Compound Components** (`Card.Header`) | Layout wrappers, tab groups, accordions.                       | Clean HTML-like JSX hierarchy.                                                            | Requires filtering `children` array.                    |
| **Radix-style `Slot**` (`asChild`)      | Reusable Design System components (`Button`, `Badge`, `Card`). | Allows polymorphic rendering (`<button>`, `<a>`, `<Link>`) without DOM wrapper pollution. | Slightly more complex internal setup.                   |
