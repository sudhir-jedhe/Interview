In a pure React 19 application (without Next.js, Server Actions, or framework-specific route handlers), you can handle state updates and optimistic UI for custom API layouts using React 19's native hooks: **`useTransition`**, **`useOptimistic`**, and **`useActionState`**.

Even without Next.js form actions, React 19 Actions work natively with client-side async functions and `fetch` requests.

---

## 1. Architectural Overview

1. **Async Client Actions:** Define standard `async` functions that invoke your custom API (`fetch('/api/layout')`).
2. **`useOptimistic`**: Immediately renders the expected UI state when the user performs an action (e.g., reordering widgets or changing layouts).
3. **`useTransition` or `useActionState**`: Manages the background API request, loading indicators, and error handling.
4. **Automatic Rollback:** If the custom API call fails, React automatically rolls back the optimistic UI to match the actual server/state data.

---

## 2. Complete Example: Custom Dashboard Layout Editor

In this scenario, a user can reorder widgets or change layout positions. The UI updates **instantly** (0ms latency), while the updated layout configuration is saved to a custom REST API in the background.

```tsx
import React, { useState, useOptimistic, useTransition } from 'react';

// 1. Types for custom API layout
export interface Widget {
  id: string;
  title: string;
  colSpan: number;
}

// 2. Custom REST API call (Pure Client-side fetch)
async function saveLayoutToApi(newLayout: Widget[]): Promise<Widget[]> {
  const response = await fetch('/api/user/layout', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ layout: newLayout }),
  });

  if (!response.ok) {
    throw new Error('Failed to update layout settings on server.');
  }

  const data = await response.json();
  return data.layout;
}

// 3. Main Dashboard Layout Component
export function CustomDashboardLayout({ initialWidgets }: { initialWidgets: Widget[] }) {
  // Real server-confirmed state
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Transition hook for non-blocking background API calls
  const [isPending, startTransition] = useTransition();

  // Optimistic UI Hook
  // Signature: useOptimistic(passthroughState, updateFn)
  const [optimisticWidgets, updateOptimisticWidgets] = useOptimistic(
    widgets,
    (currentWidgets: Widget[], action: { type: 'MOVE'; id: string; direction: 'up' | 'down' }) => {
      const index = currentWidgets.findIndex((w) => w.id === action.id);
      if (index === -1) return currentWidgets;

      const newItems = [...currentWidgets];
      const targetIndex = action.direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= newItems.length) return currentWidgets;

      // Swap items optimistically
      const temp = newItems[index];
      newItems[index] = newItems[targetIndex];
      newItems[targetIndex] = temp;

      return newItems;
    }
  );

  // Event handler triggering the action
  const handleMoveWidget = (id: string, direction: 'up' | 'down') => {
    setErrorMessage(null);

    // Calculate expected next layout ahead of time for API payload
    const index = widgets.findIndex((w) => w.id === id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= widgets.length) return;

    const nextLayout = [...widgets];
    const temp = nextLayout[index];
    nextLayout[index] = nextLayout[targetIndex];
    nextLayout[targetIndex] = temp;

    // Wrap async mutation in startTransition
    startTransition(async () => {
      // Step A: Trigger immediate optimistic UI render
      updateOptimisticWidgets({ type: 'MOVE', id, direction });

      try {
        // Step B: Send network request to custom API
        const updatedLayout = await saveLayoutToApi(nextLayout);

        // Step C: Update real state with server response on success
        setWidgets(updatedLayout);
      } catch (err: any) {
        // Step D: On error, set error message.
        // React AUTOMATICALLY discards optimistic state and reverts UI to `widgets`!
        setErrorMessage(err.message || 'Layout update failed.');
      }
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      <h2>Custom Dashboard Layout {isPending && <small style={{ color: '#888' }}>(Syncing...)</small>}</h2>

      {errorMessage && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
          ⚠️ {errorMessage}
        </div>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {optimisticWidgets.map((widget, index) => (
          <div
            key={widget.id}
            style={{
              padding: '16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: isPending ? '#f8fafc' : '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>{widget.title}</strong>
              <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#64748b' }}>
                Span: {widget.colSpan} col
              </span>
            </div>

            <div>
              <button
                disabled={index === 0}
                onClick={() => handleMoveWidget(widget.id, 'up')}
                style={{ marginRight: '6px' }}
              >
                ↑ Move Up
              </button>
              <button
                disabled={index === optimisticWidgets.length - 1}
                onClick={() => handleMoveWidget(widget.id, 'down')}
              >
                ↓ Move Down
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## 3. Alternative: Using Client Actions with `useActionState`

If your custom API layout updates are submitted via standard forms or inputs (e.g., editing layout dimensions or names), you can use **`useActionState`** directly with a client-side `fetch` function:

```tsx
import { useActionState } from 'react';

interface LayoutState {
  columns: number;
  error: string | null;
}

// Client-side Action Function
async function updateLayoutAction(prevState: LayoutState, formData: FormData): Promise<LayoutState> {
  const columns = Number(formData.get('columns'));

  try {
    const res = await fetch('/api/layout/columns', {
      method: 'POST',
      body: JSON.stringify({ columns }),
    });

    if (!res.ok) throw new Error('Failed to update grid columns');

    return { columns, error: null };
  } catch (err: any) {
    return { columns: prevState.columns, error: err.message };
  }
}

export function GridSettings({ currentColumns }: { currentColumns: number }) {
  // useActionState works with local client actions in pure React!
  const [state, formAction, isPending] = useActionState(updateLayoutAction, {
    columns: currentColumns,
    error: null,
  });

  return (
    <form action={formAction}>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}

      <label>
        Grid Columns:
        <input type="number" name="columns" defaultValue={state.columns} disabled={isPending} />
      </label>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Save Layout'}
      </button>
    </form>
  );
}

```

---

## 4. Key Rules for Pure React Optimistic Updates

1. **State Passthrough:** The first argument of `useOptimistic(passthroughState, ...)` must be your real server/React state (`widgets`). When `passthroughState` updates after a successful fetch, `useOptimistic` reconciles automatically.
2. **Automatic Rollbacks:** You do **not** need to write manual undo logic inside `catch` blocks. When an error occurs, if you do not call `setWidgets()`, React drops the optimistic value on the next render and reverts the screen to match the real state.
3. **Async Transitions:** Always wrap asynchronous calls that update optimistic UI inside `startTransition(async () => { ... })` so React can keep the UI responsive and mark the update as non-blocking.
