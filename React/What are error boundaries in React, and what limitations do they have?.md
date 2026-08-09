**Error Boundaries** are class-based React components that catch JavaScript runtime errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the entire application component tree.

Before Error Boundaries were introduced (in React 16), JavaScript errors inside component render methods would corrupt React’s internal state and cause the entire application to unmount (displaying a "white screen of death").

---

## How Error Boundaries Work

A class component becomes an Error Boundary if it implements either (or both) of the following lifecycle methods:

1. **`static getDerivedStateFromError(error)`**: Renders a fallback UI synchronously after an error is thrown in a descendant component.
2. **`componentDidCatch(error, errorInfo)`**: Used for logging error details to external monitoring services (like Sentry, LogRocket, or Datadog).

```tsx
import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  // 1. Update state so the next render shows the fallback UI
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // 2. Log the error to an analytics or error tracking service
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

```

### Usage Example

Wrap specific sections of your app so that an isolated component crash doesn't break the rest of the layout:

```tsx
export function App() {
  return (
    <Layout>
      {/* If Navigation crashes, Header fallback shows, but Main App still works */}
      <ErrorBoundary fallback={<div>Failed to load navigation</div>}>
        <Navigation />
      </ErrorBoundary>

      <ErrorBoundary fallback={<div>Failed to load main content</div>}>
        <MainFeed />
      </ErrorBoundary>
    </Layout>
  );
}

```

---

## Limitations of Error Boundaries

While Error Boundaries are critical for app stability, **they do not catch errors in every scenario**.

### 1. They Do Not Catch Errors in Event Handlers

Error Boundaries only catch errors thrown during rendering and lifecycle phases. Errors inside event handlers (e.g., `onClick`, `onSubmit`) happen outside the render cycle.

* **Why:** React does not need an Error Boundary to recover from event handler errors; the component tree is already rendered and stable.
* **Solution:** Use standard JavaScript `try/catch` blocks inside event handlers.

```tsx
// ❌ Error Boundary WON'T catch this:
function Button() {
  const handleClick = () => {
    throw new Error('Crash!'); // Must be caught with try/catch inside handler
  };
  return <button onClick={handleClick}>Click Me</button>;
}

```

---

### 2. They Do Not Catch Errors in Asynchronous Code

Errors occurring inside asynchronous callbacks (e.g., `setTimeout`, `requestAnimationFrame`, or raw Promises) bypass Error Boundaries.

```tsx
// ❌ Error Boundary WON'T catch this:
useEffect(() => {
  setTimeout(() => {
    throw new Error('Async crash!');
  }, 1000);
}, []);

```

> **Note on React 19:** In React 19, if an uncaught error is thrown inside a **Transition** (`startTransition`, `useActionState`), React *will* forward that rejection to the nearest Error Boundary. However, raw `setTimeout` or untracked Promises still require manual error handling.

---

### 3. They Do Not Catch Server-Side Rendering (SSR) Errors

Error Boundaries only run on the client during browser execution. They do not catch errors during server-side pre-rendering phases.

---

### 4. They Cannot Catch Errors Thrown Inside Themselves

An Error Boundary component only catches errors thrown in its **children** (descendants in the tree). It cannot catch an error thrown inside its own `render` method or lifecycle methods.

---

### 5. Must Be Class Components

As of current React versions, Error Boundaries **must be Class Components**. There is no `useErrorBoundary` functional hook equivalent built into core React, though community packages like `react-error-boundary` provide functional wrappers around class implementations under the hood.

---

## Summary Matrix

| Scenario                                    | Caught by Error Boundary? | Recommended Handling Strategy                     |
| ------------------------------------------- | ------------------------- | ------------------------------------------------- |
| **JSX Render phase errors**                 | ✅ **Yes**                 | Error Boundary fallback UI.                       |
| **Lifecycle methods (`componentDidMount`)** | ✅ **Yes**                 | Error Boundary fallback UI.                       |
| **Errors in Child Components**              | ✅ **Yes**                 | Error Boundary fallback UI.                       |
| **Event Handlers (`onClick`)**              | ❌ **No**                  | Use `try / catch` blocks.                         |
| **Async Callbacks (`setTimeout`)**          | ❌ **No**                  | Use `try / catch` or Promise `.catch()`.          |
| **React 19 Actions / Transitions**          | ✅ **Yes**                 | Error Boundary (or `useActionState` error state). |
| **Server-Side Rendering (SSR)**             | ❌ **No**                  | Server `try / catch` / HTTP error status pages.   |
