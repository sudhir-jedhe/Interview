When a parent component updates in React, all of its child components automatically re-render by default. To prevent child components from re-rendering unnecessarily—especially when their props haven't changed—you can apply a combination of **memoization**, **proper prop stabilization**, and **architectural refactoring**.

Here is a step-by-step breakdown of how to prevent unnecessary re-renders.

---

### 1. Wrap the Child Component with `React.memo`

`React.memo` is a Higher-Order Component (HOC) that memoizes the child component. React will skip rendering the child if its incoming `props` are shallowly equal to the previous render's props.

```jsx
import React from 'react';

// Child only re-renders if 'title' or 'count' actually changes
const ChildComponent = React.memo(({ title, count }) => {
  console.log('Child Rendered');
  return <div>{title}: {count}</div>;
});

export default ChildComponent;

```

---

### 2. Stabilize Function Props with `useCallback`

If you pass a function from the parent to a `React.memo`-wrapped child, passing an inline function creates a new function reference on every parent render. This breaks `React.memo` shallow equality checking.

Wrap handler functions in `useCallback` to preserve their memory reference:

#### ❌ Before (Breaks `React.memo`)

```jsx
function Parent() {
  const [parentState, setParentState] = useState(0);

  // New function instance created on EVERY render!
  const handleClick = () => console.log('Clicked');

  return (
    <div>
      <button onClick={() => setParentState(prev => prev + 1)}>Update Parent</button>
      <ChildComponent onClick={handleClick} /> {/* Re-renders every time! */}
    </div>
  );
}

```

#### ✅ After (Fixed with `useCallback`)

```jsx
function Parent() {
  const [parentState, setParentState] = useState(0);

  // Reference stays stable across parent renders
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return (
    <div>
      <button onClick={() => setParentState(prev => prev + 1)}>Update Parent</button>
      <ChildComponent onClick={handleClick} /> {/* Will NOT re-render! */}
    </div>
  );
}

```

---

### 3. Stabilize Object & Array Props with `useMemo`

Passing literal objects or arrays directly as props (e.g., `style={{ color: 'red' }}` or `user={{ id: 1 }}`) creates a new object reference on every render.

Wrap complex data structures in `useMemo`:

```jsx
function Parent() {
  const [parentState, setParentState] = useState(0);

  // Keeps object reference identical unless 'user.id' changes
  const userData = useMemo(() => ({ name: 'Alex', role: 'Admin' }), []);

  return <ChildComponent user={userData} />;
}

```

---

### 4. Move State Down (Component Splitting)

Often, state belongs to a tiny sub-part of the UI, but it's defined in a high-level parent component. Moving the state down to a dedicated sub-component avoids parent re-renders entirely.

#### ❌ Bad (Typing in input re-renders `<HeavyChild/>`)

```jsx
function Parent() {
  const [text, setText] = useState(''); // State at parent level

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <HeavyChild /> {/* Re-renders on every single keystroke! */}
    </div>
  );
}

```

#### ✅ Good (State isolated to `FormInput`)

```jsx
function FormInput() {
  const [text, setText] = useState('');
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}

function Parent() {
  return (
    <div>
      <FormInput />
      <HeavyChild /> {/* Completely unaffected when typing! */}
    </div>
  );
}

```

---

### 5. Component Composition (`children` Prop)

If a parent component manages frequent state changes (e.g., scroll position, mouse movement, or animations), pass non-state-dependent children using the `children` prop. React knows that `children` created in the outer scope have not changed.

```jsx
function ScrollWrapper({ children }) {
  const [scrollTop, setScrollTop] = useState(0);

  return (
    <div onScroll={(e) => setScrollTop(e.target.scrollTop)}>
      {/* 'children' was instantiated outside and will NOT re-render on scroll */}
      {children}
    </div>
  );
}

// Usage in App:
function App() {
  return (
    <ScrollWrapper>
      <HeavyChild /> {/* Stays untouched when ScrollWrapper updates state */}
    </ScrollWrapper>
  );
}

```

---

### Summary Checklist

| Strategy                      | Action                                      |
| ----------------------------- | ------------------------------------------- |
| **Child Component**           | Wrap with `React.memo(Child)`               |
| **Function Props**            | Wrap handler functions with `useCallback()` |
| **Object/Array Props**        | Wrap objects/arrays with `useMemo()`        |
| **Local State (e.g. inputs)** | Push state down into smaller sub-components |
| **Layout/Scroll State**       | Use component composition via `children`    |
