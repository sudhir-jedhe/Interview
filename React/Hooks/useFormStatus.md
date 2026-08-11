The `useFormStatus` hook (provided by `react-dom`) gives you status information about the last form submission. It was designed to work seamlessly with React Server Actions and drastically reduces the amount of boilerplate state you need to write to manage form submissions.

Instead of manually creating `isSubmitting` states and managing them in `onSubmit` handlers, `useFormStatus` reads the form's state directly from context.

## The Return Object

When you call the hook, it returns an object with four properties:

| Property      | Type       | Description                                                                |
| ------------- | ---------- | -------------------------------------------------------------------------- |
| **`pending`** | `boolean`  | `true` if the parent `<form>` is currently submitting. Otherwise, `false`. |
| **`data`**    | `FormData` | `null`                                                                     | A `FormData` object containing the data the form is submitting. `null` if not submitting. |
| **`method`**  | `string`   | `null`                                                                     | The HTTP method (usually `'get'` or `'post'`).                                            |
| **`action`**  | `function` | `null`                                                                     | A reference to the action function passed to the `<form action={...}>` prop.              |

---

## ⚠️ The Golden Rule of `useFormStatus`

`useFormStatus` will **only** work if it is called in a component that is rendered *inside* a `<form>`. It acts like React Context.

If you call it in the same component that renders the `<form>` tag, it will not track the status properly (it will always return `pending: false`).

---

## Example 1: The Basic Submit Button

The most common use case is creating a reusable submit button that automatically disables itself and changes its text while the form is submitting.

```tsx
import { useFormStatus } from 'react-dom';

// 1. Create a child component for the button
function SubmitButton() {
  // Call the hook inside the child component
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Save Profile'}
    </button>
  );
}

// 2. Render it inside your form
export default function ProfileForm({ updateProfile }) {
  return (
    // The action can be a Server Action or a client-side async function
    <form action={updateProfile}>
      <label>
        Name:
        <input type="text" name="username" required />
      </label>
      
      {/* The button is a child of the form, so it works perfectly */}
      <SubmitButton />
    </form>
  );
}

```

---

## Example 2: Reading Form Data While Submitting

Sometimes you want to display optimistic UI—showing the user the data they are submitting while they wait for the server to respond. You can do this using the `data` property.

```tsx
import { useFormStatus } from 'react-dom';

function SubmittingIndicator() {
  const { pending, data } = useFormStatus();

  if (!pending) return null;

  // Extract the specific field we want to show
  const title = data.get('postTitle');

  return (
    <div className="toast-notification">
      Publishing "{title}"... Please wait.
    </div>
  );
}

export default function CreatePostForm({ createPost }) {
  return (
    <form action={createPost}>
      <input 
        type="text" 
        name="postTitle" 
        placeholder="Enter your title" 
      />
      <textarea 
        name="content" 
        placeholder="Write your post..." 
      />
      
      <button type="submit">Publish</button>
      
      {/* This component will only show when the form is submitting */}
      <SubmittingIndicator />
    </form>
  );
}

```

---

## Example 3: Multiple Actions in One Form

If your form has multiple buttons that trigger different actions (e.g., "Save Draft" vs. "Publish"), you can use the `action` property to figure out exactly *which* action is currently running.

```tsx
import { useFormStatus } from 'react-dom';

// We pass the specific action we want this button to track
function SaveDraftButton({ draftAction }) {
  const { pending, action } = useFormStatus();
  
  // Only show as loading if the currently running action matches THIS button's action
  const isSavingDraft = pending && action === draftAction;

  return (
    <button formAction={draftAction} disabled={pending}>
      {isSavingDraft ? 'Saving Draft...' : 'Save as Draft'}
    </button>
  );
}

function PublishButton({ publishAction }) {
  const { pending, action } = useFormStatus();
  
  const isPublishing = pending && action === publishAction;

  return (
    <button formAction={publishAction} disabled={pending}>
      {isPublishing ? 'Publishing...' : 'Publish Now'}
    </button>
  );
}

export default function ArticleEditor({ saveDraft, publishArticle }) {
  return (
    <form>
      <textarea name="articleBody" />
      
      <div className="actions">
        {/* Pass the corresponding actions to the child components */}
        <SaveDraftButton draftAction={saveDraft} />
        <PublishButton publishAction={publishArticle} />
      </div>
    </form>
  );
}

```

Explain how to use useActionState (formerly useFormState) in React to handle form validation and server responses, with examples.

In React 19, `useActionState` (which was called `useFormState` in earlier experimental releases) is the standard way to handle the results of form actions. It connects a form's action directly to React state, allowing you to easily display success messages, server errors, and field-level validation issues without manually wiring up `useState` or `try/catch` blocks.

## The Hook Signature

```tsx
const [state, formAction, isPending] = useActionState(action, initialState);

```

| Return Value     | Description                                                                    |
| ---------------- | ------------------------------------------------------------------------------ |
| **`state`**      | The current state returned by your action function (starts as `initialState`). |
| **`formAction`** | A new action function that you pass to your `<form action={formAction}>` prop. |
| **`isPending`**  | `true` if the action is currently running, `false` otherwise.                  |

---

## ⚠️ The `prevState` Gotcha

When you wrap an action in `useActionState`, React changes how that action is called. Your action function will now receive the **previous state** as its *first* argument, and the `FormData` as its *second* argument.

```tsx
// ❌ Standard Form Action
async function createPost(formData: FormData) { ... }

// ✅ useActionState Form Action
async function createPost(prevState: any, formData: FormData) { ... }

```

---

## Example 1: Basic Server Response (Success/Error Messages)

Here is a simple form that returns either a success message or an error message based on the server's response.

```tsx
import { useActionState } from 'react';

// 1. Define the action (often this lives in a separate file with "use server")
async function subscribeAction(prevState, formData) {
  const email = formData.get('email');

  // Simulate a network request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!email || !email.includes('@')) {
    return { error: 'Please provide a valid email address.' };
  }

  return { success: 'Thanks for subscribing!' };
}

// 2. The Component
export default function NewsletterForm() {
  // Initialize the hook with the action and a starting state
  const [state, formAction, isPending] = useActionState(subscribeAction, {
    error: null,
    success: null,
  });

  return (
    <form action={formAction}>
      <input type="email" name="email" placeholder="Enter your email" />
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Subscribing...' : 'Subscribe'}
      </button>

      {/* Conditionally render the state returned from the server */}
      {state.error && <p className="error-text" style={{color: 'red'}}>{state.error}</p>}
      {state.success && <p className="success-text" style={{color: 'green'}}>{state.success}</p>}
    </form>
  );
}

```

---

## Example 2: Field-Level Form Validation

For more complex forms, you often need to return errors for specific fields (e.g., username is taken, password is too short). You can structure the state object to hold these field-specific errors.

```tsx
import { useActionState } from 'react';

const initialState = {
  errors: {
    username: '',
    password: '',
  },
  message: '',
};

async function registerUser(prevState, formData) {
  const username = formData.get('username');
  const password = formData.get('password');
  
  const errors = {};

  // Validate fields
  if (username.length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  }
  if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  // If there are errors, return them to populate the state
  if (Object.keys(errors).length > 0) {
    return {
      errors,
      message: 'Failed to register. Please check the fields below.',
    };
  }

  // If successful, proceed with saving to DB...
  return {
    errors: {},
    message: 'Account created successfully!',
  };
}

export default function RegistrationForm() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  return (
    <form action={formAction}>
      {state.message && <div>{state.message}</div>}

      <div>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" />
        {/* Display specific field error */}
        {state.errors?.username && (
          <span style={{ color: 'red' }}>{state.errors.username}</span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        {/* Display specific field error */}
        {state.errors?.password && (
          <span style={{ color: 'red' }}>{state.errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}

```

## Why use `useActionState` over `useFormStatus`?

* Use **`useFormStatus`** in a child component when you *only* need to know if the form is submitting (to disable a button or show a spinner).
* Use **`useActionState`** in the parent component when you need to read the data returned by the server (like validation errors, IDs of newly created records, or success banners) and display it in your UI.

How do I clear or reset the form inputs after a successful submission when using useActionState?

Because `useActionState` manages state rather than the DOM, it doesn't automatically clear your form inputs when a submission succeeds.

Since forms using `useActionState` typically rely on uncontrolled inputs (using `name` attributes rather than `value` and `onChange`), you have two main ways to clear the fields after a successful submission.

## Method 1: The `useRef` and `useEffect` Approach (Standard)

The most common approach is to attach a React `ref` to the `<form>` element. You can then watch the `state` returned by your action using a `useEffect` hook. When the state indicates a success, you trigger the native HTML `reset()` method.

```tsx
import { useActionState, useRef, useEffect } from 'react';

async function sendMessage(prevState, formData) {
  const message = formData.get('message');
  
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!message) {
    return { success: false, error: 'Message cannot be empty.' };
  }

  return { success: true, error: null };
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendMessage, {
    success: false, 
    error: null 
  });
  
  // 1. Create a reference to the form
  const formRef = useRef(null);

  // 2. Watch for success state changes
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset(); // Clears all uncontrolled inputs
    }
  }, [state.success]);

  return (
    // 3. Attach the ref to the form element
    <form action={formAction} ref={formRef}>
      <label>
        Message:
        <textarea name="message" disabled={isPending} />
      </label>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </button>

      {state.success && <p style={{ color: 'green' }}>Message sent!</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
    </form>
  );
}

```

---

## Method 2: The `key` Reset Trick (React-Specific)

In React, changing the `key` prop on a component forces React to destroy the old component and completely mount a new one. By attaching a dynamic `key` to your `<form>`, you can force it to remount (and thus clear all inputs) whenever the server returns a new timestamp or unique ID.

This method requires less code and no `useEffect`, making it a very clean alternative.

```tsx
import { useActionState } from 'react';

async function addComment(prevState, formData) {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a new unique timestamp on success
  return { 
    message: 'Comment added!',
    successId: Date.now() 
  };
}

export default function CommentForm() {
  const [state, formAction, isPending] = useActionState(addComment, { 
    message: '',
    successId: 'initial-key' 
  });

  return (
    // The form completely remounts whenever successId changes, 
    // instantly wiping all uncontrolled input values.
    <form action={formAction} key={state.successId}>
      {state.message && <p>{state.message}</p>}

      <input type="text" name="comment" placeholder="Write a comment..." />
      <button type="submit" disabled={isPending}>Submit</button>
    </form>
  );
}

```

### Which should you choose?

* Use **Method 1 (`useRef`)** if your form is highly complex, contains heavy components, or has CSS animations, as destroying and remounting the entire form might cause slight visual jitter.
* Use **Method 2 (`key` prop)** if you want the cleanest code possible and have a relatively simple form where remounting is visually unnoticeable.
