**Styled Components** is a popular CSS-in-JS library for React that allows you to write actual CSS code inside your JavaScript files using tagged template literals.

---

## 1. Installation

```bash
npm install styled-components
# or
yarn add styled-components

```

If using TypeScript, install the types as well:

```bash
npm install --save-dev @types/styled-components

```

---

## 2. Core Features & Usage Patterns

### Basic Usage

Define components by attaching styled CSS template literals to HTML tags or existing components:

```tsx
import styled from 'styled-components';

// Creates an HTML <button> with attached styles
const PrimaryButton = styled.button`
  background-color: #4f46e5;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4338ca;
  }
`;

export function App() {
  return <PrimaryButton>Click Me</PrimaryButton>;
}

```

---

### Dynamic Styling with Props

Pass props to styled components to alter styles dynamically:

```tsx
interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger';
  $fullWidth?: boolean;
}

// Prefixing transient props with '$' prevents them from leaking into the DOM element
const Button = styled.button<ButtonProps>`
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};

  background-color: ${(props) => {
    switch (props.$variant) {
      case 'danger': return '#ef4444';
      case 'secondary': return '#6b7280';
      default: return '#3b82f6';
    }
  }};

  color: white;
`;

// Usage:
// <Button $variant="danger" $fullWidth>Delete Account</Button>

```

---

### Extending Styles

Inherit styles from an existing component using `styled(Component)`:

```tsx
const BaseButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
`;

// Inherits BaseButton styles and overrides/adds new rules
const OutlineButton = styled(BaseButton)`
  background: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;

  &:hover {
    background: #eff6ff;
  }
`;

```

---

### Global Themes with `ThemeProvider`

Enables central design token management across your entire component tree:

```tsx
import { ThemeProvider, createGlobalStyle } from 'styled-components';

// 1. Define theme tokens
const theme = {
  colors: {
    primary: '#0284c7',
    background: '#f8fafc',
    text: '#0f172a',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
};

// 2. Global CSS reset/styles
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-family: system-ui, sans-serif;
    margin: 0;
  }
`;

// 3. Wrap application
export function RootApp() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  );
}

```

---

## Key Benefits & Best Practices

1. **Transient Props (`$prop`):** Always prefix custom styling props with `$` (e.g., `$active`) so `styled-components` knows not to forward them down to the underlying HTML element in the DOM.
2. **Automatic Scoping:** Class names are generated uniquely per component at runtime, preventing global namespace collisions.
3. **Colocation:** Styles sit alongside the component logic, making code deletion and refactoring clean and localized.

Show how to configure TypeScript declaration merging for DefaultTheme in styled-components.

To get full autocompletion and type checking for your design tokens inside `props.theme`, you need to override `styled-components`' built-in `DefaultTheme` interface using **TypeScript declaration merging**.

---

## 1. Define Your Theme Structure

Create your theme object in a central location (e.g., `src/theme.ts`):

```typescript
// src/theme.ts
export const defaultTheme = {
  colors: {
    primary: '#4f46e5',
    secondary: '#10b981',
    background: '#f8fafc',
    text: '#0f172a',
    danger: '#ef4444',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
} as const;

// Infer the type of the theme object
export type AppTheme = typeof defaultTheme;

```

> **Note:** Using `as const` retains exact literal string types for properties, preventing TypeScript from widening values like `'#4f46e5'` into general `string` types.

---

## 2. Override `DefaultTheme` via Declaration Merging

Create a declaration file (e.g., `src/styled.d.ts`). This file extends `styled-components`' empty `DefaultTheme` interface with your custom theme type:

```typescript
// src/styled.d.ts
import 'styled-components';
import { AppTheme } from './theme';

// Extend the DefaultTheme interface with your AppTheme definition
declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}

```

---

## 3. Usage in Components

Once `styled.d.ts` is configured, TypeScript automatically types `props.theme` across all template literals:

```tsx
// src/components/Button.tsx
import styled from 'styled-components';

export const Card = styled.div`
  /* Full IntelliSense and type checking for theme props! */
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  border: 1px solid ${(props) => props.theme.colors.primary};
`;

```

---

## 4. App Setup with `ThemeProvider`

Wrap your application tree in `ThemeProvider` passing the `defaultTheme` object:

```tsx
// src/App.tsx
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './theme';
import { Card } from './components/Button';

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Card>
        <h2>Typed Theme Example</h2>
        <p>This component leverages fully typed theme tokens!</p>
      </Card>
    </ThemeProvider>
  );
}

```

---

## Common Gotchas & Troubleshooting

1. **`import 'styled-components'` is required:** Make sure your `styled.d.ts` includes `import 'styled-components';` at the top. Omitting this converts the file from a module augmentation into a local module, breaking the global type extension.
2. **`tsconfig.json` Inclusion:** Ensure your `tsconfig.json` includes the declaration file in its `include` array (standard configs like `"include": ["src/**/*"]` handle `src/styled.d.ts` automatically).

Show how to implement type-safe Light and Dark themes with styled-components and TypeScript.

To implement type-safe Light and Dark themes, you need to ensure both theme objects share the exact same structural shape so that `props.theme` type-checking remains consistent regardless of which theme is active.

---

### 1. Define the Shared Theme Structure

Create a central `theme.ts` file with an explicit TypeScript interface to guarantee that both themes have identical keys:

```typescript
// src/theme.ts
export interface Theme {
  colors: {
    background: string;
    surface: string;
    text: string;
    primary: string;
    border: string;
  };
  spacing: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    primary: '#4f46e5',
    border: '#e2e8f0',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
};

export const darkTheme: Theme = {
  colors: {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    primary: '#6366f1',
    border: '#334155',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
};

```

---

### 2. Configure Declaration Merging

Extend the global `DefaultTheme` interface with your `Theme` structure:

```typescript
// src/styled.d.ts
import 'styled-components';
import { Theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

```

---

### 3. Build a Theme Toggle Component

Create styled components that dynamically consume the active theme colors, and wire up state management to switch between them:

```tsx
// src/App.tsx
import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { lightTheme, darkTheme } from './theme';

// Global styles adapt automatically to the active theme
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-family: system-ui, sans-serif;
    margin: 0;
    transition: background-color 0.2s, color 0.2s;
  }
`;

const Container = styled.div`
  max-width: 500px;
  margin: 40px auto;
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: ${(props) => props.theme.spacing.md};

  &:hover {
    opacity: 0.9;
  }
`;

export function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Container>
        <h2>{isDarkMode ? 'Dark Mode' : 'Light Mode'} Active</h2>
        <p>This container and its typography adapt smoothly via type-safe theme tokens.</p>
        <Button onClick={() => setIsDarkMode((prev) => !prev)}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </Button>
      </Container>
    </ThemeProvider>
  );
}

```

Show how to save and load user theme preference using localStorage and match media system settings.

Here is a complete, production-ready solution that combines **system preference detection** (`window.matchMedia`), **localStorage persistence**, and **instant system theme updates** without causing flash of wrong theme (FOUC).

---

## 1. Custom Hook: `useThemeMode`

This custom hook manages the theme state, listens for OS-level theme changes, and saves user overrides to `localStorage`.

```typescript
// src/useThemeMode.ts
import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'app-theme-mode';

// Helper to get system color scheme preference
const getSystemPreference = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export function useThemeMode() {
  // 1. Initialize preference state from localStorage (or default to 'system')
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return saved && ['light', 'dark', 'system'].includes(saved) ? saved : 'system';
  });

  // 2. Track real-time system preference
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemPreference);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Listen for OS/browser theme preference changes dynamically
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 3. Setter function that persists preference to localStorage
  const updateMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    if (newMode === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, newMode);
    }
  }, []);

  // 4. Resolve the active theme ('light' or 'dark') based on state
  const activeTheme: 'light' | 'dark' = mode === 'system' ? systemTheme : mode;

  return { mode, activeTheme, setMode: updateMode };
}

```

---

## 2. Integrated App Component

Combine the hook with `styled-components` `ThemeProvider`:

```tsx
// src/App.tsx
import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { lightTheme, darkTheme } from './theme';
import { useThemeMode, ThemeMode } from './useThemeMode';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-family: system-ui, sans-serif;
    margin: 0;
    transition: background-color 0.2s, color 0.2s;
  }
`;

const Container = styled.div`
  max-width: 480px;
  margin: 40px auto;
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const OptionButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${(props) => (props.$active ? '#ffffff' : props.theme.colors.text)};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export function App() {
  const { mode, activeTheme, setMode } = useThemeMode();

  const themeObject = activeTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={themeObject}>
      <GlobalStyle />
      <Container>
        <h2>Theme Preference</h2>
        <p>Active render mode: <strong>{activeTheme.toUpperCase()}</strong></p>
        
        <ButtonGroup>
          {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
            <OptionButton
              key={m}
              $active={mode === m}
              onClick={() => setMode(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </OptionButton>
          ))}
        </ButtonGroup>
      </Container>
    </ThemeProvider>
  );
}

```

---

## Prevent Flash of Wrong Theme (FOUC) in SSR/HTML

If you use Next.js or SSR, add an inline blocking script inside `<head>` to set a background color class before React hydrates:

```html
<script>
  (function() {
    try {
      var mode = localStorage.getItem('app-theme-mode');
      var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (mode === 'dark' || (!mode && supportDarkMode)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
</script>

```

How do I optimize styled-components performance and prevent unnecessary re-renders in large React applications?

Optimizing `styled-components` in large applications comes down to two main goals: **reducing runtime CSS generation overhead** and **preventing unnecessary component re-renders**. Because `styled-components` parses CSS and injects style tags into the DOM dynamically at runtime, unoptimized usage can cause significant main-thread lag.

---

## 1. Avoid Defining Styled Components Inside Render Functions

Defining a styled component inside a React component's body creates a brand-new component reference on **every single render**. This forces React to unmount and remount the DOM node every time, destroying state and causing severe performance bottlenecks.

```tsx
// ❌ BAD: Re-created on every render
function UserList({ users }) {
  const Item = styled.li`
    padding: 8px;
  `;
  return <ul>{users.map(u => <Item key={u.id}>{u.name}</Item>)}</ul>;
}

// ✅ GOOD: Defined outside render or imported
const Item = styled.li`
  padding: 8px;
`;

function UserList({ users }) {
  return <ul>{users.map(u => <Item key={u.id}>{u.name}</Item>)}</ul>;
}

```

---

## 2. Separate Dynamic Inline Styles from Static Component Styles

If a style property changes rapidly (e.g., scroll positions, mouse cursor tracking, or drag coordinates), passing that rapidly changing value as a prop to a styled component forces `styled-components` to generate, hash, and inject a new CSS rule into the `<head>` on every frame.

Instead, delegate high-frequency dynamic values to inline `style` attributes or `.attrs()`:

```tsx
// ❌ BAD: Injects hundreds of CSS class rules per second into the DOM
const Box = styled.div<{ $x: number; $y: number }>`
  transform: translate(${(props) => props.$x}px, ${(props) => props.$y}px);
`;

// ✅ GOOD: Uses .attrs() to bind high-frequency values to inline styles
const FastBox = styled.div.attrs<{ $x: number; $y: number }>((props) => ({
  style: {
    transform: `translate(${props.$x}px, ${props.$y}px)`,
  },
}))<{ $x: number; $y: number }>`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: blue;
`;

```

---

## 3. Leverage the `styled-components` Babel / SWC Plugin

In large production bundles, enable the official SWC or Babel plugin. It optimizes styled-components through:

* **Dead code elimination** and minification of template literals.
* **Component display names** in development and stable class generation in production.
* **Pre-processing static styles** into faster string definitions.

If using Next.js or Vite, enable compiler options in your config:

```javascript
// next.config.js
module.exports = {
  compiler: {
    styledComponents: true,
  },
};

```

---

## 4. Use Transient Props (`$prop`) to Prevent DOM Pollution

When custom props are passed to styled components, `styled-components` checks if they are valid HTML attributes. If you don't prefix them with `$`, non-standard attributes can be passed to native HTML elements, triggering unnecessary React DOM warnings and extra attribute updates.

```tsx
// ❌ BAD: 'isactive' gets forwarded to the HTML element
const NavItem = styled.a<{ isactive: boolean }>`
  color: ${(props) => (props.isactive ? 'blue' : 'black')};
`;

// ✅ GOOD: '$isactive' is filtered out and never touches the DOM
const NavItem = styled.a<{ $isactive: boolean }>`
  color: ${(props) => (props.$isactive ? 'blue' : 'black')};
`;

```

---

## 5. Prevent Re-renders with CSS Custom Properties (CSS Variables)

Instead of passing theme or state props deep down into dozens of styled components—which causes `styled-components` to evaluate template functions across the entire sub-tree—pass CSS custom properties once at a parent wrapper or use global root variables.

```tsx
// ❌ BAD: Every child re-evaluates JS style functions when $status changes
const StatusBadge = styled.span<{ $status: string }>`
  color: ${props => props.$status === 'active' ? 'green' : 'red'};
`;

// ✅ GOOD: Update a single CSS variable on the parent; children use native CSS
const StatusContainer = styled.div<{ $color: string }>`
  --status-color: ${props => props.$color};
`;

const StatusBadge = styled.span`
  color: var(--status-color);
`;

```

---

## 6. Memoize Components or Theme Objects

When using `ThemeProvider`, ensure the `theme` object passed as a prop maintains a stable reference. Passing an inline object literal creates a new reference on every render, causing all components reading from the theme to re-render.

```tsx
// ❌ BAD: Theme object reference changes on every App render
function App() {
  return (
    <ThemeProvider theme={{ color: 'blue' }}>
      <MainContent />
    </ThemeProvider>
  );
}

// ✅ GOOD: Stable theme object reference
const theme = { color: 'blue' };

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MainContent />
    </ThemeProvider>
  );
}

```

---

## Summary Checklist

| Optimization              | Technique                                     | Impact                                                       |
| ------------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| **Component Definition**  | Define components outside render functions.   | Prevents complete DOM destruction and remounting.            |
| **High-Frequency State**  | Use `.attrs()` for inline `style` properties. | Eliminates tag injection overhead during animations/scrolls. |
| **Compiler Optimization** | Enable SWC / Babel `styledComponents` plugin. | Reduces bundle size and pre-minifies CSS literals.           |
| **Theme Management**      | Memoize `theme` objects or use CSS variables. | Stops unnecessary tree-wide re-evaluations.                  |
| **DOM Cleanliness**       | Prefix transient props with `$`.              | Prevents invalid DOM attribute warnings and re-renders.      |

Compare runtime CSS-in-JS libraries like styled-components with zero-runtime CSS-in-JS tools like Vanilla Extract or Pigment CSS.

The key distinction between **runtime CSS-in-JS** (e.g., `styled-components`, `Emotion`) and **zero-runtime CSS-in-JS** (e.g., `Vanilla Extract`, `Pigment CSS`, `Linaria`, `StyleX`) comes down to **when and where the CSS is evaluated and generated**.

Here is a comprehensive breakdown of how these two paradigms compare across architecture, performance, developer experience, and ideal use cases.

---

## 1. Architectural Difference

```
Runtime CSS-in-JS (styled-components)
  JS Execution in Browser ---> Evaluates Template Literals ---> Hashes CSS
                               ---> Generates <style> Tags  ---> Injects into DOM

Zero-Runtime CSS-in-JS (Vanilla Extract / Pigment CSS)
  Build Time (Vite/Webpack) ---> Evaluates JS/TS Code      ---> Extracts Static CSS
                               ---> Emits .css Files       ---> Normal Browser Stylesheet Loading

```

* **Runtime CSS-in-JS:** The JavaScript engine processes style template literals in the user's browser, computes dynamic props, generates hashed class names, and injects `<style>` tags directly into the document head at runtime.
* **Zero-Runtime CSS-in-JS:** Styles are written in TypeScript/JavaScript, but a build tool plugin (Vite, Webpack, SWC, Next.js compiler) evaluates those styles at build time, extracts them into static `.css` files, and substitutes the styled components with standard CSS class name strings.

---

## 2. Feature Comparison Matrix

| Feature / Metric | Runtime CSS-in-JS <br>

<br>*(styled-components, Emotion)* | Zero-Runtime CSS-in-JS <br>

| <br>*(Vanilla Extract, Pigment CSS, Linaria)* |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **JS Main Thread Cost**                       | **High:** Parses, hashes, and injects CSS on render.                                                  | **Zero:** JS bundle only contains string class names.                                                 |
| **JS Bundle Size**                            | **Larger:** Requires ~12-15 KB runtime library code.                                                  | **Minimal/Zero:** No runtime library shipped to the user.                                             |
| **Dynamic Props**                             | **Native & Infinite:** Can use any arbitrary JS expression or prop directly in CSS template literals. | **Constrained:** Requires CSS custom properties (variables) or predefined variant maps (`variants`).  |
| **Build Configuration**                       | **Zero/Low:** Works out of the box in virtually any JS environment without special build setups.      | **Required:** Needs dedicated bundler plugins (Vite, Webpack, SWC, Next.js compiler).                 |
| **React Server Components (RSC)**             | **Poor/Incompatible:** Rely heavily on React Context (`ThemeProvider`) and browser APIs (`document`). | **Native:** Works seamlessly with Next.js App Router and React Server Components.                     |
| **CSS Caching**                               | **Weak:** CSS is bundled inside JS chunks; browser cannot cache styles separately from JS.            | **Excellent:** Static `.css` files can be cached, parallelized, and delivered via CDNs independently. |

---

## 3. How Dynamic Styling Differs in Code

### Runtime Approach (`styled-components`)

You can pass any arbitrary JS value directly into the CSS rule.

```tsx
// Evaluited on every render in the browser
const Card = styled.div<{ $elevation: number }>`
  background-color: white;
  box-shadow: 0px ${(props) => props.$elevation * 2}px 8px rgba(0, 0, 0, 0.1);
`;

```

### Zero-Runtime Approach (`Vanilla Extract`)

Dynamic styles are split into **static type-safe variants** or driven by **CSS custom variables**.

```typescript
// styles.css.ts (Evaluated at build time)
import { recipe } from '@vanilla-extract/recipes';
import { createVar, style } from '@vanilla-extract/css';

export const elevationVar = createVar();

export const cardStyle = style({
  backgroundColor: 'white',
  // Dynamic behavior uses CSS variables passed at runtime
  boxShadow: `0px var(${elevationVar}) 8px rgba(0, 0, 0, 0.1)`,
});

// Component usage:
export function Card({ elevation, children }) {
  return (
    <div
      className={cardStyle}
      style={{ [elevationVar]: `${elevation * 2}px` }}
    >
      {children}
    </div>
  );
}

```

---

## 4. Strengths & Trade-offs

### Runtime CSS-in-JS (`styled-components`)

* **Pros:**
* Unmatched flexibility—any JS variable, condition, or math logic can be embedded directly in CSS string literals.
* Simple setup requiring no bundler integration or complex plugin chains.
* Easy theme switching via runtime `ThemeProvider` React Context.

* **Cons:**
* Significant runtime performance overhead during component mounting and frequent re-renders.
* Completely incompatible with React Server Components (RSCs) without resorting to `'use client'` everywhere.
* Adds extra JavaScript bytes to your application bundle.

### Zero-Runtime CSS-in-JS (`Vanilla Extract`, `Pigment CSS`)

* **Pros:**
* **Near-native CSS performance:** No runtime parsing or `<style>` tag DOM injection overhead.
* **RSC Compatibility:** Ideal for modern React frameworks (Next.js App Router, Remix) because styles are extracted at build time.
* Full TypeScript type safety for theme tokens, tokens autocompletion, and static variant definitions.

* **Cons:**
* Requires explicit bundler configuration (Vite, Next.js, Webpack, etc.).
* Dynamic conditional styles require structured variant recipes or CSS variable bindings rather than arbitrary JS logic.
* Marginally longer build times due to CSS extraction preprocessing.

---

## 5. When to Choose Which?

* **Choose Zero-Runtime (`Vanilla Extract`, `Pigment CSS`) if:**
* You are building a new application with **Next.js App Router**, **React Server Components**, or **Vite**.
* Core Web Vitals (LCP, INP) and client-side rendering performance are top priorities.
* You want full TypeScript type safety for design systems without paying runtime execution costs.

* **Choose Runtime (`styled-components`, `Emotion`) if:**
* You are maintaining an existing enterprise React app (SPA/Create React App/Pages Router) already built on `styled-components`.
* Your UI relies heavily on highly dynamic, mathematical runtime styling that would require hundreds of CSS variables to express otherwise.
* You want to avoid complex bundler/compiler configurations in your build pipeline.

Here is a step-by-step setup guide for setting up **Vanilla Extract** in a **Vite + React + TypeScript** project.

---

## Step 1: Create a New Vite Project

If you don't already have an existing project, create a new Vite React TypeScript app:

```bash
npm create vite@latest my-vanilla-extract-app -- --template react-ts
cd my-vanilla-extract-app
npm install

```

---

## Step 2: Install Vanilla Extract Packages

Install the core Vanilla Extract package along with its official Vite plugin, and optionally the `@vanilla-extract/recipes` package for variant support:

```bash
npm install @vanilla-extract/css @vanilla-extract/recipes
npm install -D @vanilla-extract/vite-plugin

```

---

## Step 3: Configure Vite

Update your `vite.config.ts` to include the `vanillaExtractPlugin`. Ensure it is placed before the React plugin:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    react(),
  ],
});

```

---

## Step 4: Create Theme and Design Tokens

Vanilla Extract uses `.css.ts` or `.css.js` file extensions. Files with these extensions are processed at build time and extracted into static CSS files.

Create a `src/theme.css.ts` file to define your design system tokens:

```typescript
// src/theme.css.ts
import { createTheme } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    border: '#e2e8f0',
  },
  space: {
    none: '0px',
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
});

```

---

## Step 5: Create Component Styles and Variants

Create a button style using `style` and `recipe` (for variants) in `src/Button.css.ts`:

```typescript
// src/Button.css.ts
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from './theme.css';

// Base style rules
export const buttonRecipe = recipe({
  base: {
    fontFamily: 'system-ui, sans-serif',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    borderRadius: vars.borderRadius.medium,
  },

  variants: {
    color: {
      primary: {
        backgroundColor: vars.color.primary,
        color: '#ffffff',
        ':hover': {
          backgroundColor: vars.color.primaryHover,
        },
      },
      outline: {
        backgroundColor: 'transparent',
        border: `1px solid ${vars.color.border}`,
        color: vars.color.text,
        ':hover': {
          backgroundColor: vars.color.background,
        },
      },
    },
    size: {
      small: {
        padding: `${vars.space.small} ${vars.space.medium}`,
        fontSize: '14px',
      },
      medium: {
        padding: `${vars.space.medium} ${vars.space.large}`,
        fontSize: '16px',
      },
    },
  },

  defaultVariants: {
    color: 'primary',
    size: 'medium',
  },
});

```

---

## Step 6: Build the React Component

Create a typed React component in `src/Button.tsx`:

```tsx
// src/Button.tsx
import React from 'react';
import { buttonRecipe } from './Button.css';
import type { RecipeVariants } from '@vanilla-extract/recipes';

// Extract variant prop types automatically from the recipe
type ButtonVariants = RecipeVariants<typeof buttonRecipe>;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  children: React.ReactNode;
}

export function Button({ color, size, children, ...props }: ButtonProps) {
  return (
    <button className={buttonRecipe({ color, size })} {...props}>
      {children}
    </button>
  );
}

```

---

## Step 7: Apply Theme and Use Component in `App.tsx`

Apply the `themeClass` at your application's root (or container level) so CSS variables are accessible:

```tsx
// src/App.tsx
import { themeClass } from './theme.css';
import { Button } from './Button';

export function App() {
  return (
    <div className={themeClass} style={{ padding: '40px', minHeight: '100vh' }}>
      <h1>Vanilla Extract + Vite + React</h1>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button color="primary" size="medium">
          Primary Button
        </Button>
        <Button color="outline" size="small">
          Outline Button
        </Button>
      </div>
    </div>
  );
}

export default App;

```

---

## Step 8: Verify Build & Run

Start the development server:

```bash
npm run dev

```

To see the static CSS extraction in action, run a production build:

```bash
npm run build

```

During the build, Vite and Vanilla Extract will evaluate your `.css.ts` files and output standard `.css` stylesheets into the `dist/assets` directory with zero runtime overhead.
