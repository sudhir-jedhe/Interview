When a **Parent Component** re-renders in React, all of its **Child Components** automatically re-render by default.

If a parent component is re-rendering unnecessarily—or causing its children to re-render due to unrelated state changes—you can optimize it using the following battle-tested patterns:

---

### 1. Wrap Child Components with `React.memo`

If a child component's props have not changed, wrapping it in `React.memo` prevents it from re-rendering when its parent updates.

```jsx
import React from 'react';

// Child only re-renders if its props ('title') change
const ChildComponent = React.memo(({ title }) => {
  console.log('Child Rendered');
  return <h3>{title}</h3>;
});

export default ChildComponent;

```

---

### 2. Preserve Function References with `useCallback`

Passing inline functions or handlers (like `onClick`) from parent to child breaks `React.memo` because JavaScript creates a new function reference on every parent render. Wrap callback functions with `useCallback`:

```jsx
import React, { useState, useCallback } from 'react';
import ChildComponent from './ChildComponent';

function ParentComponent() {
  const [count, setCount] = useState(0);

  // Memoize the function reference across renders
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // Empty dependency array means stable reference

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      
      {/* ChildComponent will NOT re-render when count updates */}
      <ChildComponent title="Dashboard" onClick={handleClick} />
    </div>
  );
}

```

---

### 3. Stabilize Objects & Arrays with `useMemo`

Passing object literals or arrays as props (e.g., `user={{ name: 'Alex' }}`) creates a new reference on every render. Wrap complex prop values in `useMemo`:

```jsx
// Keeps object reference identical in memory unless dependencies change
const userData = useMemo(() => ({ name: 'Alex', role: 'Admin' }), []);

return <ChildComponent user={userData} />;

```

---

### 4. Lift State Down (Separate Local State)

If a state variable only affects a small input or toggle UI, isolate that state into a dedicated child component instead of keeping it in the top-level parent.

#### Bad (Causes full parent tree to re-render on every keystroke)

```jsx
function Parent() {
  const [text, setText] = useState(''); // Typing here re-renders HeavyComponent!

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <HeavyComponent />
    </div>
  );
}

```

#### Good (State is isolated to `FormInput`)

```jsx
function FormInput() {
  const [text, setText] = useState('');
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}

function Parent() {
  return (
    <div>
      <FormInput />
      <HeavyComponent /> {/* Stays completely untouched during typing */}
    </div>
  );
}

```

---

### 5. Component Composition (`children` prop)

If a parent manages frequent state updates (like scroll events or mouse position), pass heavy child components as `children`. React recognizes that `children` haven't changed and skips their re-renders.

```jsx
function ScrollContainer({ children }) {
  const [scrollPos, setScrollPos] = useState(0);

  return (
    <div onScroll={(e) => setScrollPos(e.target.scrollTop)}>
      {/* 'children' will NOT re-render when scrollPos updates */}
      {children}
    </div>
  );
}

// Usage:
<ScrollContainer>
  <HeavyComponent />
</ScrollContainer>

```

---

### Summary Checklist

| Root Cause                                            | Recommended Solution                       |
| ----------------------------------------------------- | ------------------------------------------ |
| **Child re-renders despite unchanged props**          | Wrap child with `React.memo(Child)`        |
| **Function props changing reference on render**       | Wrap handler function with `useCallback()` |
| **Object/Array props changing reference**             | Wrap data object with `useMemo()`          |
| **Local state causing whole parent tree to update**   | Move state down into a smaller component   |
| **Parent layout state (e.g. scroll, mouse) updating** | Use component composition via `children`   |
