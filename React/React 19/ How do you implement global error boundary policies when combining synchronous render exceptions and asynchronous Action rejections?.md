Implementing a global error boundary policy that unifiedly catches both **synchronous render exceptions** and **asynchronous Action rejections** requires bridging two different error propagation models in React 19:

1. **Synchronous Render Exceptions:** Naturally caught by standard React `Component` Error Boundaries (`componentDidCatch` / `getDerivedStateFromError`).
2. **Asynchronous Action Rejections:** Async errors inside event handlers or transitions do *not* automatically bubble up to class Error Boundaries by default unless they are explicitly thrown into the render lifecycle or managed via transitions.

To build a robust global error handling policy, you need a **Hybrid Error Boundary & Action Interceptor System**.

---

## Architecture Overview

```
                        ┌──────────────────────────────────────────────┐
                        │       Global Error Boundary (Class)          │
                        │  - Catches Sync Render Exceptions            │
                        │  - Catches Unhandled Action Exceptions       │
                        └──────────────────────┬───────────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       │    Global Action Error Dispatch Context       │
                       │  - Wraps async action state globally          │
                       │  - Converts Action rejections to throwables   │
                       └───────────────────────┬───────────────────────┘
                                               │
            ┌──────────────────────────────────┴──────────────────────────────────┐
            ▼                                                                     ▼
┌──────────────────────────────┐                               ┌──────────────────────────────┐
│ Synchronous Render Exception │                               │ Async Action / Form Error    │
│  (e.g., throw in JSX body)   │                               │  (e.g., fetch failure)       │
└──────────────────────────────┘                               └──────────────────────────────┘

```

---

## Step 1: Global Error Boundary Class

Create a top-level Class Error Boundary that catches both synchronous render crashes and re-thrown asynchronous errors.

```tsx
import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Send to global error telemetry (e.g., Sentry, Datadog)
    console.error('[GlobalErrorBoundary Captured Error]:', error, errorInfo);
  }

  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetErrorBoundary);
      }

      return (
        <div style={{ padding: '30px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px' }}>
          <h2>Application Error</h2>
          <p style={{ color: '#dc2626' }}>{this.state.error.message}</p>
          <button onClick={this.resetErrorBoundary}>Try Again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

```

---

## Step 2: Bridge Asynchronous Action Rejections to the Error Boundary

In React 19, asynchronous errors inside `useTransition` or `startTransition` can be re-thrown during render using a custom hook (such as `useThrowAsyncError`).

This bridges the gap between async promises and sync React error boundaries.

```tsx
import { useState, useCallback } from 'react';

/**
 * Custom hook to forward asynchronous errors to the nearest Error Boundary
 */
export function useThrowAsyncError() {
  const [, setError] = useState();

  return useCallback((error: unknown) => {
    // Setting state to a function that throws triggers React's render-phase error catching!
    setError(() => {
      if (error instanceof Error) throw error;
      throw new Error(typeof error === 'string' ? error : 'An unknown async error occurred');
    });
  }, []);
}

```

---

## Step 3: Global Action Runner Wrapper

Combine `useTransition` or `useActionState` with the async error forwarder. This allows you to differentiate between **recoverable field validation errors** (handled locally) and **unhandled runtime exceptions** (bubbled to the global boundary).

```tsx
import React, { useTransition } from 'react';
import { useThrowAsyncError } from './useThrowAsyncError';

interface GlobalActionOptions {
  onSuccess?: () => void;
  // If true, fatal errors bubble to GlobalErrorBoundary; if false, handled inline
  fatal?: boolean; 
}

export function useGlobalAction() {
  const [isPending, startTransition] = useTransition();
  const throwAsyncError = useThrowAsyncError();

  const executeAction = (
    actionFn: () => Promise<void>,
    options: GlobalActionOptions = { fatal: true }
  ) => {
    startTransition(async () => {
      try {
        await actionFn();
        options.onSuccess?.();
      } catch (err: any) {
        if (options.fatal) {
          // Re-throw into the render phase -> Triggers GlobalErrorBoundary!
          throwAsyncError(err);
        } else {
          console.warn('Handled inline action error:', err);
        }
      }
    });
  };

  return { executeAction, isPending };
}

```

---

## Step 4: Full App Integration & Usage

Here is how the entire pipeline coordinates when handling both a synchronous crash and an async network failure:

```tsx
import React from 'react';
import { GlobalErrorBoundary } from './GlobalErrorBoundary';
import { useGlobalAction } from './useGlobalAction';

// 1. Component with a Synchronous Render Exception
function SyncCrashingComponent() {
  // Throws during render
  throw new Error('💥 Synchronous DOM Render Exception!');
}

// 2. Component with an Asynchronous Action Rejection
function AsyncActionComponent() {
  const { executeAction, isPending } = useGlobalAction();

  const handleAsyncSubmit = () => {
    executeAction(async () => {
      // Simulate network request
      await new Promise((res) => setTimeout(res, 1000));
      
      // Simulate uncaught server rejection
      throw new Error('🔥 Fatal Async Action Failure (500 Internal Server Error)');
    });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', marginTop: '16px' }}>
      <h3>Async Action Tester</h3>
      <button onClick={handleAsyncSubmit} disabled={isPending}>
        {isPending ? 'Executing Action...' : 'Trigger Fatal Async Error'}
      </button>
    </div>
  );
}

// 3. Application Root demonstrating Policy Isolation
export function App() {
  return (
    <GlobalErrorBoundary
      fallback={(error, reset) => (
        <div style={{ padding: '20px', background: '#fee2e2' }}>
          <h1>Global System Fallback</h1>
          <p>{error.message}</p>
          <button onClick={reset}>Reset App</button>
        </div>
      )}
    >
      <main style={{ padding: '20px' }}>
        <h2>Global Error Boundary Policy Demo</h2>
        
        {/* Handles Async Action Rejections */}
        <AsyncActionComponent />

        {/* Uncomment to test Synchronous Render Exceptions:
            <SyncCrashingComponent /> 
        */}
      </main>
    </GlobalErrorBoundary>
  );
}

```

---

## Policy Guidelines Summary Matrix

| Error Type                  | Source                                               | Handling Policy                                     | Behavior                                                          |
| --------------------------- | ---------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| **Sync Render Error**       | Invalid JSX, null reference in render, missing data. | Caught natively by `componentDidCatch`.             | Unmounts crashed sub-tree; displays fallback UI.                  |
| **Inline Action Error**     | Expected validation error (e.g., invalid email).     | Returned as state object via `useActionState`.      | Keeps UI mounted; renders inline feedback.                        |
| **Fatal Async Rejection**   | Network crash, database offline, unauthorized API.   | Re-thrown via `useThrowAsyncError()` in transition. | Bubbles up to `GlobalErrorBoundary`; displays system fallback UI. |
| **Optimistic Action Error** | API failure during instant UI update.                | Handled automatically by `useOptimistic` rollback.  | Reverts optimistic UI; captures error state locally or globally.  |
