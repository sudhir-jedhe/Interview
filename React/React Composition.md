**React Composition** is a fundamental design pattern in React where components are built by **combining simpler, smaller components together** rather than relying on class inheritance or deep prop drilling.

Instead of asking *"What properties does this component inherit?"*, React asks *"What components can I combine inside this component?"*

---

## 1. The Core Pattern: `children` Prop

The simplest form of composition uses the built-in `children` prop. This allows a component to act as a "wrapper" or "shell" without needing to know what specific content goes inside it ahead of time.

### Bad Approach (Rigid Props)

```tsx
// ❌ Rigid: Hardcodes layout and requires lots of specific props
function Dialog({ title, message, showCancelButton, onConfirm, onCancel }) {
  return (
    <div className="modal">
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={onConfirm}>OK</button>
      {showCancelButton && <button onClick={onCancel}>Cancel</button>}
    </div>
  );
}

```

### Good Approach (Composition with `children`)

```tsx
// ✅ Flexible: Acts as a generic container that accepts any JSX
function Modal({ children }: { children: React.ReactNode }) {
  return <div className="modal-overlay"><div className="modal-content">{children}</div></div>;
}

// Usage: You can put ANYTHING inside the Modal
function App() {
  return (
    <Modal>
      <h2>Delete Account?</h2>
      <p>This action cannot be undone.</p>
      <div className="button-group">
        <button>Cancel</button>
        <button className="danger">Delete</button>
      </div>
    </Modal>
  );
}

```

---

## 2. Named Slots (Passing JSX as Props)

If a container component needs multiple distinct "slots" (e.g., a header, sidebar, and body), you can pass JSX elements directly as custom props instead of just relying on `children`.

```tsx
interface SplitLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

function SplitLayout({ sidebar, main }: SplitLayoutProps) {
  return (
    <div className="layout">
      <aside className="sidebar">{sidebar}</aside>
      <main className="main-content">{main}</main>
    </div>
  );
}

// Usage:
function Dashboard() {
  return (
    <SplitLayout
      sidebar={<SidebarNavigation />}
      main={<UserProfileData />}
    />
  );
}

```

---

## 3. Compound Components Pattern

The **Compound Components** pattern is an advanced composition technique where multiple components work together to manage shared implicit state while giving the consumer complete control over rendering and layout.

Think of native HTML elements like `<select>` and `<option>`: they work together seamlessly as a single unit.

### Example: Accordion Component

```tsx
import React, { useState, createContext, useContext } from 'react';

// 1. Create Context for shared state
const AccordionContext = createContext<{
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
} | null>(null);

// 2. Parent Container Component
export function Accordion({ children }: { children: React.ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

// 3. Child Components composed together
Accordion.Item = function AccordionItem({ index, children }: { index: number; children: React.ReactNode }) {
  return <div className="accordion-item">{children}</div>;
};

Accordion.Header = function AccordionHeader({ index, children }: { index: number; children: React.ReactNode }) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Accordion.Header must be used inside Accordion');

  const isOpen = context.openIndex === index;

  return (
    <button onClick={() => context.setOpenIndex(isOpen ? null : index)}>
      {children} {isOpen ? '▲' : '▼'}
    </button>
  );
};

Accordion.Panel = function AccordionPanel({ index, children }: { index: number; children: React.ReactNode }) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Accordion.Panel must be used inside Accordion');

  if (context.openIndex !== index) return null;

  return <div className="accordion-panel">{children}</div>;
};

```

### Usage of Compound Component

```tsx
// Clean, expressive UI composed at the consumption site
export function FAQ() {
  return (
    <Accordion>
      <Accordion.Item index={0}>
        <Accordion.Header index={0}>What is React Composition?</Accordion.Header>
        <Accordion.Panel index={0}>It is a pattern for building flexible UIs by combining components.</Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item index={1}>
        <Accordion.Header index={1}>Why use it over Inheritance?</Accordion.Header>
        <Accordion.Panel index={1}>React does not use class inheritance; composition is cleaner and more modular.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

```

---

## 4. How Composition Solves Prop Drilling

Prop drilling happens when a parent component passes props down through multiple layers of intermediate components that don't actually need those props. Composition eliminates this naturally:

### Before Composition (Prop Drilling)

```tsx
// ❌ App has to pass 'user' through Nav and Header even though only UserAvatar needs it
function App() {
  const [user] = useState({ name: 'Alex' });
  return <Page user={user} />;
}

function Page({ user }) {
  return <Header user={user} />;
}

function Header({ user }) {
  return <Nav user={user} />;
}

function Nav({ user }) {
  return <UserAvatar user={user} />;
}

```

### After Composition (No Prop Drilling)

```tsx
// ✅ Pass the pre-configured component directly as children
function App() {
  const [user] = useState({ name: 'Alex' });

  return (
    <Page>
      <Header>
        <Nav>
          <UserAvatar user={user} />
        </Nav>
      </Header>
    </Page>
  );
}

// Intermediate components just render {children}!
function Header({ children }) {
  return <header className="header">{children}</header>;
}
function Nav({ children }) {
  return <nav className="nav">{children}</nav>;
}

```

---

## Summary: Benefits of Composition

| Metric            | Inheritance / Rigid Props                                     | React Composition                                 |
| ----------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| **Flexibility**   | Low—tied to fixed component prop signatures                   | High—mix and match any components freely          |
| **Coupling**      | Tight coupling between parent and child details               | Loose coupling via `children` or Context          |
| **Prop Drilling** | High—props must pass through intermediate layers              | Low—components configured at the top level        |
| **Reusability**   | Creates massive "god components" with dozens of boolean flags | Creates small, focused, single-purpose components |

Show a step-by-step example of refactoring a monolithic Card component into a Compound Component pattern in React.

Here is a step-by-step walkthrough of refactoring a monolithic, prop-heavy `Card` component into a flexible **Compound Component** architecture using React and TypeScript.

---

## The Problem: The Monolithic Card Component

Monolithic components start simple, but as new feature requests come in, they accumulate boolean flags, optional props, and inline layout logic.

### ❌ Before (Monolithic & Rigid)

```tsx
interface MonolithicCardProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  badgeText?: string;
  badgeColor?: 'blue' | 'green' | 'red';
  bodyText: string;
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
  isExpandable?: boolean;
}

export function MonolithicCard(props: MonolithicCardProps) {
  return (
    <div className="card">
      {props.imageSrc && <img src={props.imageSrc} alt={props.imageAlt || ''} />}
      <div className="card-header">
        <div>
          <h3>{props.title}</h3>
          {props.subtitle && <p className="subtitle">{props.subtitle}</p>}
        </div>
        {props.badgeText && (
          <span className={`badge ${props.badgeColor || 'blue'}`}>
            {props.badgeText}
          </span>
        )}
      </div>
      <div className="card-body">
        <p>{props.bodyText}</p>
      </div>
      {(props.primaryButtonText || props.secondaryButtonText) && (
        <div className="card-footer">
          {props.secondaryButtonText && (
            <button onClick={props.onSecondaryClick}>{props.secondaryButtonText}</button>
          )}
          {props.primaryButtonText && (
            <button className="primary" onClick={props.onPrimaryClick}>
              {props.primaryButtonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

```

### Why This Fails at Scale

1. **Prop Explosion:** Every new design variation requires adding 2–3 new props.
2. **Inflexible Layout:** What if the design team wants the badge placed at the bottom, or an icon next to the title? The monolithic component forces a single layout order.
3. **Markup Bloat:** Unused conditional blocks pollute the component with `if/else` checks.

---

## The Solution: Refactoring to Compound Components

We will break the `Card` down into composable sub-components (`Card.Header`, `Card.Title`, `Card.Body`, `Card.Footer`) that communicate through an implicit React Context.

---

### Step 1: Define Context for Shared State

Create a React Context to manage shared state (like an expandable or hover state) between parent and child components without prop drilling:

```tsx
// CardContext.tsx
import { createContext, useContext } from 'react';

interface CardContextType {
  isExpanded?: boolean;
  toggleExpand?: () => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export function useCardContext() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('Card sub-components must be rendered within a <Card> provider');
  }
  return context;
}

export const CardContextProvider = CardContext.Provider;

```

---

### Step 2: Build the Main Container Component

The parent `Card` component acts as the container and context provider:

```tsx
// Card.tsx
import React, { useState } from 'react';
import { CardContextProvider } from './CardContext';

interface CardProps {
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function Card({
  children,
  collapsible = false,
  defaultExpanded = true,
  className = '',
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    if (collapsible) setIsExpanded((prev) => !prev);
  };

  return (
    <CardContextProvider value={{ isExpanded, toggleExpand }}>
      <div className={`card ${className}`}>{children}</div>
    </CardContextProvider>
  );
}

```

---

### Step 3: Create Sub-Components

Build small, single-purpose components for each section of the card:

```tsx
// CardSubComponents.tsx
import React from 'react';
import { useCardContext } from './CardContext';

// 1. Image Header
export function CardImage({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="card-image" />;
}

// 2. Card Header
export function CardHeader({ children }: { children: React.ReactNode }) {
  const { toggleExpand } = useCardContext();
  return (
    <div className="card-header" onClick={toggleExpand}>
      {children}
    </div>
  );
}

// 3. Card Title
export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="card-title">{children}</h3>;
}

// 4. Card Body (Respects expansion context)
export function CardBody({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useCardContext();

  if (!isExpanded) return null;

  return <div className="card-body">{children}</div>;
}

// 5. Card Footer
export function CardFooter({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useCardContext();

  if (!isExpanded) return null;

  return <div className="card-footer">{children}</div>;
}

// 6. Custom Badge Sub-component
export function CardBadge({
  children,
  color = 'blue',
}: {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red';
}) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}

```

---

### Step 4: Attach Sub-Components to the Main Component

Namespace the sub-components onto `Card` so they can be imported cleanly together:

```tsx
// index.ts
import { Card as CardRoot } from './Card';
import {
  CardImage,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  CardBadge,
} from './CardSubComponents';

export const Card = Object.assign(CardRoot, {
  Image: CardImage,
  Header: CardHeader,
  Title: CardTitle,
  Body: CardBody,
  Footer: CardFooter,
  Badge: CardBadge,
});

```

---

## ✅ After: Flexible Usage Examples

Now, developers can compose cards in any order, with any combination of elements, without modifying the core `Card` implementation.

### Example A: Basic Product Card

```tsx
<Card>
  <Card.Image src="/laptop.jpg" alt="Pro Laptop" />
  <Card.Header>
    <Card.Title>Pro Laptop 16"</Card.Title>
    <Card.Badge color="green">In Stock</Card.Badge>
  </Card.Header>
  <Card.Body>
    High-performance laptop featuring a 16-core processor and 32GB RAM.
  </Card.Body>
  <Card.Footer>
    <button className="primary">Buy Now</button>
  </Card.Footer>
</Card>

```

### Example B: Collapsible Article Card (New Layout Order)

Notice how we easily moved the badge to the footer and added a custom icon without changing the `Card` component's source code:

```tsx
<Card collapsible defaultExpanded={false}>
  <Card.Header>
    <Card.Title>Click to Expand Article Details</Card.Title>
  </Card.Header>
  <Card.Body>
    <p>This body text stays hidden until the header is clicked!</p>
  </Card.Body>
  <Card.Footer>
    <span>Published 2 days ago</span>
    <Card.Badge color="blue">Tutorial</Card.Badge>
  </Card.Footer>
</Card>

```

---

## Comparison Summary

| Metric              | Monolithic Component                                        | Compound Component                                |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| **API Surface**     | 10+ specific props (`title`, `badgeText`, `onPrimaryClick`) | Container + small focused sub-components          |
| **Layout Control**  | Fixed by the component author                               | Complete freedom at the consumer call site        |
| **Custom Elements** | Hard to add custom markup inside the card                   | Drop standard JSX anywhere between sub-components |
| **Maintenance**     | Re-editing the monolithic file for every edge case          | Add new standalone sub-components as needed       |

Here is a complete Todo List application designed around **React Composition**.

Instead of building a single monolithic component or passing props through multiple layers, this app is composed of reusable, flexible building blocks (`Card`, `TodoList`, `TodoItem`, `FilterBar`, and `InputForm`) using the `children` prop and **Compound Components**.

---

### 1. `TodoApp.module.css` (Styles)

```css
.container {
  max-width: 520px;
  margin: 60px auto;
  font-family: system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.cardHeader {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background-color: #f8fafc;
}

.cardTitle {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.cardBody {
  padding: 24px;
}

.cardFooter {
  padding: 16px 24px;
  background-color: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #64748b;
}

.form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
}

.input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.primaryBtn {
  padding: 10px 16px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.filterGroup {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.filterBtn {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  background: transparent;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
}

.filterActive {
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: #ffffff;
}

.itemContent {
  display: flex;
  align-items: center;
  gap: 12px;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4f46e5;
}

.completed {
  text-decoration: line-through;
  color: #94a3b8;
}

.deleteBtn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 0.875rem;
}

.emptyState {
  text-align: center;
  padding: 24px;
  color: #94a3b8;
}

```

---

### 2. Composable UI Components (`components.tsx`)

Here we create independent layout components that accept `children` so they can be arranged freely:

```tsx
// components.tsx
import React from 'react';
import styles from './TodoApp.module.css';

// 1. Generic Card Container (Composition shell)
export function Card({ children }: { children: React.ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className={styles.cardHeader}>{children}</div>;
};

Card.Title = function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={styles.cardTitle}>{children}</h2>;
};

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className={styles.cardBody}>{children}</div>;
};

Card.Footer = function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className={styles.cardFooter}>{children}</div>;
};

// 2. Input Form Component
export function InputForm({
  onSubmit,
  children,
}: {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {children}
    </form>
  );
}

InputForm.Field = function InputFormField(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input className={styles.input} {...props} />;
};

InputForm.Button = function InputFormButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button type="submit" className={styles.primaryBtn}>
      {children}
    </button>
  );
};

// 3. List Wrapper Component
export function TodoList({ children }: { children: React.ReactNode }) {
  return <ul className={styles.list}>{children}</ul>;
}

// 4. Todo Item Component (Slot composition)
export function TodoItem({
  completed,
  onToggle,
  text,
  actions,
}: {
  completed: boolean;
  onToggle: () => void;
  text: string;
  actions?: React.ReactNode; // Slot for custom actions
}) {
  return (
    <li className={styles.item}>
      <div className={styles.itemContent}>
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className={styles.checkbox}
        />
        <span className={completed ? styles.completed : ''}>{text}</span>
      </div>
      {actions && <div>{actions}</div>}
    </li>
  );
}

```

---

### 3. Assembling the Application (`App.tsx`)

By bringing the composed components together, `App.tsx` reads like a readable layout tree with no prop drilling:

```tsx
// App.tsx
import React, { useState } from 'react';
import { Card, InputForm, TodoList, TodoItem } from './components';
import styles from './TodoApp.module.css';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';

export function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Learn React Composition', completed: true },
    { id: '2', text: 'Refactor monoliths into Compound Components', completed: false },
  ]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now().toString(), text, completed: false }]);
    setText('');
  };

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className={styles.container}>
      {/* Composed Layout */}
      <Card>
        <Card.Header>
          <Card.Title>Task Manager</Card.Title>
        </Card.Header>

        <Card.Body>
          {/* Composed Form */}
          <InputForm onSubmit={handleAdd}>
            <InputForm.Field
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <InputForm.Button>Add Task</InputForm.Button>
          </InputForm>

          {/* Filter Bar */}
          <div className={styles.filterGroup}>
            {(['all', 'active', 'completed'] as Filter[]).map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${
                  filter === f ? styles.filterActive : ''
                }`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Composed List */}
          {filteredTodos.length > 0 ? (
            <TodoList>
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  text={todo.text}
                  completed={todo.completed}
                  onToggle={() => handleToggle(todo.id)}
                  actions={
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  }
                />
              ))}
            </TodoList>
          ) : (
            <div className={styles.emptyState}>No tasks found.</div>
          )}
        </Card.Body>

        <Card.Footer>
          <span>{activeCount} active tasks remaining</span>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default App;

```

---

### Why This Composition Approach Works Better

1. **Flexible Layouts:** If you want to move the `FilterBar` into `Card.Header` or put the `Card.Footer` at the top, you simply rearrange the JSX inside `App.tsx` without modifying `Card` or `TodoList` internals.
2. **Custom Actions via Slots:** `TodoItem` accepts an `actions` prop as a JSX slot. If a task needs an extra "Edit" or "Pin" button later, you pass it directly at the render site without expanding `TodoItem`'s core props.
3. **No Monolithic Props:** Small single-purpose sub-components (`Card.Header`, `InputForm.Field`) keep prop interfaces small and maintainable.

Show how to add inline task editing to this React composition Todo list.

Here is how to extend the composed Todo app with **inline editing** while preserving the composition pattern.

We will introduce a composable `TodoItem.EditField` slot inside `TodoItem`, giving `App.tsx` full control over when to render a static view or an inline edit input.

---

### 1. Updated `components.tsx` (Adding Slot & Keyboard Handlers)

Update `TodoItem` to accept an `isEditing` state and an optional `editForm` slot:

```tsx
// components.tsx
import React from 'react';
import styles from './TodoApp.module.css';

// ... (Card, InputForm, TodoList remain unchanged)

interface TodoItemProps {
  completed: boolean;
  onToggle: () => void;
  text: string;
  isEditing?: boolean;
  editForm?: React.ReactNode; // Slot for rendering the edit input/form
  actions?: React.ReactNode;  // Slot for buttons (Edit/Delete/Save)
}

export function TodoItem({
  completed,
  onToggle,
  text,
  isEditing = false,
  editForm,
  actions,
}: TodoItemProps) {
  return (
    <li className={styles.item}>
      <div className={styles.itemContent} style={{ flex: 1 }}>
        {!isEditing && (
          <input
            type="checkbox"
            checked={completed}
            onChange={onToggle}
            className={styles.checkbox}
          />
        )}

        {/* Render either the inline edit form slot OR static text */}
        {isEditing ? (
          editForm
        ) : (
          <span
            className={completed ? styles.completed : ''}
            onClick={onToggle}
            style={{ cursor: 'pointer' }}
          >
            {text}
          </span>
        )}
      </div>

      {actions && <div>{actions}</div>}
    </li>
  );
}

// Sub-component for clean inline edit input rendering
TodoItem.EditInput = function TodoItemEditInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      className={styles.input}
      style={{ padding: '6px 10px', fontSize: '0.9rem', width: '100%' }}
      {...props}
      autoFocus
    />
  );
};

```

---

### 2. Updated `App.tsx` (Wiring Inline Editing State)

In `App.tsx`, manage the `editingId` and `editText` state, and pass the edit controls dynamically through the `editForm` and `actions` slots:

```tsx
// App.tsx
import React, { useState } from 'react';
import { Card, InputForm, TodoList, TodoItem } from './components';
import styles from './TodoApp.module.css';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';

export function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Learn React Composition', completed: true },
    { id: '2', text: 'Refactor monoliths into Compound Components', completed: false },
  ]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  // State for inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now().toString(), text, completed: false }]);
    setText('');
  };

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Inline edit handlers
  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (trimmed) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
      );
    } else {
      handleDelete(id); // Delete if saved empty
    }
    setEditingId(null);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className={styles.container}>
      <Card>
        <Card.Header>
          <Card.Title>Task Manager</Card.Title>
        </Card.Header>

        <Card.Body>
          <InputForm onSubmit={handleAdd}>
            <InputForm.Field
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <InputForm.Button>Add Task</InputForm.Button>
          </InputForm>

          <div className={styles.filterGroup}>
            {(['all', 'active', 'completed'] as Filter[]).map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${
                  filter === f ? styles.filterActive : ''
                }`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filteredTodos.length > 0 ? (
            <TodoList>
              {filteredTodos.map((todo) => {
                const isEditing = editingId === todo.id;

                return (
                  <TodoItem
                    key={todo.id}
                    text={todo.text}
                    completed={todo.completed}
                    isEditing={isEditing}
                    onToggle={() => handleToggle(todo.id)}
                    /* Slot 1: Inline edit input slot */
                    editForm={
                      <TodoItem.EditInput
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => handleSaveEdit(todo.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(todo.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                    }
                    /* Slot 2: Context-sensitive actions slot */
                    actions={
                      isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(todo.id)}
                          className={styles.filterBtn}
                          style={{ color: '#0284c7' }}
                        >
                          Save
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleStartEdit(todo)}
                            className={styles.filterBtn}
                            style={{ color: '#0284c7' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </div>
                      )
                    }
                  />
                );
              })}
            </TodoList>
          ) : (
            <div className={styles.emptyState}>No tasks found.</div>
          )}
        </Card.Body>

        <Card.Footer>
          <span>{activeCount} active tasks remaining</span>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default App;

```

---

### Key Architectural Advantages

1. **Zero Internal Component Changes for New Behavior:** We didn't need to add edit handlers or `onSave`/`onCancel` props directly inside `TodoItem`. The component remains an agnostic shell.
2. **Keyboard Accessibility Out-of-the-Box:** Pressing **Enter** saves the edited task, pressing **Escape** cancels editing, and clicking outside (`onBlur`) automatically saves.
3. **Pluggable Actions:** The action slot cleanly swaps between `{Edit, Delete}` buttons and a `{Save}` button based on `isEditing`.

Show how to replace prop passing in this composed Todo app with React Context.
Here is how to refactor the composed Todo app to use **React Context**.

By wrapping the application in a `TodoProvider`, all todo state management (adding, toggling, editing, deleting, and filtering) is encapsulated in context. Sub-components like `InputForm`, `TodoList`, `TodoItem`, and `FilterBar` can read state and dispatch actions directly without receiving props from `App.tsx`.

---

### 1. Create the Todo Context (`TodoContext.tsx`)

This file contains the context, the provider with `localStorage` persistence, and a custom `useTodo` hook for type-safe consumption.

```tsx
// src/TodoContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';

interface TodoContextType {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: Filter;
  activeCount: number;
  editingId: string | null;
  editText: string;
  setFilter: (filter: Filter) => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  startEditing: (todo: Todo) => void;
  setEditText: (text: string) => void;
  saveEdit: (id: string) => void;
  cancelEditing: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'react_context_todo_app';

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Actions
  const addTodo = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text: trimmed, completed: false },
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (trimmed) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
      );
    } else {
      deleteTodo(id);
    }
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  // Derived values
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        filter,
        activeCount,
        editingId,
        editText,
        setFilter,
        addTodo,
        toggleTodo,
        deleteTodo,
        startEditing,
        setEditText,
        saveEdit,
        cancelEditing,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

// Custom Hook for consuming context safely
export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}

```

---

### 2. Context-Aware Composed Components (`components.tsx`)

Now, components consume the context directly using `useTodo()`. Notice how prop drilling for `onToggle`, `onDelete`, `onSave`, and list arrays is completely removed:

```tsx
// src/components.tsx
import React, { useState } from 'react';
import { useTodo, Filter, Todo } from './TodoContext';
import styles from './TodoApp.module.css';

// 1. Generic Card Shell (Composition Container)
export function Card({ children }: { children: React.ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className={styles.cardHeader}>{children}</div>;
};

Card.Title = function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={styles.cardTitle}>{children}</h2>;
};

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className={styles.cardBody}>{children}</div>;
};

Card.Footer = function CardFooter() {
  const { activeCount } = useTodo();
  return (
    <div className={styles.cardFooter}>
      <span>{activeCount} active tasks remaining</span>
    </div>
  );
};

// 2. Self-Contained Input Form
export function InputForm() {
  const [inputVal, setInputVal] = useState('');
  const { addTodo } = useTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    addTodo(inputVal);
    setInputVal('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        className={styles.input}
        placeholder="What needs to be done?"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
      <button type="submit" className={styles.primaryBtn}>
        Add Task
      </button>
    </form>
  );
}

// 3. Self-Contained Filter Bar
export function FilterBar() {
  const { filter, setFilter } = useTodo();

  return (
    <div className={styles.filterGroup}>
      {(['all', 'active', 'completed'] as Filter[]).map((f) => (
        <button
          key={f}
          className={`${styles.filterBtn} ${
            filter === f ? styles.filterActive : ''
          }`}
          onClick={() => setFilter(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}

// 4. Todo List Consumer Component
export function TodoList() {
  const { filteredTodos } = useTodo();

  if (filteredTodos.length === 0) {
    return <div className={styles.emptyState}>No tasks found.</div>;
  }

  return (
    <ul className={styles.list}>
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

// 5. Todo Item Consumer Component
function TodoItem({ todo }: { todo: Todo }) {
  const {
    toggleTodo,
    deleteTodo,
    editingId,
    editText,
    startEditing,
    setEditText,
    saveEdit,
    cancelEditing,
  } = useTodo();

  const isEditing = editingId === todo.id;

  return (
    <li className={styles.item}>
      <div className={styles.itemContent} style={{ flex: 1 }}>
        {!isEditing && (
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            className={styles.checkbox}
          />
        )}

        {isEditing ? (
          <input
            className={styles.input}
            style={{ padding: '6px 10px', fontSize: '0.9rem', width: '100%' }}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={() => saveEdit(todo.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit(todo.id);
              if (e.key === 'Escape') cancelEditing();
            }}
            autoFocus
          />
        ) : (
          <span
            className={todo.completed ? styles.completed : ''}
            onClick={() => toggleTodo(todo.id)}
            style={{ cursor: 'pointer' }}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div style={{ marginLeft: '12px' }}>
        {isEditing ? (
          <button
            onClick={() => saveEdit(todo.id)}
            className={styles.filterBtn}
            style={{ color: '#0284c7' }}
          >
            Save
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => startEditing(todo)}
              className={styles.filterBtn}
              style={{ color: '#0284c7' }}
            >
              Edit
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

```

---

### 3. Clean Root Component (`App.tsx`)

Because state and handlers are encapsulated in the Context and consumed directly by the sub-components, `App.tsx` becomes a purely declarative layout tree:

```tsx
// src/App.tsx
import React from 'react';
import { TodoProvider } from './TodoContext';
import { Card, InputForm, FilterBar, TodoList } from './components';
import styles from './TodoApp.module.css';

export function App() {
  return (
    <TodoProvider>
      <div className={styles.container}>
        <Card>
          <Card.Header>
            <Card.Title>Task Manager (React Context)</Card.Title>
          </Card.Header>

          <Card.Body>
            <InputForm />
            <FilterBar />
            <TodoList />
          </Card.Body>

          <Card.Footer />
        </Card>
      </div>
    </TodoProvider>
  );
}

export default App;

```

---

### Key Improvements Over Prop Passing

1. **Zero Prop Drilling:** Neither `App.tsx` nor intermediate wrapper components need to hold handlers or pass props down.
2. **Simplified Call Sites:** `InputForm`, `FilterBar`, and `TodoList` require no arguments when rendered inside `App.tsx`.
3. **Encapsulated Business Logic:** All mutation logic (`addTodo`, `saveEdit`, `toggleTodo`) lives inside `TodoContext.tsx`, separating state management from UI layout code.
