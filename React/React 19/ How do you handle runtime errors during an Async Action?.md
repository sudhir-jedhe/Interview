Handling runtime errors during an **Async Action** in React 19 depends on whether the action is triggered via an **HTML `<form>**` (using `useActionState`), an **event handler** (using `useTransition`), or a **Server Component boundary**.

Here are the primary strategies to handle runtime errors cleanly:

---

## Method 1: Using `useActionState` (Recommended for Forms)

When working with forms or mutations managed by `useActionState`, runtime errors are best handled by catching them inside the action function and returning an **error object** as part of the action state. This avoids throwing unhandled exceptions that break the UI.

### Code Example: Returning Error State

```tsx
import { useActionState } from 'react';

// 1. Define action state shape
interface ActionState {
  data: string | null;
  error: string | null;
}

// 2. Action function catching runtime errors internally
async function submitDataAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const query = formData.get('query') as string;

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      // Handle known HTTP error statuses
      return { data: null, error: `Server error: HTTP ${res.status}` };
    }

    const result = await res.json();
    return { data: result.message, error: null };
  } catch (err) {
    // Catch unexpected network crashes or runtime errors
    return {
      data: null,
      error: err instanceof Error ? err.message : 'An unexpected network error occurred.',
    };
  }
}

// 3. Component consuming state
export function SearchForm() {
  const [state, formAction, isPending] = useActionState(submitDataAction, {
    data: null,
    error: null,
  });

  return (
    <form action={formAction}>
      <input type="text" name="query" required disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>

      {/* Render runtime error cleanly */}
      {state.error && (
        <p style={{ color: 'red', marginTop: '8px' }}>⚠️ {state.error}</p>
      )}

      {/* Render success result */}
      {state.data && <p style={{ color: 'green' }}>✅ {state.data}</p>}
    </form>
  );
}

```

---

## Method 2: Catching Errors in `useTransition` (For Event Handlers)

If an async action is invoked programmatically inside an event handler (e.g., `onClick`) using `useTransition`, wrap the async call in a standard `try/catch` block inside `startTransition`.

```tsx
import { useState, useTransition } from 'react';

export function DeleteButton({ itemId }: { itemId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);

    // startTransition accepts async functions in React 19
    startTransition(async () => {
      try {
        const res = await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete item from server.');
      } catch (err: any) {
        // Catch runtime errors and store in component state
        setError(err.message);
      }
    });
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={isPending}>
        {isPending ? 'Deleting...' : 'Delete'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

```

---

## Method 3: Using Error Boundaries (For Unhandled Action Errors)

If an async action throws an uncaught error (or if you intentionally re-throw an error inside an action), React 19 will bubble the exception up to the nearest **Error Boundary**.

This is best for **fatal errors** (e.g., database connection down, unauthorized access) where rendering a fallback UI for the entire section is preferred.

```tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// React Error Boundary Component
export class ActionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

```

### Wrapping the Action Form in an Error Boundary

```tsx
import { ActionErrorBoundary } from './ActionErrorBoundary';

async function fatalAction(formData: FormData) {
  'use server';
  // Throwing uncaught error deliberately
  throw new Error('Database connection failed!');
}

export function App() {
  return (
    <ActionErrorBoundary fallback={<div>Something went terribly wrong! Please try again later.</div>}>
      <form action={fatalAction}>
        <button type="submit">Execute Critical Task</button>
      </form>
    </ActionErrorBoundary>
  );
}

```

---

## Method 4: Handling Errors with `useOptimistic` (Auto-Rollback)

When performing optimistic UI updates via `useOptimistic`, if the underlying async action throws an error, **React automatically rolls back the optimistic UI state** to match the server state.

```tsx
const [optimisticItems, addOptimisticItem] = useOptimistic(
  items,
  (current, newItem) => [...current, newItem]
);

const handleSubmit = async (formData: FormData) => {
  const text = formData.get('item') as string;

  // 1. Instantly update UI
  addOptimisticItem(text);

  try {
    // 2. Perform background action
    await saveItemAction(formData);
  } catch (err) {
    // 3. React AUTOMATICALLY rolls back optimistic UI state when action fails!
    alert('Failed to save item. UI rolled back.');
  }
};

```

---

## Summary Best Practices

| Action Type                              | Recommended Error Handling Approach                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| **Form Submissions (`useActionState`)**  | Catch error inside the action and return `{ error: 'Message' }` in the result object. |
| **Event Handlers (`useTransition`)**     | Wrap async function inside `startTransition` with a standard `try / catch` block.     |
| **Optimistic Updates (`useOptimistic`)** | Let `useOptimistic` handle automatic rollbacks when the action throws or rejects.     |
| **Fatal / Unexpected Server Errors**     | Let uncaught errors bubble to the nearest `<ErrorBoundary>` fallback UI.              |
