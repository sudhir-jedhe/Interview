**`'use server'`** is a directive used in React Server Components (RSC) architecture to mark server-side functions that can be invoked securely from client-side code (or server-side code). It forms the foundation of **Server Actions**, enabling seamless Remote Procedure Calls (RPC) between the browser and your server without manual API endpoint setup.

---

## 1. Reference & How It Works

### `'use server'` Directive

* Placing `'use server'` at the top of an asynchronous function (or at the top of a dedicated module file) instructs the compiler to treat that function as a **Server Function**.
* **Module-level:** When placed at the very top of a file (`'use server';`), every exported function in that file becomes a Server Function, which can be imported and called from both Server and Client Components.
* **Inline:** When placed inside a function body (`async function myAction() { 'use server'; ... }`), it marks that specific function as a server action.

---

## 2. Security Considerations

* **Never trust the client:** Because Server Functions can be invoked directly from the browser (e.g., via event handlers or form submissions), malicious users can inspect network requests and attempt to pass arbitrary arguments.
* **Validation is mandatory:** Always validate and sanitize all incoming parameters using validation libraries (like Zod) before performing database queries or mutations.
* **Authentication & Authorization:** Always check session state and user permissions inside the Server Function before executing sensitive business logic.

---

## 3. Serializable Arguments and Return Values

Because Server Functions bridge the network boundary between the client and server, all arguments passed to them from the client—and all values returned from the server back to the client—must be **serializable**:

* **Allowed:** Primitives (strings, numbers, booleans, null, undefined), plain objects, arrays, and `FormData` instances.
* **Not Allowed:** Functions, class instances, DOM nodes, or un-serializable binary streams (unless handled via specialized web APIs like `Response` or `FormData`).

---

## 4. Usage Scenarios

### Server Functions in forms

Server Functions integrate natively with HTML `<form>` elements via the `action` prop. React automatically captures all form inputs into a `FormData` object and submits it to the server function.

```jsx
// actions.js
'use server';

export async function updateProfile(formData) {
  const username = formData.get('username');
  await db.users.update({ username });
}

```

```jsx
// ProfileForm.jsx (Client or Server Component)
import { updateProfile } from './actions';

export default function ProfileForm() {
  return (
    <form action={updateProfile}>
      <input name="username" defaultValue="Sudhir" />
      <button type="submit">Save Changes</button>
    </form>
  );
}

```

### Calling a Server Function outside of `<form>`

You can import module-level Server Functions directly into Client Components and trigger them asynchronously from event handlers (like `onClick`) or custom UI workflows (such as upvoting, deleting an item, or triggering background jobs).

```jsx
// actions.js
'use server';

export async function deleteItem(itemId) {
  await db.items.delete({ where: { id: itemId } });
  return { success: true };
}

```

```jsx
// DeleteButton.jsx ('use client')
'use client';

import { deleteItem } from './actions';
import { useTransition } from 'react';

export default function DeleteButton({ itemId }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await deleteItem(itemId);
          if (res.success) {
            console.log('Item deleted successfully!');
          }
        });
      }}
    >
      {isPending ? 'Deleting...' : 'Delete Item'}
    </button>
  );
}

```
