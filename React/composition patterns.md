Before reaching for `React.memo`, `useMemo`, or `useCallback`, you can eliminate the vast majority of unnecessary re-renders purely through **component architecture**.

In React, when a component's state changes, **that component and all of its descendants re-render recursively**. By structuring your component tree so that state updates are isolated locally or passed around static children, you prevent parent re-renders from cascading down the tree.

Here are the 4 fundamental composition patterns that eliminate re-renders naturally.

---

## Pattern 1: Moving State Down (State Isolation)

### The Problem

When state lives at a high level in a parent component, every state change forces the parent and all sibling components—even heavy, unrelated ones—to re-render.

```
❌ BAD: Unrelated Heavy Tree re-renders on every keystroke
┌─────────────────────────────────────────┐
│ Parent Component                        │
│ [State: textInput]                      │
│   ├── <input value={textInput} />       │
│   └── <HeavyComponentTree /> ◄──RE-RENDERS│
└─────────────────────────────────────────┘

```

#### ❌ Vulnerable Code

```tsx
export function Page() {
  const [text, setText] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <HeavyComponentTree />
    </div>
  );
}

```

### The Solution

Extract the stateful controls into their own dedicated child component. When state updates, only the isolated child component re-renders.

```
✅ GOOD: Only the isolated FormInput re-renders
┌─────────────────────────────────────────┐
│ Parent Component                        │
│   ├── <FormInput /> [State: textInput]  │
│   └── <HeavyComponentTree /> (Untouched)│
└─────────────────────────────────────────┘

```

#### ✅ Optimized Code

```tsx
// 1. Isolated stateful component
function FormInput() {
  const [text, setText] = useState('');
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}

// 2. Parent remains stateless regarding text input
export function Page() {
  return (
    <div style={{ padding: '20px' }}>
      <FormInput />
      <HeavyComponentTree />
    </div>
  );
}

```

---

## Pattern 2: Passing Children as Props (`children` Slot Pattern)

### The Problem

Sometimes a parent component *must* hold state (e.g., controlling a scroll position, expandable accordion, theme toggle, or dark mode container), but it wraps heavy child content that doesn't care about that state.

```tsx
// ❌ BAD: Toggling isOpen re-renders HeavyComponentTree
export function ExpandableSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && (
        <div className="content">
          <HeavyComponentTree />
        </div>
      )}
    </div>
  );
}

```

### The Solution

Lift the heavy content out of the stateful component and pass it in using the **`children`** prop.

Because `children` is created in the outer scope, its reference remains stable when `ExpandableSection` re-renders. React recognizes that the element reference hasn't changed and **completely skips re-rendering the `children` subtree**.

```tsx
// 1. Stateful wrapper accepts children
function ExpandableSection({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div className="content">{children}</div>}
    </div>
  );
}

// 2. HeavyComponentTree is instantiated in App, NOT in ExpandableSection
export function App() {
  return (
    <ExpandableSection>
      <HeavyComponentTree />
    </ExpandableSection>
  );
}

```

---

## Pattern 3: Named Component Slots

This is an extension of the `children` pattern for components that require multiple independent slots (like a dashboard layout with a header, sidebar, and main body).

### The Solution

Accept JSX elements as explicit named props rather than instantiating them inside the stateful layout.

```tsx
interface SplitLayoutProps {
  leftSlot: React.ReactNode;
  rightSlot: React.ReactNode;
}

// Stateful layout (e.g., handles drag-to-resize state)
function ResizableSplitLayout({ leftSlot, rightSlot }: SplitLayoutProps) {
  const [leftWidth, setLeftWidth] = useState(300);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: leftWidth }}>{leftSlot}</div>
      <div className="resizer" onMouseDown={() => setLeftWidth(350)} />
      <div style={{ flex: 1 }}>{rightSlot}</div>
    </div>
  );
}

// Usage: Resizing the layout will NOT re-render Navigation or ComplexContent
export function Dashboard() {
  return (
    <ResizableSplitLayout
      leftSlot={<NavigationSidebar />}
      rightSlot={<ComplexContent />}
    />
  );
}

```

---

## Pattern 4: Uncontrolled Components with `useRef`

### The Problem

Using state to manage form inputs or UI values that are only needed at a single moment (e.g., upon form submission) causes a full component re-render on **every single keystroke**.

```tsx
// ❌ BAD: 100 keystrokes = 100 re-renders
export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}

```

### The Solution

Use `useRef` to store DOM references or transient values. Updating a `ref` **does not trigger a re-render**. Read the values only when the submit action occurs.

```tsx
// ✅ GOOD: 0 re-renders while typing
export function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    api.login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} type="email" defaultValue="" />
      <input ref={passwordRef} type="password" defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}

```

---

## Architecture Summary Rule

| Scenario | Recommended Pattern |
| --- | --- |
| Form inputs or search bars affecting a tiny section | **Move State Down** into a dedicated component. |
| Stateful wrapper (dialogs, accordions, scroll listeners) surrounding content | **Pass `children` as props** to stabilize the inner subtree. |
| Complex layouts with multiple dynamic panels | **Named Component Slots** (`leftSlot`, `rightSlot`). |
| Data needed only upon trigger (submit/click) | **Uncontrolled Inputs with `useRef**`. |