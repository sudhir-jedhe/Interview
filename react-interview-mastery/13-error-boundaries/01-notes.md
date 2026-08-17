# Core Concepts

## What an error boundary is

An error boundary is a component that catches JavaScript errors thrown anywhere in its child component tree during rendering, logs them, and renders a fallback UI instead of letting the error propagate up and unmount the entire app. Without one, an uncaught render error anywhere blanks the whole page — React unmounts the entire tree by default since React 16.

## Must be a class component

Error boundaries require two APIs that only exist as class lifecycle methods — **there is no hook equivalent**, making this one of the few remaining cases where you must write a class in modern React.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // called during the "render" phase — must be pure, update state only
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // called during the "commit" phase — safe for side effects (logging)
    logErrorToService(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

`getDerivedStateFromError` is used to compute the fallback state (pure, no side effects allowed); `componentDidCatch` is used to *react* to the error — logging to Sentry/Datadog, sending analytics, etc. You typically implement both: the first for the fallback render, the second for reporting.

## What error boundaries catch

- Errors thrown during **rendering** of any component in the subtree below the boundary.
- Errors thrown in **lifecycle methods** (`componentDidMount`, `componentDidUpdate`, etc.) of descendant components.
- Errors thrown in the **constructors** of components in the tree below the boundary.

```jsx
function Buggy() {
  const data = null;
  return <p>{data.name}</p>; // throws TypeError during render — CAUGHT
}
```

## What error boundaries do NOT catch

- **Event handlers.** A `throw` inside `onClick`/`onChange`/etc. does not trigger the boundary — it's just a normal uncaught JS exception in that callback's execution context. Handle these with a regular `try/catch` inside the handler.

```jsx
function Buggy() {
  function handleClick() {
    throw new Error('oops'); // NOT caught by any error boundary
  }
  return <button onClick={handleClick}>Click</button>;
}
```

- **Asynchronous code.** Errors in `setTimeout`, promises, `async/await`, or any code that runs outside React's render call stack are not caught, because by the time the async callback runs, React is no longer "inside" the render it could attribute the error to.

```jsx
useEffect(() => {
  fetchData().catch(err => {
    // must handle manually — an error boundary will NOT catch this
    setError(err);
  });
}, []);
```

- **Server-side rendering (SSR).** Error boundaries only work in the client-rendering path; errors during SSR need separate handling (e.g., try/catch around `renderToString`/`renderToPipeableStream`).

- **Errors thrown inside the error boundary component itself.** A boundary can't catch its own errors — if `FallbackUI` itself throws, you need a *parent* boundary above it to catch that.

## Fallback UI patterns

Keep fallback UI simple and self-contained (don't rely on the same data/context that may have caused the crash). Common patterns: a static "Something went wrong" message with a reload button, a "Try again" button that resets the boundary's state, or a more specific per-section message ("Couldn't load your recent orders") that doesn't take down the whole page.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  handleReset = () => this.setState({ hasError: false });
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>Something went wrong.</p>
          <button onClick={this.handleReset}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Note "Try again" only re-renders the children — if the underlying bug is deterministic (bad data, not a transient network blip), it'll just throw again immediately, so pair it with a way to actually change the input state (e.g., navigate away, or reset a key to force remount).

## `react-error-boundary`

The community-standard library wraps the class-component boilerplate in a reusable `<ErrorBoundary>` component with a function-based `FallbackComponent`/`fallbackRender` prop and a built-in `resetErrorBoundary` callback, plus a `useErrorHandler`/`useErrorBoundary` hook for triggering the nearest boundary from event handlers or async code (by re-throwing into render on the next tick). Conceptually it's the class-component pattern above, packaged so consumers write only function components.

## Boundary granularity

A single **global** boundary at the app root is the minimum viable safety net — it prevents a full white-screen crash but takes down the entire UI for any error anywhere. **Per-section** boundaries (e.g., around a sidebar widget, a chart, a comments section) contain failures to just that section, letting the rest of the page keep working. The common approach: one global boundary as a last resort, plus targeted boundaries around independently-failable, non-critical sections (widgets, third-party embeds, optional data panels) where showing "this widget failed to load" is far better UX than losing the whole page.
