**`lazy`** is a React function that lets you defer loading a component’s JavaScript code until it is rendered for the first time.

Combined with `<Suspense>`, `lazy` is the primary mechanism for **code-splitting** in React. Instead of bundling your entire application into one massive JavaScript file that the user has to download upfront, `lazy` splits your code into smaller chunks, downloading them only when the user navigates to that specific part of the app.

---

## 1. Reference

### `const SomeComponent = lazy(load)`

* **`load`**: A function that returns a `Promise` (or another thenable). This promise must resolve to a module containing a React component as its **default export** (e.g., `import('./MyComponent')`).
* **Returns:** A React component that you can render in your JSX. If the component's code hasn't loaded yet, rendering it will cause it to **suspend**, displaying the nearest `<Suspense>` fallback.

---

## 2. Usage Scenarios

### Lazy-loading components with Suspense

To use a lazy component, you **must** wrap it (or a parent component) in a `<Suspense>` boundary. If you render a lazy component without a Suspense boundary, React will throw an error.

```jsx
import { lazy, Suspense } from 'react';

// 1. Define the lazy component outside your render function
const MarkdownPreviewer = lazy(() => import('./MarkdownPreviewer'));

function EditorPage() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPreview(!showPreview)}>Toggle Preview</button>
      
      {showPreview && (
        // 2. Wrap it in Suspense to show a fallback while the chunk downloads
        <Suspense fallback={<p>Loading previewer...</p>}>
          <MarkdownPreviewer />
        </Suspense>
      )}
    </div>
  );
}

```

---

## 3. Troubleshooting

### My lazy component’s state gets reset unexpectedly

* **Cause:** You declared the `lazy()` call **inside** the body of another component function.

```jsx
// ❌ BAD: Re-creates the lazy component on EVERY render
function Parent() {
  const DynamicComponent = lazy(() => import('./Component')); 
  return <DynamicComponent />;
}

```

When you define a lazy component inside a render function, React treats it as a brand-new component on every render cycle. This causes React to unmount the old instance and mount a fresh one, completely wiping out its internal state and triggering the network request repeatedly.

* **Fix:** Always define your `lazy()` components **at the top level of your file**, outside of any component function (just like you would with normal imports).

```jsx
// ✅ GOOD: Defined once at module scope
const DynamicComponent = lazy(() => import('./Component'));

function Parent() {
  return <DynamicComponent />;
}

```
