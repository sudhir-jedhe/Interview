# Output-Based Questions

### 1. What renders when the button is clicked?
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? <p>Fallback</p> : this.props.children;
  }
}
function Buggy() {
  function handleClick() {
    throw new Error('boom');
  }
  return <button onClick={handleClick}>Click</button>;
}
function App() {
  return (
    <ErrorBoundary>
      <Buggy />
    </ErrorBoundary>
  );
}
```
**Answer:** The error is thrown as an uncaught exception in the console (crashing that event handler's execution); the boundary's fallback UI does **not** appear, and the button remains rendered as-is.

**Why:** Error boundaries only catch errors thrown during React's render/commit/lifecycle phases. An error thrown inside an event handler happens outside that call stack — it's a plain synchronous JS exception in the handler's own execution context, invisible to `getDerivedStateFromError`/`componentDidCatch`.

---

### 2. What renders after 2 seconds?
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? <p>Fallback</p> : this.props.children;
  }
}
function Delayed() {
  useEffect(() => {
    setTimeout(() => {
      throw new Error('async boom');
    }, 2000);
  }, []);
  return <p>Loaded</p>;
}
function App() {
  return (
    <ErrorBoundary>
      <Delayed />
    </ErrorBoundary>
  );
}
```
**Answer:** `<p>Loaded</p>` stays on screen; the thrown error appears as an unhandled exception in the console, and the fallback UI never shows.

**Why:** `setTimeout`'s callback runs outside React's render call stack entirely — by the time it executes, React has already finished rendering and moved on, so there's no render/commit context for the boundary to intercept. Async errors must be caught manually (e.g., `try/catch` inside the timeout callback, then call `setState` to surface an error in your own UI).

---

### 3. What happens if `FallbackUI` itself throws?
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <FallbackUI />;
    return this.props.children;
  }
}
function FallbackUI() {
  const config = null;
  return <p>{config.message}</p>; // throws
}
function App() {
  return (
    <ErrorBoundary>
      <Buggy />
    </ErrorBoundary>
  );
}
```
**Answer:** The app crashes with no fallback shown at all (assuming no boundary wraps `<App>` itself) — React unmounts the whole tree.

**Why:** An error boundary cannot catch an error thrown by itself (including its own fallback render path). Catching that requires a *separate, parent* boundary above this one. This is why fallback components should be kept extremely simple and defensive — ideally with no dependency on the same data/context that might have caused the original crash.

---

### 4. Which console logs appear, and in what order, when `Buggy` throws during render?
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    console.log('getDerivedStateFromError');
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.log('componentDidCatch');
  }
  render() {
    console.log('ErrorBoundary render, hasError =', this.state.hasError);
    return this.state.hasError ? <p>Fallback</p> : this.props.children;
  }
}
function Buggy() {
  console.log('Buggy render');
  throw new Error('boom');
}
```
**Answer:** `"ErrorBoundary render, hasError = false"`, `"Buggy render"`, `"getDerivedStateFromError"`, `"ErrorBoundary render, hasError = true"`, `"componentDidCatch"`.

**Why:** React first renders normally until `Buggy` throws. `getDerivedStateFromError` (a static, render-phase method) runs first to compute the new state, causing `ErrorBoundary` to re-render with the fallback. Only after the fallback has been committed does `componentDidCatch` (a commit-phase method, safe for side effects like logging) run.

---

### 5. What shows on screen after `SearchResults` throws?
```jsx
function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary fallback={<p>Results unavailable</p>}>
        <SearchResults />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
```
**Answer:** `Header`, the text "Results unavailable", and `Footer` all render normally — only `SearchResults` is replaced.

**Why:** The boundary is scoped to just `SearchResults`; siblings outside the boundary (`Header`, `Footer`) are unaffected because the error and the resulting unmount/fallback substitution only apply to the subtree rendered *inside* the boundary that caught it. This is the argument for per-section granularity.

---

### 6. Does wrapping `Buggy` in `React.memo` change whether the error boundary catches its render error?
```jsx
const Buggy = React.memo(function Buggy({ data }) {
  return <p>{data.value}</p>; // throws if data is undefined
});
function App() {
  return (
    <ErrorBoundary>
      <Buggy data={undefined} />
    </ErrorBoundary>
  );
}
```
**Answer:** No — the fallback UI still shows correctly.

**Why:** `React.memo` only affects whether a component re-renders given the same props; it doesn't change how errors thrown during that render are propagated. The error still occurs during React's render phase inside the boundary's subtree, so it's caught exactly the same way as an unmemoized component.

---

### 7. A `try/catch` is added inside the component body, wrapping the JSX return. Does this change anything?
```jsx
function Buggy({ data }) {
  try {
    return <p>{data.value}</p>;
  } catch (err) {
    console.log('caught locally');
    return <p>fallback text</p>;
  }
}
```
**Answer:** This actually works and prevents the error boundary from ever seeing an error — `"caught locally"` logs, and `<p>fallback text</p>` renders.

**Why:** JSX (`<p>{data.value}</p>`) compiles to a plain `React.createElement(...)` call executed synchronously within the function body, so a `try/catch` wrapped around the `return` statement *does* catch a `TypeError` thrown while evaluating `data.value`, just like any other synchronous JS error. This is a legitimate (if unusual) way to handle expected, localized render errors without needing a boundary — though for genuinely unexpected errors, a boundary further up is still the more robust safety net since you can't wrap every component in local try/catch.
