The **Compound Components pattern** allows you to build a family of components that work together to share implicit state behind the scenes. Think of native HTML elements like `<select>` and `<option>`: `<select>` manages the selected state while `<option>` elements register themselves without explicit prop-drilling.

In React, we implement this pattern by combining **React Context API** with **TypeScript** to create flexible, highly customizable UI controls (such as Accordions, Tabs, Dropdowns, and Modals).

---

## Complete Example: Building an Accordion Compound Component

Below is a production-grade, accessible Accordion component that supports both **single-expand** and **multi-expand** modes.

### Step 1: Define Context & Types (`AccordionContext.tsx`)

```tsx
import React, { createContext, useContext } from 'react';

// 1. Context State Interface
interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
}

// 2. Create Context with null default
const AccordionContext = createContext<AccordionContextType | null>(null);

// 3. Custom Hook for consuming context with strict validation
export function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      'Accordion sub-components (Accordion.Item, Accordion.Header, Accordion.Content) must be rendered inside <Accordion>'
    );
  }
  return context;
}

export { AccordionContext };

```

---

### Step 2: Implement Main Parent Component (`Accordion.tsx`)

The parent component holds the state (which item IDs are currently open) and exposes the `AccordionContext.Provider`.

```tsx
import React, { useState, useCallback } from 'react';
import { AccordionContext } from './AccordionContext';

interface AccordionProps {
  children: React.ReactNode;
  /** Allow multiple items to be expanded simultaneously */
  allowMultiple?: boolean;
  /** Default expanded item value(s) */
  defaultValue?: string | string[];
}

export function Accordion({
  children,
  allowMultiple = false,
  defaultValue = [],
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (Array.isArray(defaultValue)) return defaultValue;
    return defaultValue ? [defaultValue] : [];
  });

  const toggleItem = useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const isOpen = prev.includes(value);

        if (allowMultiple) {
          return isOpen ? prev.filter((id) => id !== value) : [...prev, value];
        }

        return isOpen ? [] : [value];
      });
    },
    [allowMultiple]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

```

---

### Step 3: Implement Sub-Components (`AccordionItem.tsx`, `AccordionHeader.tsx`, `AccordionContent.tsx`)

Each sub-component consumes shared context via `useAccordionContext()`.

```tsx
import React, { createContext, useContext } from 'react';
import { useAccordionContext } from './AccordionContext';

// -------------------------------------------------------------
// Sub-component 1: Accordion.Item
// -------------------------------------------------------------
interface ItemContextType {
  value: string;
}

const ItemContext = createContext<ItemContextType | null>(null);

function useItemContext() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('Accordion.Header and Accordion.Content must be used within <Accordion.Item>');
  }
  return context;
}

interface AccordionItemProps {
  value: string; // Unique identifier for the item
  children: React.ReactNode;
}

export function AccordionItem({ value, children }: AccordionItemProps) {
  return (
    <ItemContext.Provider value={{ value }}>
      <div style={{ borderBottom: '1px solid #e2e8f0' }}>{children}</div>
    </ItemContext.Provider>
  );
}

// -------------------------------------------------------------
// Sub-component 2: Accordion.Header (Trigger)
// -------------------------------------------------------------
interface AccordionHeaderProps {
  children: React.ReactNode;
}

export function AccordionHeader({ children }: AccordionHeaderProps) {
  const { openItems, toggleItem } = useAccordionContext();
  const { value } = useItemContext();

  const isOpen = openItems.includes(value);

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      aria-expanded={isOpen}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
        border: 'none',
        fontSize: '16px',
        fontWeight: 600,
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <span>{children}</span>
      <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
        ▼
      </span>
    </button>
  );
}

// -------------------------------------------------------------
// Sub-component 3: Accordion.Content (Collapsible Panel)
// -------------------------------------------------------------
interface AccordionContentProps {
  children: React.ReactNode;
}

export function AccordionContent({ children }: AccordionContentProps) {
  const { openItems } = useAccordionContext();
  const { value } = useItemContext();

  const isOpen = openItems.includes(value);

  if (!isOpen) return null;

  return (
    <div style={{ padding: '16px', backgroundColor: '#ffffff', color: '#475569' }}>
      {children}
    </div>
  );
}

```

---

### Step 4: Attach Sub-Components to Main Component

Assign the sub-components static properties on `Accordion` for clean, dot-notation imports.

```tsx
// Attach sub-components
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;

```

---

## Consuming the Compound Component

Consumers can arrange and style the accordion sub-components without worrying about wiring state or event handlers.

```tsx
import React from 'react';
import { Accordion } from './Accordion';

export function FAQSection() {
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>Frequently Asked Questions</h2>

      <Accordion defaultValue="item-1">
        <Accordion.Item value="item-1">
          <Accordion.Header>What is React Context API?</Accordion.Header>
          <Accordion.Content>
            React Context API allows you to share state globally or across a component tree
            without passing props manually down every level.
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <Accordion.Header>Why use Compound Components?</Accordion.Header>
          <Accordion.Content>
            Compound Components give component consumers complete control over UI layout and structure
            while delegating state management internally.
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="item-3">
          <Accordion.Header>Is TypeScript required?</Accordion.Header>
          <Accordion.Content>
            TypeScript provides strict compile-time checks for context providers and sub-component prop structures,
            preventing runtime errors.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

```

---

## Key Benefits of Compound Components

| Advantage                     | Why It Matters                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Implicit State Management** | No need to pass `isOpen` or `onToggle` props to every individual panel.                                            |
| **Flexible Layouts**          | Consumers can insert custom wrappers or styling between `Accordion.Item` elements.                                 |
| **Type Safety**               | Custom hook (`useAccordionContext`) throws clear error messages if a sub-component is rendered outside the parent. |
| **Clean API**                 | Dot notation (`Accordion.Header`, `Accordion.Content`) clearly signals relationships between components.           |
