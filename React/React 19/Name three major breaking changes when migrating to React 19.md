When migrating an application to **React 19**, several legacy APIs, patterns, and type definitions that were previously deprecated in React 18 (or earlier) have been officially removed or changed.

Here are the major breaking changes you need to address during migration:

---

### 1. Removal of Legacy Rendering APIs (`ReactDOM.render` & `ReactDOM.hydrate`)

The traditional root rendering methods from `react-dom` have been completely removed in favor of the Concurrent Root APIs introduced in React 18.

* **Removed:** `ReactDOM.render` and `ReactDOM.hydrate`.
* **Replacement:** Use `createRoot` and `hydrateRoot` from `react-dom/client`.

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

### 2. Removal of `unmountComponentAtNode`

`ReactDOM.unmountComponentAtNode` has been removed.

* **Replacement:** Call `.unmount()` on the root instance created by `createRoot`:

```tsx
// ❌ Removed
ReactDOM.unmountComponentAtNode(container);

// ✅ React 19
const root = createRoot(container);
root.unmount();

```

---

### 3. Deprecation of `forwardRef`

Function components can now receive `ref` directly as a standard prop. `forwardRef` is deprecated and will be removed in a future major release.

* **Change:** Access `ref` directly in component arguments without wrapping in `forwardRef`.

```tsx
// ❌ Old Way
const CustomInput = forwardRef((props, ref) => <input ref={ref} {...props} />);

// ✅ React 19
function CustomInput({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}

```

---

### 4. Cleanup Functions Required in Callback Refs

In React 19, ref callbacks can return a **cleanup function** (similar to `useEffect`). Because returning anything else triggers a type or runtime issue, **implicit arrow function returns in callback refs will throw errors**.

```tsx
// ❌ Broken in React 19 (Implicit return of the node instance)
<div ref={(node) => (instanceRef.current = node)} />

// ✅ Fixed: Use block body `{}` so nothing is returned
<div ref={(node) => { instanceRef.current = node; }} />

// ✅ New Feature: Explicit cleanup function
<input
  ref={(node) => {
    // Setup
    return () => {
      // Cleanup when node unmounts
    };
  }}
/>

```

---

### 5. Simplified Context Provider Syntax (`<Context>` instead of `<Context.Provider>`)

You no longer need to use `.Provider` on Context objects. You can render `<Context>` directly as a provider.

* **Change:** `<MyContext.Provider value="{val}">` can be replaced with `<MyContext value="{val}">`.

```tsx
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

### 6. Removal of Legacy Class Component Context APIs

The legacy Context APIs for class components (`childContextTypes` and `contextTypes`) have been completely removed.

* **Replacement:** Migrate to `static contextType` in class components or convert components to functional components using `useContext` or the `use()` API.

---

### 7. TypeScript (`@types/react` v19) Breaking Changes

If you use TypeScript, `@types/react` 19 includes significant cleanup:

* **`React.FC` / `React.FunctionComponent`:** No longer implicitly includes the `children` prop. You must explicitly declare `children` in your props interface.

```tsx
interface Props {
  children?: React.ReactNode;
}

```

* **`useRef` Initial Values:** Calling `useRef()` without arguments no longer defaults to `undefined`. You must pass an explicit initial value like `useRef(null)` or `useRef<T>()`.
* **Removal of `React.ElementRef`:** Replaced by `React.ComponentPropsWithRef` or native element type lookups.

---

### 8. Async Ref Errors & Error Boundary Changes

* Errors thrown during render or during state updates in transitions will now be reported to the nearest Error Boundary or unhandled error listeners.
* In React 19, if an error is caught by an Error Boundary, React no longer logs duplicate error messages to `console.error` during development for errors it recovered from.

---

### Summary Checklist for Migration

1. Run the official codemod: `npx codemod@latest react/19/migration-recipe`.
2. Ensure no legacy `ReactDOM.render` calls exist.
3. Replace `<Context.Provider>` with `<Context>`.
4. Fix callback refs returning implicit values.
5. Update `@types/react` to `^19` and fix explicit `children` and `useRef(null)` typings.
