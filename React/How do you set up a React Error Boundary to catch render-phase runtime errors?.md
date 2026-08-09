React Error Boundaries act as a "catch-all" safety net for your component tree. If a child component throws a JavaScript error during rendering, lifecycle methods, or constructors, the Error Boundary catches it, logs it, and displays a graceful fallback UI instead of leaving users with a blank white screen.

Currently, there are two ways to implement Error Boundaries: the **Native Class Component Method** and the **Modern Library Method (`react-error-boundary`)**.

---

### Method 1: The Native Class Component (Standard React)

Because React does not currently have a Hook equivalent for `componentDidCatch`, native Error Boundaries **must** be written as Class Components.

#### 1. Create the Error Boundary Component (`ErrorBoundary.jsx`)

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // 1. Update state so the next render shows the fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // 2. Catch the error and log it to an error reporting service (e.g., Sentry)
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by Error Boundary:', error, errorInfo);
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '20px', border: '1px solid red', background: '#ffe6e6' }}>
          <h2>Oops, something went wrong!</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;

```

#### 2. Wrap Your Components (`App.jsx`)

You can wrap your entire app, or wrap individual widgets so a crash in one widget doesn't take down the whole page.

```jsx
import ErrorBoundary from './ErrorBoundary';
import HeavyWidget from './HeavyWidget';

function App() {
  return (
    <div>
      <h1>My Dashboard</h1>
      
      {/* If HeavyWidget crashes, only this box shows the error UI */}
      <ErrorBoundary>
        <HeavyWidget />
      </ErrorBoundary>
    </div>
  );
}

```

---

### Method 2: The Modern Way (`react-error-boundary` Library)

Writing class components in modern React feels outdated. The widely adopted industry standard is using the `react-error-boundary` npm package, which provides a clean functional API and allows you to easily reset the error state.

#### 1. Install the Library

```bash
npm install react-error-boundary

```

#### 2. Implementation

```jsx
import { ErrorBoundary } from 'react-error-boundary';

// 1. Create a Fallback UI Component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ padding: '20px', background: '#fee' }}>
      <h2>UI Crashed!</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      {/* Clicking this button attempts to re-render the component */}
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// 2. Wrap your components
function App() {
  const logError = (error, info) => {
    console.error("Caught an error:", error, info);
  };

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback} 
      onError={logError}
      onReset={() => {
        // Reset any state that caused the error here before re-rendering
      }}
    >
      <BuggyComponent />
    </ErrorBoundary>
  );
}

```

---

### Crucial Interview Concept: What Error Boundaries DO NOT Catch

Error boundaries specifically catch **render-phase errors** (errors thrown while React is evaluating JSX). They do **NOT** catch errors in the following 4 scenarios:

1. **Event Handlers:** (e.g., `onClick`, `onChange`). If an error happens when a user clicks a button, React still knows what to render, so it doesn't crash the UI. Use standard `try/catch` here.
2. **Asynchronous Code:** (e.g., `setTimeout`, `requestAnimationFrame`, or `fetch` promises).
3. **Server-Side Rendering (SSR).**
4. **Errors thrown in the Error Boundary itself:** (Rather than its children).

#### How to catch Async / Event Handler errors in a Boundary anyway?

If you *want* an API failure or an event handler crash to trigger your Error Boundary, you can use the `useErrorBoundary` hook from `react-error-boundary`:

```jsx
import { useErrorBoundary } from 'react-error-boundary';

function UserProfile() {
  const { showBoundary } = useErrorBoundary();

  const handleSave = async () => {
    try {
      await saveUser();
    } catch (error) {
      // This forces the Error Boundary to catch the async error and show the fallback UI!
      showBoundary(error); 
    }
  };

  return <button onClick={handleSave}>Save</button>;
}

```
