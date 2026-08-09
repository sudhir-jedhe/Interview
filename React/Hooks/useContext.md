It looks like you might have typed a typo for **`useContext`**.

**`useContext`** is a built-in React Hook that lets you read and subscribe to a **React Context** directly inside a functional component without wrapping components in nested `<Context.Consumer>` tags.

---

## Quick Example

### 1. Create a Context

```tsx
import { createContext } from 'react';

// Define the context with a default value
export const ThemeContext = createContext<'light' | 'dark'>('light');

```

### 2. Provide the Context

Wrap your parent components with the Provider and pass the current value:

```tsx
import { useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { ChildComponent } from './ChildComponent';

export function ParentApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <ThemeContext.Provider value={theme}>
      <ChildComponent />
    </ThemeContext.Provider>
  );
}

```

### 3. Consume with `useContext`

In any nested child component, use `useContext` to read the value directly:

```tsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function ChildComponent() {
  // Read the value directly from ThemeContext
  const theme = useContext(ThemeContext);

  return (
    <div style={{ background: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>
      Current Theme: {theme}
    </div>
  );
}

```

---

## Key Points to Remember

1. **Re-renders:** Whenever the value passed to `<Context.Provider value="{...}">` changes, every component calling `useContext(Context)` for that context will re-render.
2. **Prop Drilling Solution:** It avoids having to manually pass props down through intermediate components that don't need them.
3. **Location Requirement:** The `useContext()` call must be inside a child component *nested within* the `<Context.Provider>`. If there is no matching Provider above it, `useContext` returns the default value passed into `createContext(defaultValue)`.
