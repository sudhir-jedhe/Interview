When a theme changes in React, massive re-renders usually happen because the root theme context changes its reference, forcing every consumer component—and often entire subtrees—to run their render phase.

---

### 1. Offload Theme Values to CSS Custom Properties (Best Approach)

The most effective optimization is to decouple theme variables from the React state tree entirely. React only manages a simple attribute (like `data-theme="dark"`), and CSS handles colors, borders, and typography.

```css
/* themes.css */
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --card-bg: #f9fafb;
}

:root[data-theme="dark"] {
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
  --card-bg: #1e293b;
}

.card {
  background-color: var(--card-bg);
  color: var(--text-primary);
}

```

```jsx
// ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    // Only updates a DOM attribute; zero React components need to re-render for styling
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={toggleTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

```

* **Why it helps**: Components style themselves using `var(--text-primary)`. When the theme changes, React performs zero re-renders on presentational components; the browser restyles natively in the render pipeline.

---

### 2. Split State and Dispatch Contexts

If components must access theme settings or the toggle button directly in JavaScript, separate the active value from the update functions. This prevents components that only *trigger* theme changes from re-rendering when the theme updates.

```jsx
const ThemeValueContext = createContext();
const ThemeActionContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeActionContext.Provider value={toggleTheme}>
      <ThemeValueContext.Provider value={theme}>
        {children}
      </ThemeValueContext.Provider>
    </ThemeActionContext.Provider>
  );
}

// Components that only toggle the theme won't re-render when `theme` changes
export const useToggleTheme = () => useContext(ThemeActionContext);
export const useTheme = () => useContext(ThemeValueContext);

```

---

### 3. Isolate the Theme Provider and Pass `children`

Ensure the provider passes `children` as a prop rather than defining nested components directly within the provider’s render body.

```jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // Memoize value to avoid creating a new object on unrelated state updates
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children} {/* React skips re-rendering children if their props haven't changed */}
    </ThemeContext.Provider>
  );
}

```

* React uses reference equality for `children`. If `children` is instantiated outside `ThemeProvider` (e.g., in `App`), components that don't consume `useContext(ThemeContext)` will not re-render.

---

### 4. Use Context Selectors or External Stores

If deep components need JavaScript access to different theme tokens (e.g., charts, canvas rendering, SVG fills), standard Context forces all consumers to update. Use an external store with fine-grained subscriptions:

* **Zustand / Jotai / React 19 / `useSyncExternalStore**`:

```javascript
import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
}));

// In a component: only re-renders if specifically reading `theme`
const theme = useThemeStore((state) => state.theme);

```

---

### 5. Memoize Expensive Subtrees (`React.memo`)

For heavy data grids, lists, or static layouts that do not directly depend on theme values, wrap them with `React.memo`.

```jsx
const HeavyDataList = React.memo(function HeavyDataList({ items }) {
  return (
    <div className="heavy-list">
      {items.map(item => <Row key={item.id} data={item} />)}
    </div>
  );
});

```

* As long as `HeavyDataList` doesn't call `useTheme()` internally and relies on CSS custom properties or classes, it completely skips the re-render when the theme toggles.
