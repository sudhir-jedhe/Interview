<https://react.dev/reference/react-dom/components/form>

Here is the recreated and cleanly formatted reference guide for the modern React `<form>` component based on your provided documentation.

## The `<form>` Component

The built-in browser `<form>` component lets you create interactive controls for submitting information. In modern React, the `<form>` element has been upgraded to support passing functions directly to the `action` prop, enabling seamless transitions, server actions, and progressive enhancement.

### Props and Caveats

* **`action`**: Accepts a URL or a function.
* *URL:* Behaves like a standard HTML form.
* *Function:* Handles form submission in a Transition. The function can be asynchronous and automatically receives a `FormData` object.

* **`formAction`**: Can be used on `<button>`, `<input type="submit">`, or `<input type="image">` to override the `<form>`'s main `action`.
* **Caveat**: When a function is passed to `action` or `formAction`, the HTTP method will automatically be `POST`, regardless of the `method` prop.

---

## Usage Guide

### 1. Handle Form Submission with an Action Prop (Modern React)

Pass a function to the `action` prop to run it upon submission. React automatically passes the `FormData` to your function. Unlike traditional event handlers, this runs in a Transition, does not require `e.preventDefault()`, and automatically resets uncontrolled fields when successful.

```jsx
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}

```

### 2. Handle Form Submission with a Server Function

You can pass a Server Function (marked with `'use server'`) to the `action` prop. This allows users to submit forms even before JavaScript has loaded or if it is disabled, providing progressive enhancement.

You can use hidden inputs or the `.bind` method to pass additional arguments (like an ID) to the server function.

```jsx
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  // Binding the ID directly to the server action
  const addProductToCart = updateCart.bind(null, productId);
  
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}

```

### 3. Display a Pending State

Use the `useFormStatus` hook inside a child component of the form to read the submission state. This is perfect for disabling buttons or showing a "Submitting..." indicator.

```jsx
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

export default function App() {
  return (
    <form action={submitForm}>
      <SubmitButton />
    </form>
  );
}

```

### 4. Optimistically Updating Form Data

The `useOptimistic` hook updates the UI instantly before a background network request completes. This makes your application feel much faster, as users see their changes immediately.

```jsx
import { useOptimistic, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { text: newMessage, sending: true }]
  );

  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }

  return (
    <>
      {optimisticMessages.map((msg, idx) => (
        <div key={idx}>
          {msg.text} {msg.sending && <small>(Sending...)</small>}
        </div>
      ))}
      
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

```

### 5. Display Form Submission Errors without JavaScript

To display server errors with progressive enhancement (working without JavaScript), render a Client Component, pass a Server Function, and use the `useActionState` hook.

```jsx
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      return null; // Success
    } catch (err) {
      return err.toString(); // Return error to state
    }
  }
  
  const [errorMessage, signupAction] = useActionState(signup, null);
  
  return (
    <form action={signupAction}>
      <input name="email" placeholder="react@example.com" />
      <button>Sign up</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  );
}

```

### 6. Handling Multiple Submission Types

If your form has multiple buttons (e.g., "Publish" and "Save Draft"), you can assign different actions directly to the buttons using the `formAction` attribute. The button pressed dictates which function runs.

```jsx
export default function Editor() {
  function publish(formData) {
    alert(`Published: ${formData.get("content")}`);
  }

  function save(formData) {
    alert(`Draft saved: ${formData.get("content")}`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} />
      
      {/* Uses the form's default 'publish' action */}
      <button type="submit">Publish</button>
      
      {/* Overrides the form action with the 'save' function */}
      <button formAction={save}>Save draft</button>
    </form>
  );
}

```

### 7. Traditional Event Handlers (Legacy Approach)

While actions are the modern standard, you can still use the traditional `onSubmit` handler. If you do, you must manually prevent the default browser refresh using `e.preventDefault()`. Note that this approach does not support Server Functions or automatic pending states.

```jsx
export default function Search() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    alert(`You searched for '${formData.get("query")}'`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}

```
