Upgrading an application to React 19 involves both updating package dependencies and addressing several breaking changes where older patterns and APIs have been formally deprecated or removed.

---

## 1. Upgrade Steps

### Step 1: Install React 19 Dependencies

Update core React dependencies and types to version 19:

```bash
# npm
npm install react@^19 react-dom@^19
npm install -D @types/react@^19 @types/react-dom@^19

# pnpm
pnpm add react@^19 react-dom@^19
pnpm add -D @types/react@^19 @types/react-dom@^19

```

---

### Step 2: Run the Official Codemod Tool

React provides an official codemod suite (`@react-codemod/react-19`) to automatically update deprecated patterns across your codebase:

```bash
npx codemod@latest react/19/migration-recipe

```

This codemod automatically handles common updates such as:

* Replacing `forwardRef` usage with direct `ref` props.
* Removing `useFormStatus` or `useFormState` imports from `react-dom` and updating them to React 19 standards.
* Updating `<Context.Provider>` to `<Context>`.

---

## 2. Major Breaking Changes & Refactoring

### A. Removal of `ReactDOM.render` and `ReactDOM.hydrate`

The legacy `ReactDOM.render` and `ReactDOM.hydrate` methods (deprecated in React 18) are completely removed in React 19.

* **Fix:** Use `createRoot` and `hydrateRoot` from `react-dom/client`:

```tsx
// ❌ Removed in React 19
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// ✅ React 19
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root')!);
root.render(<App />);

```

---

### B. Deprecation of `forwardRef`

Functional components can now receive `ref` as a standard prop. `forwardRef` is no longer needed and will be deprecated in future versions.

* **Fix:** Access `ref` directly from props:

```tsx
// ❌ Old Way (forwardRef)
import React, { forwardRef } from 'react';
const CustomInput = forwardRef((props, ref) => <input ref={ref} {...props} />);

// ✅ React 19
function CustomInput({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}

```

---

### C. Context Providers Simplified (`<Context>` instead of `<Context.Provider>`)

Rendering `<Context.Provider>` is no longer required. You can render `<Context value="{...}">` directly.

* **Fix:** Simplify Provider syntax:

```tsx
const ThemeContext = React.createContext('light');

// ❌ Old Way
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// ✅ React 19
<ThemeContext value="dark">
  <App />
</ThemeContext>

```

---

### D. Cleanup Functions for Ref Callbacks

In React 19, ref callback functions can return a **cleanup function** (similar to `useEffect`).

Because ref callbacks can now return a cleanup function, **returning anything else (like an implicit arrow function value) will throw an error**.

```tsx
// ❌ Broken in React 19 (Implicit return of element instance)
<div ref={(node) => (instanceRef.current = node)} />

// ✅ Fix: Use curly braces to ensure no return value
<div ref={(node) => { instanceRef.current = node; }} />

// ✅ React 19 Cleanups (New Feature)
<input
  ref={(node) => {
    const observer = new ResizeObserver(...);
    if (node) observer.observe(node);

    return () => observer.disconnect(); // Runs when element unmounts!
  }}
/>

```

---

### E. Removal of Legacy Context (`childContextTypes` / `contextTypes`)

The legacy class component context API using `childContextTypes` and `contextTypes` has been completely removed.

* **Fix:** Migrate remaining class components to functional components using `useContext` or the modern `static contextType` API on classes.

---

### F. TypeScript Type Definition Breaking Changes

If your project uses TypeScript, `@types/react@19` introduces strict type cleanups:

1. **`React.FC` / `React.FunctionComponent` changes:** `React.FC` no longer implicitly includes `children`. You must explicitly define `children` in your props interface:

```tsx
interface Props {
  children?: React.ReactNode;
}

```

1. **`React.ElementRef` replaced:** Use the native `ComponentPropsWithRef` or `React.ComponentProps` utilities instead.
2. **`useRef` initial values:** Calling `useRef()` without arguments no longer defaults to `undefined`. In TypeScript 19, you must explicitly pass `useRef(null)` or `useRef<T>()`.

---

## 3. Checklist for Upgrading

1. **Run Tests:** Ensure your unit and integration tests run in React 18 with zero deprecation warnings before upgrading.
2. **Upgrade Third-Party UI Libraries:** Check that key UI libraries (e.g., MUI, Chakra UI, Radix UI) support React 19 peer dependencies.
3. **Execute Codemod:** Run `npx codemod@latest react/19/migration-recipe`.
4. **Update TypeScript Types:** Install `@types/react@^19` and fix strict `useRef` or `children` type errors.
5. **Test Forms & Server Interactions:** Verify form components and async handlers execute properly under React 19's new Action lifecycle.
