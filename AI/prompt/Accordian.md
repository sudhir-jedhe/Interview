Here is a prompt you can copy and use to generate a production-ready accordion component:

---

> **Role & Goal:**
> Act as a senior frontend engineer and accessibility specialist. Build a production-ready, reusable **Accordion** component.
> **Tech Stack:**
>
> * [React / Next.js / Vue / Vanilla HTML+CSS+JS]
> * [TypeScript / JavaScript]
> * [Tailwind CSS / CSS Modules / Vanilla CSS]
> *(Specify your choices above)*
>
>
> **Functional Requirements:**
>
> 1. **Multi-expand vs. Single-expand:** Support a prop/option `allowMultiple` (boolean) to determine whether multiple panels can stay open simultaneously or opening one closes the others.
> 2. **Default Open State:** Support opening specific items by default via a prop (e.g., `defaultOpenIndices={[0]}`).
> 3. **Controlled & Uncontrolled Support:** Allow either internal state management or external control via `value`/`onValueChange`.
> 4. **Fluid Animation:** Smoothly animate panel expand/collapse transitions (e.g., using CSS grid `grid-template-rows: 0fr -> 1fr`, CSS max-height transitions, or Framer Motion) without layout jumps or arbitrary height cutoffs.
> 5. **Indicator Icon:** Include a chevron icon that smoothly rotates 180° when expanded.
>
>
> **Accessibility & Standards (WAI-ARIA Accordion Pattern):**
>
> * Use proper semantic HTML (`<button>` headers nested inside appropriate heading levels like `<h3>`).
> * Add necessary ARIA attributes:
> * `aria-expanded="true|false"` on the trigger button.
> * `aria-controls` on the button pointing to the corresponding panel ID.
> * `id` and `aria-labelledby` linking each panel back to its header button.
> * `role="region"` on the panel containers.
>
>
> * Keyboard navigation:
> * Full `Tab` / `Shift+Tab` focus order.
> * Trigger on `Enter` and `Space`.
> * Arrow key navigation (`ArrowDown`, `ArrowUp`, `Home`, `End`) between accordion headers.
>
>
>
>
> **Output Deliverables:**
>
> 1. Complete component code with TypeScript interfaces.
> 2. Styling code (clean, modern design with hover, focus-visible, and disabled states).
> 3. An example usage implementation showcasing 3–4 dummy FAQ items.
>
>

---

### Quick Fill-In Variables

When sending this prompt, customize these brackets to match your exact setup:

* **Framework:** React 19 / Next.js (App Router) / Vue 3 / Svelte 5 / Plain Web Component
* **Styling:** Tailwind CSS v4 / Vanilla CSS / styled-components
* **Icons:** Lucide React / Heroicons / Raw SVG

Here is a production-ready, accessible Accordion component implementing the WAI-ARIA Accordion design pattern using React, TypeScript, and Tailwind CSS. It uses the modern CSS Grid animation technique (`grid-template-rows: 0fr` to `1fr`) to ensure smooth height transitions without hardcoding `max-height`.

---

### 1. The Accordion Component (`Accordion.tsx`)

```tsx
import React, {
  createContext,
  useContext,
  useState,
  useId,
  useRef,
  useCallback,
  ReactNode,
  KeyboardEvent,
} from 'react';

// --- Types & Interfaces ---

export interface AccordionContextType {
  openValues: string[];
  toggleItem: (value: string) => void;
  registerTrigger: (value: string, element: HTMLButtonElement | null) => void;
  handleKeyNavigation: (e: KeyboardEvent<HTMLButtonElement>, currentValue: string) => void;
}

export interface AccordionProps {
  children: ReactNode;
  /** Allow multiple items to be expanded simultaneously */
  allowMultiple?: boolean;
  /** Pre-opened item values for uncontrolled usage */
  defaultValue?: string | string[];
  /** Controlled active item values */
  value?: string | string[];
  /** Callback fired when expanded items change */
  onValueChange?: (value: string[]) => void;
  className?: string;
}

export interface AccordionItemProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface AccordionTriggerProps {
  children: ReactNode;
  /** Heading level to render for correct document outline */
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

export interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

// --- Contexts ---

const AccordionContext = createContext<AccordionContextType | null>(null);

const AccordionItemContext = createContext<{
  value: string;
  triggerId: string;
  panelId: string;
  isOpen: boolean;
  disabled: boolean;
} | null>(null);

// --- Root Component ---

export function Accordion({
  children,
  allowMultiple = false,
  defaultValue = [],
  value,
  onValueChange,
  className = '',
}: AccordionProps) {
  // Normalize controlled/uncontrolled state
  const isControlled = value !== undefined;
  const [internalValues, setInternalValues] = useState<string[]>(() => {
    if (Array.isArray(defaultValue)) return defaultValue;
    return defaultValue ? [defaultValue] : [];
  });

  const activeValues = isControlled
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : internalValues;

  // Track registered trigger refs for keyboard navigation
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const registerTrigger = useCallback((itemValue: string, element: HTMLButtonElement | null) => {
    if (element) {
      triggerRefs.current.set(itemValue, element);
    } else {
      triggerRefs.current.delete(itemValue);
    }
  }, []);

  const toggleItem = useCallback(
    (itemValue: string) => {
      let next: string[];
      if (allowMultiple) {
        next = activeValues.includes(itemValue)
          ? activeValues.filter((v) => v !== itemValue)
          : [...activeValues, itemValue];
      } else {
        next = activeValues.includes(itemValue) ? [] : [itemValue];
      }

      if (!isControlled) {
        setInternalValues(next);
      }
      onValueChange?.(next);
    },
    [activeValues, allowMultiple, isControlled, onValueChange]
  );

  // WAI-ARIA Keyboard Navigation: ArrowDown, ArrowUp, Home, End
  const handleKeyNavigation = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, currentValue: string) => {
      const triggers = Array.from(triggerRefs.current.entries())
        .filter(([, btn]) => !btn.disabled)
        .map(([val, btn]) => ({ val, btn }));

      if (!triggers.length) return;

      const currentIndex = triggers.findIndex((item) => item.val === currentValue);

      let targetIndex = -1;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          targetIndex = (currentIndex + 1) % triggers.length;
          break;
        case 'ArrowUp':
          e.preventDefault();
          targetIndex = (currentIndex - 1 + triggers.length) % triggers.length;
          break;
        case 'Home':
          e.preventDefault();
          targetIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          targetIndex = triggers.length - 1;
          break;
        default:
          return;
      }

      if (targetIndex >= 0) {
        triggers[targetIndex].btn.focus();
      }
    },
    []
  );

  return (
    <AccordionContext.Provider
      value={{
        openValues: activeValues,
        toggleItem,
        registerTrigger,
        handleKeyNavigation,
      }}
    >
      <div className={`divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// --- Item Component ---

export function AccordionItem({
  value,
  children,
  className = '',
  disabled = false,
}: AccordionItemProps) {
  const generatedId = useId();
  const triggerId = `accordion-trigger-${generatedId}`;
  const panelId = `accordion-panel-${generatedId}`;

  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionItem must be used within an <Accordion>');
  }

  const isOpen = context.openValues.includes(value);

  return (
    <AccordionItemContext.Provider
      value={{
        value,
        triggerId,
        panelId,
        isOpen,
        disabled,
      }}
    >
      <div className={`overflow-hidden transition-colors first:rounded-t-lg last:rounded-b-lg ${className}`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

// --- Trigger Component ---

export function AccordionTrigger({
  children,
  headingLevel: Heading = 'h3',
  className = '',
}: AccordionTriggerProps) {
  const rootContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);

  if (!rootContext || !itemContext) {
    throw new Error('AccordionTrigger must be used within an <AccordionItem>');
  }

  const { value, triggerId, panelId, isOpen, disabled } = itemContext;
  const { toggleItem, registerTrigger, handleKeyNavigation } = rootContext;

  return (
    <Heading className="flex">
      <button
        ref={(el) => registerTrigger(value, el)}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => toggleItem(value)}
        onKeyDown={(e) => handleKeyNavigation(e, value)}
        className={`group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <span>{children}</span>
        {/* Animated Chevron indicator */}
        <svg
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ease-out motion-reduce:transition-none group-hover:text-slate-700 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </Heading>
  );
}

// --- Content Component ---

export function AccordionContent({ children, className = '' }: AccordionContentProps) {
  const itemContext = useContext(AccordionItemContext);

  if (!itemContext) {
    throw new Error('AccordionContent must be used within an <AccordionItem>');
  }

  const { triggerId, panelId, isOpen } = itemContext;

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        <div className={`px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-600 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

```

---

### 2. Usage Example (`FaqSection.tsx`)

```tsx
import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

const FAQ_ITEMS = [
  {
    id: 'item-1',
    question: 'Can I expand multiple accordion items at once?',
    answer:
      'Yes. By setting the allowMultiple prop on the parent Accordion, multiple panels can be expanded simultaneously.',
  },
  {
    id: 'item-2',
    question: 'How does keyboard navigation work?',
    answer:
      'Focus the headers with Tab, then use the Up and Down arrow keys to navigate between headers. Press Home to jump to the first item, End for the last item, and Enter or Space to toggle.',
  },
  {
    id: 'item-3',
    question: 'How is the smooth height animation achieved?',
    answer:
      'It leverages CSS Grid rows (grid-rows-[0fr] transitioning to grid-rows-[1fr]) wrapping an inner overflow-hidden container, preventing CSS height clipping bugs.',
  },
  {
    id: 'item-4',
    question: 'Is this component screen reader accessible?',
    answer:
      'Yes. It strictly adheres to the WAI-ARIA Accordion pattern with aria-expanded, aria-controls, aria-labelledby, and role="region".',
  },
];

export function FaqSection() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
        Frequently Asked Questions
      </h2>

      <Accordion defaultValue={['item-1']} allowMultiple>
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger headingLevel="h3">{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

```

---

### Accessibility & Architecture Highlights

1. **WAI-ARIA Conformance:**

* Each trigger is wrapped inside a semantic heading tag (`<h2>`-`<h6>` selectable via `headingLevel`).
* The trigger has an accessible `aria-expanded="true|false"` flag and an `aria-controls` referencing the content panel ID.
* Content panels declare `role="region"` and `aria-labelledby` referencing their header trigger button.

1. **Keyboard Navigation:**

* Full keyboard arrow loop: `ArrowDown` moves to the next trigger, `ArrowUp` moves backward, `Home` jumps to the first, and `End` jumps to the last. Disabled triggers are automatically skipped.

1. **No-Jank CSS Grid Height Transition:**

* Rather than measuring scroll heights in JavaScript or using arbitrary `max-height: 9999px` values (which cause delayed animation timing), the panel animates using `grid-template-rows: 0fr` to `1fr` in pure CSS.

1. **Motion Preference:**

* The chevron rotation and grid expansion transitions respect user system settings via Tailwind's `motion-reduce:transition-none`.

To package the accordion into a compound component with dot-notation exports (e.g., `<Accordion.Item>`, `<Accordion.Trigger>`, `<Accordion.Content>`), you attach the child sub-components directly as static properties to the main `Accordion` component using `Object.assign`.

Here is the TypeScript implementation pattern.

---

### 1. The Compound Component Packaging

Keep your sub-components (`AccordionItem`, `AccordionTrigger`, `AccordionContent`) as they are, and attach them to `AccordionRoot`:

```tsx
import React from 'react';
import {
  Accordion as AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from './Accordion';

// 1. Define the compound interface
export interface AccordionComponent
  extends React.ForwardRefExoticComponent<
    AccordionProps & React.RefAttributes<HTMLDivElement>
  > {
  Item: typeof AccordionItem;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
}

// 2. Attach sub-components using Object.assign
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
}) as AccordionComponent;

// 3. Re-export individual props for consumers who need typing
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
};

```

---

### 2. Updating `AccordionRoot` to Support `forwardRef`

To ensure consumers can pass a `ref` directly to `<Accordion ref="{containerRef}">`, wrap the root component with `React.forwardRef`:

```tsx
export const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    {
      children,
      allowMultiple = false,
      defaultValue = [],
      value,
      onValueChange,
      className = '',
    },
    ref
  ) {
    // ... same state and context logic as before ...

    return (
      <AccordionContext.Provider
        value={{
          openValues: activeValues,
          toggleItem,
          registerTrigger,
          handleKeyNavigation,
        }}
      >
        <div
          ref={ref}
          className={`divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white ${className}`}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

```

---

### 3. Usage with Dot-Notation

Consumers only need a single import statement to access the entire compound API:

```tsx
import React from 'react';
import { Accordion } from './Accordion';

export function FAQ() {
  return (
    <Accordion defaultValue={['faq-1']} allowMultiple>
      <Accordion.Item value="faq-1">
        <Accordion.Trigger headingLevel="h3">
          What is compound component dot notation?
        </Accordion.Trigger>
        <Accordion.Content>
          It attaches sub-components directly to the parent component,
          reducing import noise and establishing a clear hierarchy.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="faq-2">
        <Accordion.Trigger headingLevel="h3">
          Does this break tree-shaking?
        </Accordion.Trigger>
        <Accordion.Content>
          For tightly coupled components like Accordion, Tabs, or Select,
          sub-components are almost always used together, so bundling them
          as a cohesive unit has virtually zero negative bundle impact.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

```

---

### Key Advantages of This Approach

* **Single Import Surface:** Consumers import one symbol (`import { Accordion } from '@/components/ui/Accordion'`) instead of cluttering file headers with four separate named imports.
* **Namespace Protection:** Names like `Item`, `Trigger`, and `Content` are scoped under `Accordion`, preventing collisions with other components (e.g., `Dialog.Trigger`, `Tabs.Content`).
* **Preserved Direct Imports:** You can still export `AccordionItem`, `AccordionTrigger`, and `AccordionContent` as standalone named exports in case a consumer prefers named imports.

How do I enforce at runtime or compile-time that Accordion.Trigger can only be placed inside Accordion.Item?

To enforce this relationship, you combine **runtime assertion via React Context** (the industry standard used by libraries like Radix UI and Headless UI) with **compile-time constraints using TypeScript typing patterns**.

---

### 1. Runtime Enforcement: Context Guard (Recommended & Standard)

In React, compile-time JSX children typing cannot strictly inspect arbitrary nesting depth (e.g., `<Accordion.Item><div><Accordion.Trigger/></div></Accordion.Item>`). A **custom context hook** guarantees a clear, descriptive runtime exception if the component is mounted outside its intended parent.

#### The Item Context and Guard Hook

```tsx
import { createContext, useContext } from 'react';

export interface AccordionItemContextType {
  value: string;
  triggerId: string;
  panelId: string;
  isOpen: boolean;
  disabled: boolean;
}

// 1. Initialize context to null
export const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

// 2. Custom assertion hook
export function useAccordionItemContext(componentName: string): AccordionItemContextType {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error(
      `[Accordion Error]: <${componentName}> must be rendered within an <Accordion.Item>.`
    );
  }

  return context;
}

```

#### Consuming the Guard in `Accordion.Trigger` and `Accordion.Content`

```tsx
export function AccordionTrigger({ children, ...props }: AccordionTriggerProps) {
  // If placed outside <Accordion.Item>, execution stops here with the custom error
  const { value, triggerId, panelId, isOpen, disabled } = useAccordionItemContext('Accordion.Trigger');
  const { toggleItem, registerTrigger, handleKeyNavigation } = useAccordionRootContext('Accordion.Trigger');

  return (
    <button
      id={triggerId}
      aria-expanded={isOpen}
      aria-controls={panelId}
      disabled={disabled}
      onClick={() => toggleItem(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function AccordionContent({ children, ...props }: AccordionContentProps) {
  const { triggerId, panelId, isOpen } = useAccordionItemContext('Accordion.Content');

  return (
    <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!isOpen} {...props}>
      {children}
    </div>
  );
}

```

---

### 2. Compile-Time Enforcement: Strict Children & Slots Pattern

TypeScript cannot validate that deep, nested descendants exist only inside certain parents if children are typed as general `ReactNode`. However, you can restrict the structure at compile time using either **Typed Direct Children** or **Render Callbacks / Slot APIs**.

#### Approach A: Discriminated Child Elements via `ReactElement`

Restrict `Accordion.Item` to only accept a tuple of specific element types as its direct children:

```tsx
import React, { ReactElement } from 'react';

type TriggerElement = ReactElement<AccordionTriggerProps, typeof AccordionTrigger>;
type ContentElement = ReactElement<AccordionContentProps, typeof AccordionContent>;

export interface AccordionItemStrictProps {
  value: string;
  // Compile-time constraint: Only accepts Trigger and Content as direct children
  children: [TriggerElement, ContentElement] | [ContentElement, TriggerElement] | TriggerElement;
  disabled?: boolean;
  className?: string;
}

export function AccordionItemStrict({ children, value, disabled }: AccordionItemStrictProps) {
  // ...
  return <div>{children}</div>;
}

```

*What happens at compile time:*

```tsx
// ✅ PASSES: Direct children are Accordion.Trigger and Accordion.Content
<Accordion.Item value="1">
  <Accordion.Trigger>Title</Accordion.Trigger>
  <Accordion.Content>Body</Accordion.Content>
</Accordion.Item>

// ❌ COMPILE ERROR: Type 'HTMLParagraphElement' is not assignable to 'ReactElement<AccordionTriggerProps>'
<Accordion.Item value="1">
  <p>Random Paragraph</p>
  <Accordion.Content>Body</Accordion.Content>
</Accordion.Item>

```

> **Trade-off:** This restricts consumer flexibility; intermediate wrapper elements (like styling `<div>`s) around triggers or content will trigger type errors unless explicitly allowed in the union.

---

#### Approach B: Scoped Factory (The Slot / Render Callback Pattern)

Enforce that `Trigger` can *only* exist through the scope passed by `Accordion.Item`:

```tsx
import React, { ReactNode } from 'react';

interface RenderItemProps {
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
  isOpen: boolean;
}

export interface AccordionItemScopedProps {
  value: string;
  children: (components: RenderItemProps) => ReactNode;
}

export function AccordionItemScoped({ value, children }: AccordionItemScopedProps) {
  const itemContext = useAccordionItemContextInternal(value);

  return (
    <AccordionItemContext.Provider value={itemContext}>
      <div>
        {children({
          Trigger: AccordionTrigger,
          Content: AccordionContent,
          isOpen: itemContext.isOpen,
        })}
      </div>
    </AccordionItemContext.Provider>
  );
}

```

*Usage:*

```tsx
<Accordion>
  <Accordion.Item value="1">
    {({ Trigger, Content }) => (
      <>
        <Trigger>Question</Trigger>
        <Content>Answer</Content>
      </>
    )}
  </Accordion.Item>
</Accordion>

```

Because the components are delivered within the callback scope, consuming them elsewhere is syntactically impossible without deliberate scope leakage.

---

### Summary Recommendation

| Pattern                            | Check Type       | Pros                                                                   | Cons                                                      |
| ---------------------------------- | ---------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| **Context Guard Hook**             | **Runtime**      | Flexible DOM nesting, standard pattern in Radix/Headless UI, clean DX. | Error surfaces when mounting/rendering, not in editor.    |
| **Tuple / `ReactElement` Union**   | **Compile-time** | Caught immediately in the IDE by the compiler.                         | Disallows custom wrapper wrappers (`<div>`) around items. |
| **Render Callback / Scoped Slots** | **Compile-time** | Guarantees components only exist within the item scope.                | More verbose JSX syntax for consumers.                    |

In production design systems, **Pattern 1 (Context Guard Hook)** is the preferred standard: it gives developers complete styling freedom with arbitrary markup wrappers while immediately failing tests and development builds with clear troubleshooting messages if misused.
