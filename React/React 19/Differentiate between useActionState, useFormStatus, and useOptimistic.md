React 19 introduced three distinct hooks designed to streamline form handling and asynchronous mutations. While they often work together inside the same form, each hook addresses a completely different part of the form submission lifecycle.

Here is a breakdown of their differences, responsibilities, and use cases.

---

## 1. Quick Summary Comparison

| Metric                        | `useActionState`                                                          | `useFormStatus`                                                 | `useOptimistic`                                                     |
| ----------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Primary Goal**              | Manage the **state result & pending status** returned by an async action. | Read the **status of a parent `<form>**` without prop drilling. | Render **instant UI updates** before the async operation completes. |
| **Where to Call**             | Top level of the component containing or declaring the form action.       | **Inside a child component** nested within a `<form>` element.  | Component holding the list/data being modified.                     |
| **Returns**                   | `[state, formAction, isPending]`                                          | `{ pending, data, method, action }`                             | `[optimisticData, setOptimisticData]`                               |
| **Error Handling / Rollback** | Returns server/action error messages in `state`.                          | N/A                                                             | **Automated:** Rolls back if the action fails or throws an error.   |
| **Requires `<form>` Parent?** | No (can be invoked programmatically).                                     | **Yes** (must be rendered inside a parent `<form>`).            | No.                                                                 |

---

## 2. Deep Dive & Code Examples

### A. `useActionState`: Action State & Lifecycle Manager

`useActionState` wraps an async action function. It tracks whether the action is running (`isPending`), automatically passes `FormData` to your action function, and captures whatever return value or error object the action produces (`state`).

```tsx
import { useActionState } from 'react';

// Action function receives previous state and submitted FormData
async function updateProfile(prevState: any, formData: FormData) {
  const name = formData.get('username') as string;
  if (!name) return { error: 'Username is required' };

  await saveToDatabase(name);
  return { error: null, success: true };
}

export function ProfileForm() {
  // [1. Current Result State, 2. Action Trigger Function, 3. Is Action Running]
  const [state, formAction, isPending] = useActionState(updateProfile, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction}>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <input type="text" name="username" disabled={isPending} />
      <button type="submit" disabled={isPending}>Save</button>
    </form>
  );
}

```

---

### B. `useFormStatus`: Child Component Status Reader

`useFormStatus` eliminates prop drilling for UI components nested inside forms (such as custom submit buttons or loading spinners). It automatically subscribes to the status of the closest parent `<form>`.

> ⚠️ **Key Rule:** `useFormStatus` must be called in a component that is a **child** of the `<form>`, not in the component that renders the `<form>` tag itself.

```tsx
import { useFormStatus } from 'react-dom';

// Child component nested inside a parent <form>
function SubmitButton() {
  // Reads pending status from the enclosing <form> automatically!
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Submit'}
    </button>
  );
}

// Parent component
export function AppForm({ action }: { action: (data: FormData) => Promise<void> }) {
  return (
    <form action={action}>
      <input name="email" type="email" />
      {/* No need to pass `isPending` prop down to SubmitButton! */}
      <SubmitButton />
    </form>
  );
}

```

---

### C. `useOptimistic`: Instant UI Updates with Auto-Rollback

`useOptimistic` allows you to immediately reflect user actions in the UI *before* the network request completes. If the server request succeeds, the temporary state transitions smoothly into the real state. If it fails, React automatically **rolls back** the temporary UI change.

```tsx
import { useOptimistic, useActionState } from 'react';

export function CommentList({ comments, addCommentAction }: { comments: string[]; addCommentAction: any }) {
  // Wrap real props/state in useOptimistic
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (currentComments, newComment: string) => [...currentComments, newComment]
  );

  const handleSubmit = async (formData: FormData) => {
    const text = formData.get('comment') as string;
    
    // 1. Instantly append to UI before network request finishes
    addOptimisticComment(text);
    
    // 2. Execute actual background action (auto-rolls back if this throws/fails)
    await addCommentAction(formData);
  };

  return (
    <div>
      <form action={handleSubmit}>
        <input name="comment" required />
        <button type="submit">Post Comment</button>
      </form>

      <ul>
        {optimisticComments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  );
}

```

---

## 3. How They Work Together

When building complex forms in React 19, you will often combine all three:

```
                  ┌──────────────────────────────────────────────┐
                  │                <form>                        │
                  │                                              │
                  │  1. `useActionState` manages the action,     │
                  │     returns `formAction` & server errors.    │
                  │                                              │
                  │  2. `useOptimistic` instantly updates the    │
                  │     list view before network completes.      │
                  │                                              │
                  │    ┌────────────────────────────────────┐    │
                  │    │       <SubmitButton />             │    │
                  │    │                                    │    │
                  │    │  3. `useFormStatus` reads status   │    │
                  │    │     directly inside the button.    │    │
                  │    └────────────────────────────────────┘    │
                  └──────────────────────────────────────────────┘

```
