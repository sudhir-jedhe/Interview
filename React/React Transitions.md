In React, **Transitions** provide a mechanism to distinguish between **urgent updates** (e.g., typing into an input, clicking a button, dragging a slider) and **non-urgent transition updates** (e.g., filtering a list, switching tabs, rendering a heavy chart).

By marking an update as a transition, you tell React: *"Keep the UI responsive to user input—if a new update comes in while processing this transition, interrupt it."*

---

## The Core Problem Transitions Solve

Without transitions, every state update in React has equal priority. Updating a large dataset or triggering a heavy render on every keystroke causes input lag, choppy typing, and frozen frames.

```
Without Transitions (Blocked Main Thread):
User types 'a' ──► State updates ──► Renders 10,000 items (Main thread blocked)
                                       └── User types 'b' (Ignored until render finishes)

With Transitions (Interruptible Rendering):
User types 'a' ──► Urgent State updates (Input reflects 'a')
                 └── Transition State updates (Starts rendering 10,000 items)
                       └── User types 'b' ──► Interrupted! React drops frame, renders 'ab' immediately

```

---

## 1. `useTransition` Hook

The `useTransition` hook returns two values:

* `isPending`: A boolean indicating whether the transition state update is currently processing.
* `startTransition`: A function that wraps low-priority state updates.

### Complete Example: Responsive Search Filter

```tsx
import React, { useState, useTransition, ChangeEvent } from 'react';

// Generates 10,000 items to simulate a heavy component
const bigList = Array.from({ length: 10000 }, (_, i) => `Item #${i + 1}`);

export function FilterList() {
  const [inputValue, setInputValue] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 1. URGENT UPDATE: Immediately reflects the typed character in the text box
    setInputValue(value);

    // 2. NON-URGENT UPDATE: Lowers priority for re-filtering the heavy list
    startTransition(() => {
      setFilterTerm(value);
    });
  };

  const filteredItems = bigList.filter((item) =>
    item.toLowerCase().includes(filterTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h2>Search Filter with useTransition</h2>

      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type to filter 10,000 items..."
        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
      />

      {/* Display pending feedback without blocking typing */}
      <div style={{ height: '24px', margin: '8px 0' }}>
        {isPending && <small style={{ color: '#6366f1' }}>Updating list...</small>}
      </div>

      <ul style={{ height: '300px', overflowY: 'auto', border: '1px solid #e2e8f0' }}>
        {filteredItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

```

---

## 2. Async Transitions & Actions (React 19)

React 19 expands `startTransition` to support **async functions**. This enables handling loading states, optimistic updates, and form submissions natively without needing manual `isSubmitting` or `isLoading` states.

```tsx
import React, { useState, useTransition } from 'react';

async function updateUsernameApi(newName: string): Promise<string> {
  await new Promise((res) => setTimeout(res, 1500));
  if (newName === 'error') throw new Error('Name unavailable');
  return newName;
}

export function UpdateProfile() {
  const [name, setName] = useState('Alex');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = formData.get('username') as string;

    // Async Transition handles loading state automatically
    startTransition(async () => {
      setError(null);
      try {
        const updatedName = await updateUsernameApi(newName);
        setName(updatedName);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
      <h3>Current Name: {name}</h3>

      <input name="username" defaultValue={name} disabled={isPending} />

      <button type="submit" disabled={isPending} style={{ marginLeft: '8px' }}>
        {isPending ? 'Saving...' : 'Save Name'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

```

---

## 3. `useDeferredValue` vs `useTransition`

Both hooks work with concurrent rendering priorities, but they apply to different scenarios:

| Metric / Scenario     | `useTransition`                                                                | `useDeferredValue`                                                                  |
| --------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| **Primary Mechanism** | Wraps the **state-setting function** (`startTransition(() => setState(...))`). | Wraps the **state value** itself (`useDeferredValue(state)`).                       |
| **When to Use**       | When you have **direct access** to the event handler or state setter.          | When receiving values via **props** from a parent component or third-party library. |
| **Pending State**     | Provides `isPending` boolean flag out-of-the-box.                              | Compare `value !== deferredValue` to derive pending status.                         |

### `useDeferredValue` Example

```tsx
import React, { useState, useDeferredValue } from 'react';

export function ParentComponent() {
  const [text, setText] = useState('');
  
  // Defers updating the heavy list child until user stops typing rapidly
  const deferredText = useDeferredValue(text);

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      
      {/* Pass deferred text value to heavy child */}
      <HeavyList query={deferredText} />
    </div>
  );
}

```

---

## Key Rules of Transitions

1. **Only for State Updates:** Code inside `startTransition` must trigger a React state setter synchronously (or resolve an async operation that calls a state setter). Do not wrap arbitrary side effects without state changes.
2. **Interruptibility:** If another urgent interaction happens while a transition render is in progress, React discards the unfinished rendering work and prioritizes processing the new interaction.
3. **No Input Binding:** Never wrap controlled form input values (e.g., `<input value={text} />`) directly in `startTransition` without keeping a fast copy, or the input element will feel lagged and unresponsive.

Show how to use React 19 useActionState for form handling and state transitions.

React 19 introduces **`useActionState`** (formerly `useFormState` in earlier canary builds) to streamline form handling, async actions, and state transitions.

It manages form state, handles loading/pending flags, catches errors, and processes form actions without needing manual `useState`, `isSubmitting` booleans, or custom event handlers.

---

## 1. Syntax & Signature

```tsx
const [state, formAction, isPending] = useActionState(actionFn, initialState, permalink?);

```

* **`actionFn`**: An async function executed when the form is submitted: `(previousState, formData) => nextState`.
* **`initialState`**: The starting value for `state` before the first submission.
* **`state`**: The current result returned by the last run of `actionFn`.
* **`formAction`**: The wrapped function passed directly into a `<form action={formAction}>` or `<button formAction={formAction}>`.
* **`isPending`**: A boolean indicating if the action transition is actively processing.

---

## 2. Complete Example: Form Submission & State Transitions

This example shows a profile update form with validation, server simulation, loading states, and error handling.

```tsx
import React, { useActionState } from 'react';

// Form State Interface
interface FormState {
  success: boolean;
  message: string | null;
  errors?: {
    username?: string;
    email?: string;
  };
}

// Initial Form State
const initialState: FormState = {
  success: false,
  message: null,
};

// 1. The Action Handler Function
async function updateProfile(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;

  // Validation
  const errors: FormState['errors'] = {};
  if (!username || username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  }
  if (!email || !email.includes('@')) {
    errors.email = 'Please provide a valid email address.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Validation failed. Please correct the fields below.',
      errors,
    };
  }

  // Simulate network API request
  await new Promise((res) => setTimeout(res, 1200));

  // Simulate error response
  if (email === 'taken@example.com') {
    return {
      success: false,
      message: 'Email address is already in use.',
    };
  }

  return {
    success: true,
    message: `Profile updated successfully for ${username}!`,
  };
}

// 2. The Form Component
export function UserProfileForm() {
  // useActionState handles the state, the formAction wrapper, and transition pending state
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Update Profile</h2>

      {/* Global Status Banner */}
      {state.message && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '6px',
            backgroundColor: state.success ? '#dcfce7' : '#fee2e2',
            color: state.success ? '#166534' : '#991b1b',
          }}
        >
          {state.message}
        </div>
      )}

      {/* Pass formAction directly to the <form> action attribute */}
      <FormContainer action={formAction} isPending={isPending} state={state} />
    </div>
  );
}

function FormContainer({
  action,
  isPending,
  state,
}: {
  action: (payload: FormData) => void;
  isPending: boolean;
  state: FormState;
}) {
  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
          Username
        </label>
        <input
          type="text"
          name="username"
          defaultValue="alex_j"
          disabled={isPending}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
        {state.errors?.username && (
          <p style={{ color: '#dc2626', margin: '4px 0 0', fontSize: '14px' }}>
            {state.errors.username}
          </p>
        )}
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
          Email Address
        </label>
        <input
          type="email"
          name="email"
          defaultValue="alex@example.com"
          disabled={isPending}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
        {state.errors?.email && (
          <p style={{ color: '#dc2626', margin: '4px 0 0', fontSize: '14px' }}>
            {state.errors.email}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: '10px',
          backgroundColor: isPending ? '#94a3b8' : '#4f46e5',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          cursor: isPending ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
        }}
      >
        {isPending ? 'Saving Changes...' : 'Save Profile'}
      </button>
    </form>
  );
}

```

---

## 3. Pairing with `useFormStatus`

Child components nested inside a `<form>` can access the parent form's submission state using the **`useFormStatus`** hook without needing to pass `isPending` down through props:

```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  // Automatically reads status from parent <form>
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

```

---

## Key Advantages of `useActionState`

1. **Native React 19 Transitions:** Submissions run inside a React transition automatically. The rest of your app remains responsive during background async processing.
2. **Progressive Enhancement:** Works seamlessly with native HTML forms. If JavaScript is delayed or loading, native form POST behaviors still function in SSR environments.
3. **No Boilerplate:** Replaces manual state management (`const [loading, setLoading] = useState(false)` and `const [error, setError] = useState(null)`).

Show how to use React 19 useOptimistic hook alongside useActionState for instant UI updates.

Combining **`useOptimistic`** with **`useActionState`** allows you to show instant optimistic UI updates to the user the exact millisecond a form is submitted, while **`useActionState`** manages the background async server operation, true state updates, loading flags, and error fallbacks.

If the server operation succeeds, the true state replaces the optimistic state. If the server operation fails or rejects, React automatically rolls back the optimistic update to the original state.

---

## How They Work Together

```
User Submits Form
  │
  ├── 1. setOptimistic(newValue) ──► UI updates INSTANTLY (0ms delay)
  │
  └── 2. formAction(formData) ────► Executes async action in background
                                      │
                                      ├── Success ──► True state updates; replaces optimistic state
                                      └── Error ────► Rolls back optimistic state automatically

```

---

## Complete Example: Optimistic Comment Thread

In this example, when a user submits a new comment, it immediately appears in the comment list with a "Sending..." badge. Once the server responds, the permanent comment replaces it.

```tsx
import React, { useActionState, useOptimistic, useRef } from 'react';

export interface Comment {
  id: string;
  text: string;
  sending?: boolean; // Used to visually flag optimistic items
}

// Initial Server State
const initialComments: Comment[] = [
  { id: '1', text: 'React 19 hooks make state handling so clean!' },
  { id: '2', text: 'Optimistic updates make apps feel instant.' },
];

// 1. Server Action (Handles actual background API/DB mutation)
async function addCommentAction(
  previousComments: Comment[],
  formData: FormData
): Promise<Comment[]> {
  const text = formData.get('comment') as string;

  if (!text || text.trim() === '') {
    return previousComments;
  }

  // Simulate server network latency (1.5 seconds)
  await new Promise((res) => setTimeout(res, 1500));

  // Simulate occasional server error for demonstration
  if (text.toLowerCase().includes('error')) {
    throw new Error('Server rejected the comment.');
  }

  const newComment: Comment = {
    id: Date.now().toString(),
    text,
  };

  return [...previousComments, newComment];
}

// 2. Component
export function CommentThread() {
  const formRef = useRef<HTMLFormElement>(null);

  // useActionState manages the true server state and background execution
  const [comments, formAction, isPending] = useActionState(
    addCommentAction,
    initialComments
  );

  // useOptimistic manages the immediate temporary UI update
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    // Reducer: How to merge the optimistic value into the current state
    (currentComments: Comment[], newCommentText: string) => [
      ...currentComments,
      {
        id: `optimistic-${Date.now()}`,
        text: newCommentText,
        sending: true, // Flag as temporary/sending
      },
    ]
  );

  // Form submit handler that triggers both optimistic update and action
  const handleSubmit = async (formData: FormData) => {
    const text = formData.get('comment') as string;
    if (!text) return;

    // Reset the input field immediately
    formRef.current?.reset();

    // 1. Trigger INSTANT optimistic UI update (0ms)
    addOptimisticComment(text);

    // 2. Trigger background async action
    await formAction(formData);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Comment Thread</h2>

      {/* Render optimisticComments instead of raw comments state */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {optimisticComments.map((comment) => (
          <li
            key={comment.id}
            style={{
              padding: '12px',
              marginBottom: '8px',
              borderRadius: '6px',
              backgroundColor: comment.sending ? '#f1f5f9' : '#ffffff',
              border: '1px solid #e2e8f0',
              opacity: comment.sending ? 0.7 : 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{comment.text}</span>
            {comment.sending && (
              <span
                style={{
                  fontSize: '12px',
                  color: '#6366f1',
                  fontWeight: 'bold',
                  background: '#e0e7ff',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                Sending...
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Form using the combined submit handler */}
      <form
        ref={formRef}
        action={handleSubmit}
        style={{ display: 'flex', gap: '8px', marginTop: '16px' }}
      >
        <input
          type="text"
          name="comment"
          placeholder="Write a comment... (type 'error' to test rollback)"
          required
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '10px 16px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Post
        </button>
      </form>
    </div>
  );
}

```

---

## Key Benefits of This Pattern

1. **Instant Feedback (0ms Latency):** The user sees their input in the UI instantly without waiting for network round-trips.
2. **Automatic Rollback:** If `formAction` throws an exception or rejects, React automatically reverts `optimisticComments` back to `comments` without requiring manual rollback code.
3. **Clean Code Structure:** No complex state machines or manual `try/catch` state resets—`useOptimistic` declaratively binds the temporary state to the true `useActionState` lifecycle.
