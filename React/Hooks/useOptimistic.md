Combining React 19's **`useActionState`** and **`useOptimistic`** creates a seamless user experience for asynchronous form submissions:

1. **`useOptimistic`** instantly updates the UI with expected data *before* the network request completes.
2. **`useActionState`** handles the actual asynchronous mutation, managing server state return values, error handling, and the pending status.
3. If the server request fails, `useOptimistic` automatically **rolls back** the UI to match the real server state.

---

## 1. Complete Architecture & Example

Here is a complete, working example of an instant comment feed where new comments appear immediately upon clicking submit, even if the backend API takes a few seconds to respond.

```tsx
import React, { useActionState, useOptimistic, useRef } from 'react';

export interface Comment {
  id: string;
  text: string;
  sending?: boolean; // Optional flag for styling pending items
}

interface ActionState {
  comments: Comment[];
  error: string | null;
}

// Simulated backend API action
async function addCommentAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const newText = formData.get('comment') as string;

  try {
    // Simulate network delay (e.g., 1.5 seconds)
    await new Promise((res) => setTimeout(res, 1500));

    // Simulate validation error scenario
    if (newText.toLowerCase().includes('spam')) {
      return {
        ...prevState,
        error: 'Spam comment rejected by server!',
      };
    }

    // Success: Return updated real server state
    const serverComment: Comment = {
      id: String(Date.now()),
      text: newText,
    };

    return {
      comments: [...prevState.comments, serverComment],
      error: null,
    };
  } catch {
    return {
      ...prevState,
      error: 'Failed to post comment.',
    };
  }
}

export function CommentFeed() {
  const formRef = useRef<HTMLFormElement>(null);

  // 1. Manage real server state and form action with useActionState
  const [state, formAction, isPending] = useActionState(addCommentAction, {
    comments: [
      { id: '1', text: 'First real comment from server!' },
    ],
    error: null,
  });

  // 2. Wrap server comments in useOptimistic
  // Signature: useOptimistic(passthroughState, updateFn)
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    state.comments,
    (currentComments: Comment[], newText: string) => [
      ...currentComments,
      {
        id: 'temp-' + Date.now(),
        text: newText,
        sending: true, // Marked as sending for visual feedback
      },
    ]
  );

  // 3. Wrapper handler to fire optimistic update before invoking formAction
  const handleSubmit = async (formData: FormData) => {
    const commentText = formData.get('comment') as string;
    if (!commentText.trim()) return;

    // Reset input field instantly
    formRef.current?.reset();

    // Trigger instant optimistic UI update
    addOptimisticComment(commentText);

    // Run the actual server action (managed by useActionState)
    await formAction(formData);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Comment Feed</h2>

      {state.error && (
        <p style={{ color: 'red', background: '#fee2e2', padding: '8px', borderRadius: '4px' }}>
          {state.error}
        </p>
      )}

      {/* Form using custom handleSubmit */}
      <form ref={formRef} action={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          name="comment"
          placeholder="Write a comment..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit">Post</button>
      </form>

      {/* Render optimistic comments list */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {optimisticComments.map((comment) => (
          <li
            key={comment.id}
            style={{
              padding: '10px',
              borderBottom: '1px solid #e2e8f0',
              // Visual treatment for pending optimistic items:
              opacity: comment.sending ? 0.6 : 1,
              fontStyle: comment.sending ? 'italic' : 'normal',
            }}
          >
            {comment.text}
            {comment.sending && <small style={{ marginLeft: '8px', color: '#64748b' }}>(Sending...)</small>}
          </li>
        ))}
      </ul>
    </div>
  );
}

```

---

## 2. Execution Flow Step-by-Step

```
[ User Clicks Submit ]
       │
       ├── 1. handleSubmit fires
       │     ├── Resets form input field instantly
       │     └── Calls addOptimisticComment("My new comment")
       │
       ├── 2. UI Updates INSTANTLY ──► Temporary item appended with opacity: 0.6
       │
       ├── 3. formAction runs in background (API request in flight)
       │
       └── 4. API Request Completes
             │
             ├── SUCCESS: Server state updates (state.comments). 
             │   `useOptimistic` switches from temporary item to confirmed server item seamlessly.
             │
             └── FAILURE: Server returns error (state.error). 
                 `useOptimistic` automatically rolls back the temporary comment from UI!

```

---

## 3. Key Rules & Best Practices

1. **State Passthrough:** The first argument to `useOptimistic(passthroughState, ...)` **must** be the real state from `useActionState` (or props/Context). When `passthroughState` updates, `useOptimistic` discards its temporary updates and re-syncs with real data.
2. **Automatic Rollbacks:** If an action throws an error or fails to update the underlying state, React automatically drops the optimistic update during the re-render.
3. **Form Resets:** Clearing form inputs manually (`formRef.current?.reset()`) inside `handleSubmit` provides immediate feedback alongside the optimistic render.
