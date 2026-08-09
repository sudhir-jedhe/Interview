It looks like you typed a typo for **`useActionState`** (or `useFormState` in earlier React 19 canary releases).

**`useActionState`** is a built-in React 19 Hook that simplifies handling asynchronous state updates—especially when working with forms, Server Actions, or API mutations.

It manages pending states, error handling, and form state return values automatically, eliminating the need for manual `useState`, `setIsLoading`, and `setError` boilerplate.

---

## 1. Basic Syntax

```tsx
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);

```

* **`fn`**: The async action function to execute when the form submits or when `formAction` is invoked. Signature: `(previousState, formData) => nextState`.
* **`initialState`**: The initial value of the state before any action is executed.
* **`permalink`** *(Optional)*: A URL string used for progressive enhancement in Server-Rendered frameworks (like Next.js).
* **Returns:**

1. **`state`**: The current value returned by `fn`.
2. **`formAction`**: A wrapper function passed directly to `<form action={formAction}>` or invoked manually.
3. **`isPending`**: A boolean indicating whether the action is currently executing.

---

## 2. Complete Code Example

Here is a full example of submitting a user profile update form with loading indicators and error handling:

```tsx
import React, { useActionState } from 'react';

// 1. Define the action response state interface
interface ActionState {
  success: boolean;
  message: string | null;
}

// 2. Async action function (can be a Server Action or local async function)
async function updateProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get('name') as string;

  // Simulate network request
  await new Promise((res) => setTimeout(res, 1000));

  if (!name || name.length < 3) {
    return {
      success: false,
      message: 'Name must be at least 3 characters long.',
    };
  }

  return {
    success: true,
    message: `Profile updated successfully to "${name}"!`,
  };
}

// 3. Component
export function ProfileForm() {
  // Hook usage
  const [state, formAction, isPending] = useActionState(updateProfile, {
    success: false,
    message: null,
  });

  return (
    <div style={{ maxWidth: '360px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Update Profile</h2>

      {state.message && (
        <p style={{ color: state.success ? 'green' : 'red' }}>
          {state.message}
        </p>
      )}

      {/* Pass formAction directly to the form's action prop */}
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          name="name"
          placeholder="Enter new name..."
          disabled={isPending}
          required
        />

        <button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Update Name'}
        </button>
      </form>
    </div>
  );
}

```

---

## 3. Key Benefits Over Traditional `useState`

| Scenario                         | Traditional `useState` Approach                                                              | React 19 `useActionState`                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Pending State**                | Requires manual `const [loading, setLoading] = useState(false)` with `try/finally`.          | Managed automatically via `isPending`.                                                   |
| **FormData Extraction**          | Requires manual `e.preventDefault()`, controlled inputs, or `new FormData(e.currentTarget)`. | Automatically receives `FormData` as the second argument in the action function.         |
| **Progressive Enhancement**      | Fails if JavaScript hasn't loaded yet on the client.                                         | Works natively with HTML form submission before JS hydrates (when using Server Actions). |
| **State Resets / Return Values** | Requires manual setter calls in `.then()` or `try` blocks.                                   | Automatically sets `state` to whatever object/value the action function returns.         |

---

## 4. Pairing with `useFormStatus`

If you have deeply nested submit buttons inside sub-components, you can combine `useActionState` with React 19's **`useFormStatus`** hook so child components can read `isPending` without prop drilling:

```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  // Reads pending status from the closest parent <form> automatically!
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

```
