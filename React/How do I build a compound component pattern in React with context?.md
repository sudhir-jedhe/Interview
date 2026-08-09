  The **Compound Component Pattern** allows you to create a set of related components that work together to share implicit state while giving the consumer total flexibility over the DOM structure and layout.

Classic examples include `<select>` and `<option>` in HTML, or `<Accordion>`, `<Tabs>`, and `<Select>` in modern UI libraries like Radix UI or Chakra UI.

---

## The 4-Step Blueprint

To build compound components in React, follow these four steps:

1. **Create a React Context** to hold the shared state and handlers.
2. **Build the Parent Component** that holds state and wraps children in the Context Provider.
3. **Build Sub-components** that consume the Context to read state or trigger actions.
4. **Attach Sub-components to the Parent** as static properties for clean, dot-notation exports (`Accordion.Item`, `Accordion.Trigger`, etc.).

---

## Complete Example: Building an Accordion

Here is how to build an `<Accordion>` component from scratch.

### Step 1 & 2: Context and Parent Component

```jsx
// Accordion.jsx
import { createContext, useContext, useState } from 'react';

// 1. Create Context
const AccordionContext = createContext(null);

// Custom hook to safely consume context
function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion sub-components must be wrapped within <Accordion>');
  }
  return context;
}

// 2. Parent Component
export function Accordion({ children, defaultOpenId = null }) {
  const [openId, setOpenId] = useState(defaultOpenId);

  const toggle = (id) => {
    setOpenId((currentId) => (currentId === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className="accordion-root">{children}</div>
    </AccordionContext.Provider>
  );
}

```

---

### Step 3: Sub-components

Create individual child components that access the shared state via `useAccordionContext()`.

```jsx
// Context for individual item IDs
const AccordionItemContext = createContext(null);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem sub-components must be wrapped in <Accordion.Item>');
  }
  return context;
}

// Item Wrapper
function AccordionItem({ id, children }) {
  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div className="accordion-item" style={{ borderBottom: '1px solid #ccc' }}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

// Trigger / Header Button
function AccordionTrigger({ children }) {
  const { openId, toggle } = useAccordionContext();
  const { id } = useAccordionItemContext();
  const isOpen = openId === id;

  return (
    <button
      onClick={() => toggle(id)}
      style={{
        width: '100%',
        padding: '1rem',
        display: 'flex',
        justify: 'space-between',
        cursor: 'pointer',
      }}
    >
      {children}
      <span>{isOpen ? '▲' : '▼'}</span>
    </button>
  );
}

// Collapsible Content
function AccordionContent({ children }) {
  const { openId } = useAccordionContext();
  const { id } = useAccordionItemContext();
  const isOpen = openId === id;

  if (!isOpen) return null;

  return <div style={{ padding: '1rem', background: '#f9f9f9' }}>{children}</div>;
}

```

---

### Step 4: Attach Sub-components to Parent

Attach sub-components directly to the main `Accordion` export. This enables dot-notation usage (`Accordion.Item`) and improves developer discoverability via auto-complete.

```jsx
// Assign sub-components to parent object
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

```

---

## Step 5: How Consumers Use It

The consumer gets complete freedom over markup, styling, and structural layout (e.g., adding extra `div` wrappers or icons) without breaking the internal state management:

```jsx
// App.jsx
import { Accordion } from './Accordion';

export default function App() {
  return (
    <Accordion defaultOpenId="faq-1">
      <Accordion.Item id="faq-1">
        <Accordion.Trigger>What is React Context?</Accordion.Trigger>
        <Accordion.Content>
          React Context provides a way to pass data through the component tree without
          having to pass props down manually at every level.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item id="faq-2">
        <Accordion.Trigger>Why use Compound Components?</Accordion.Trigger>
        <Accordion.Content>
          They provide flexible UI composition, implicit state sharing, and clean JSX semantics.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

```

---

## Why Use This Pattern?

* **Implicit State Sharing:** Consumers don't need to manually pass `isOpen` or `onToggle` props to every single item or button.
* **Flexible Layout:** The consumer controls the exact DOM structure. They can put extra `<div>` elements, badges, or custom icons anywhere inside `<Accordion.Item>` without breaking the component.
* **Clean API:** Importing a single `Accordion` object and using `<Accordion.Item>` makes component relationships instantly clear.
