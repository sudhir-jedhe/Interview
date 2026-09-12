Supporting dark mode or multiple themes cleanly requires decoupling the theme tokens from the component render cycle using **CSS Custom Properties (Variables)**, managing the active preference (including OS-level sync and persistence), and preventing the notorious "Flash of Unstyled Content" (FOUC).

---

### 1. Token Architecture (CSS Custom Properties)

Define design tokens at the root level using semantic naming rather than color-specific names (e.g., use `--bg-primary` instead of `--white` or `--black`). Group themes using data attributes.

```css
/* styles/tokens.css */
:root,
[data-theme="light"] {
  --bg-app: #ffffff;
  --bg-surface: #f8fafc;
  --border-subtle: #e2e8f0;
  --text-primary: #0f172a;
  --text-muted: #64748b;
  --accent: #2563eb;
}

[data-theme="dark"] {
  --bg-app: #090d16;
  --bg-surface: #131b2e;
  --border-subtle: #1e293b;
  --text-primary: #f8fafc;
  --text-muted: #94a3b8;
  --accent: #3b82f6;
}

/* Custom alternate themes */
[data-theme="nord"] {
  --bg-app: #2e3440;
  --bg-surface: #3b4252;
  --border-subtle: #434c5e;
  --text-primary: #eceff4;
  --text-muted: #d8dee9;
  --accent: #88c0d0;
}

/* Base application styling */
body {
  background-color: var(--bg-app);
  color: var(--text-primary);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
}

```

* **Tailwind CSS Integration:** If using Tailwind, configure color aliases to reference these CSS variables directly (e.g., `backgroundColor: { app: 'var(--bg-app)' }`) or enable class/attribute-based dark mode (`darkMode: ['selector', '[data-theme="dark"]']`).

---

### 2. Preventing FOUC (Blocking Script in `index.html`)

When themes are stored in `localStorage`, waiting for React to mount before applying the theme causes a brief flash of the light theme on reload. Place a lightweight, blocking inline script inside `<head>` before any body content renders:

```html
<!-- public/index.html -->
<head>
  <script>
    (function () {
      try {
        const savedTheme = localStorage.getItem('app-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  </script>
</head>

```

---

### 3. Theme Provider with System Preference Sync

Create a React context to handle:

* Setting explicit theme overrides (`light`, `dark`, `nord`, etc.).
* Supporting a `"system"` mode that listens to OS-level preference changes (`prefers-color-scheme`).
* Syncing active choices to `localStorage`.

```jsx
// ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  availableThemes: [],
});

const THEMES = ['light', 'dark', 'nord'];

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('app-theme') || 'system';
  });

  const [systemDark, setSystemDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 1. Listen for OS theme updates in real-time
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemDark(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 2. Resolve active theme
  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return systemDark ? 'dark' : 'light';
    }
    return theme;
  }, [theme, systemDark]);

  // 3. Mutate DOM attribute without triggering React subtree re-renders for styles
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    if (newTheme === 'system') {
      localStorage.removeItem('app-theme');
    } else {
      localStorage.setItem('app-theme', newTheme);
    }
  };

  const contextValue = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    availableThemes: ['system', ...THEMES],
  }), [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

```

---

### 4. Theme Switcher UI Component

```jsx
// ThemeSelector.jsx
import React from 'react';
import { useTheme } from './ThemeContext';

export function ThemeSelector() {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div className="flex gap-2 p-2">
      {availableThemes.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          className={`px-3 py-1 rounded text-sm capitalize border ${
            theme === t ? 'border-blue-500 font-bold' : 'border-gray-300'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

```

---

### 5. Non-CSS Theming (Canvas, SVGs, Charting Libraries)

Libraries like Chart.js, Recharts, or Canvas APIs cannot consume CSS variables directly. In these scenarios, use `resolvedTheme` to pass dynamic JS values:

```jsx
import { useTheme } from './ThemeContext';

export function DashboardChart() {
  const { resolvedTheme } = useTheme();

  const gridColor = resolvedTheme === 'dark' ? '#334155' : '#e2e8f0';
  const textColor = resolvedTheme === 'dark' ? '#94a3b8' : '#64748b';

  return (
    <LineChart
      options={{
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } },
        },
      }}
    />
  );
}

```

Here is how to synthesize **User/System Preferences (`prefers-color-scheme`)**, **Storage (`localStorage`)**, **State Orchestration (Redux vs Context API)**, and **Styling Solutions (CSS Variables vs CSS-in-JS vs Tailwind)** into an enterprise-grade theming architecture.

---

### 1. The Preference Decision Hierarchy

When resolving the active theme, follow a strict resolution ladder:

$$\mathbf{User\ Manual\ Override\ (localStorage)} \succ \mathbf{OS\ Preference\ (prefers-color-scheme)} \succ \mathbf{Default\ Fallback\ (light)}$$

1. **Explicit Choice**: If the user explicitly selects "Dark" or "Nord", persist it in `localStorage` (`app-theme = 'nord'`).
2. **System Mode**: If the user selects "System" (or visits for the first time), read `window.matchMedia('(prefers-color-scheme: dark)')`.
3. **Real-time OS Changes**: If the user is on "System", attach a listener (`change` event on `matchMedia`) so toggling dark mode in macOS/Windows instantly switches the app without a reload.

---

### 2. State Strategy: Redux vs Context API

* **Context API (Recommended for pure theming):** Theming is low-frequency state. A lightweight `ThemeContext` passing only `{ theme, setTheme, resolvedTheme }` avoids bloating the global store with presentation flags.
* **Redux / Redux Toolkit:** Use RTK if the user profile or layout preferences (e.g., density, sidebar visibility, theme) are tied to synced backend user preferences or need to pass through Redux persistence/middleware pipelines:

```javascript
// uiSlice.js
const uiSlice = createSlice({
  name: 'ui',
  initialState: { themePreference: 'system' }, // 'system' | 'light' | 'dark'
  reducers: {
    setThemePreference: (state, action) => {
      state.themePreference = action.payload;
      localStorage.setItem('app-theme', action.payload);
    },
  },
});

```

---

### 3. Styling Tech Comparison: CSS Variables vs CSS-in-JS vs Tailwind

| Approach                                   | Performance Under Theme Switch                                               | Dynamic Color Scalability                                                                 | Re-render Overhead                                                                                   | Best Suited For                                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **CSS Variables (Custom Properties)**      | **Instant (Native)**: Handled directly by browser paint pipeline             | High: Swap the root attribute (`data-theme="dark"`) and all variables cascade             | **Zero re-renders**: React components don't update; elements pick up new values via CSS engine       | Modern enterprise dashboards, high-frequency UIs                     |
| **Tailwind CSS**                           | **Instant (Native)**: Compiles directly to utility classes and CSS variables | High: Pair with class/selector strategy (`darkMode: ['selector', '[data-theme="dark"]']`) | **Zero re-renders**: Only toggles root class/attribute                                               | Rapid UI building, standard React/Next.js stacks                     |
| **CSS-in-JS (Styled-Components, Emotion)** | **Slow**: Re-computes style rules and injects new `<style>` tags at runtime  | High: JavaScript-driven interpolations                                                    | **Full tree re-render**: Changes to `<ThemeProvider theme="{theme}">` force consumers to re-evaluate | Legacy apps, design systems with complex JS-only layout calculations |

> **Production Verdict:** Use **CSS Variables + Tailwind CSS** (or standard CSS modules). Avoid CSS-in-JS `ThemeProvider` wrappers for high-cardinality dashboard components to prevent main-thread lag during theme toggles.

---

### 4. End-to-End Implementation

#### Step A: Prevent FOUC in `index.html`

Before React or Redux initializes, set the attribute on `<html>` to match user or system preference:

```html
<!-- index.html -->
<head>
  <script>
    (function () {
      try {
        const stored = localStorage.getItem('app-theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const active = stored && stored !== 'system' ? stored : (systemDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', active);
      } catch (e) {}
    })();
  </script>
</head>

```

---

#### Step B: Define Semantic Design Tokens (CSS Variables)

```css
/* tokens.css */
:root, [data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-surface: #f8fafc;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
}

[data-theme="dark"] {
  --bg-primary: #090d16;
  --bg-surface: #131b2e;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border-color: #1e293b;
}

/* Custom extra theme */
[data-theme="nord"] {
  --bg-primary: #2e3440;
  --bg-surface: #3b4252;
  --text-main: #eceff4;
  --text-muted: #d8dee9;
  --border-color: #434c5e;
}

```

---

#### Step C: Configure Tailwind CSS to Use CSS Tokens

```javascript
// tailwind.config.js
module.exports = {
  // Use data-theme attribute selector rather than .dark class
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        app: {
          DEFAULT: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
        },
        content: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
        },
        border: 'var(--border-color)',
      },
    },
  },
};

```

---

#### Step D: The React Theme Hook & Sync Engine

```jsx
// useThemeSync.js
import { useEffect, useState } from 'react';

export function useThemeSync() {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('app-theme') || 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Track real-time OS preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateHandler = (e) => setSystemIsDark(e.matches);

    mediaQuery.addEventListener('change', updateHandler);
    return () => mediaQuery.removeEventListener('change', updateHandler);
  }, []);

  // Compute active appearance
  const resolvedTheme = themeMode === 'system' 
    ? (systemIsDark ? 'dark' : 'light') 
    : themeMode;

  // Apply to DOM without re-rendering presentation components
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const changeTheme = (mode) => {
    setThemeMode(mode);
    if (mode === 'system') {
      localStorage.removeItem('app-theme');
    } else {
      localStorage.setItem('app-theme', mode);
    }
  };

  return { themeMode, resolvedTheme, changeTheme };
}

```

---

### Why this architecture scales

* **Zero Frame Drops**: Mutating `data-theme` lets the browser recalculate CSS rules natively in C++, bypassing JavaScript reconciliation and React VDOM diffing.
* **Instant Start**: The inline `<script>` eliminates flash-of-white screens during SSR or client hydration.
* **Flexibility**: Works identically across raw CSS, Tailwind utilities (`bg-app text-content-main`), or external UI component kits.
