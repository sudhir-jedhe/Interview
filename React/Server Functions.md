**Server Functions** (often referred to as Server Actions) are asynchronous functions defined in React that execute securely on the server. They allow client-side components to seamlessly invoke server-side logic (such as database mutations, authentication, or file uploads) without needing to manually write, wire up, or maintain separate REST/GraphQL API endpoints.

---

## 1. Reference & Declaration (`'use server'`)

A function becomes a Server Function when marked with the **`'use server'`** directive. This can be done in two ways:

1. **Inline (inside a Server Component):**

```jsx
async function updateUsername(formData) {
  'use server';
  const newName = formData.get('username');
  await db.users.update({ name: newName });
}

```

1. **Module-level (in a dedicated server file):**

```javascript
// actions.js
'use server';

export async function updateUser(formData) {
  const newName = formData.get('username');
  await db.users.update({ name: newName });
}

```

*Note: Module-level Server Functions can be imported and used in both Server and Client Components.*

---

## 2. Key Usage Scenarios

### Handling Form Submissions

Server Functions are designed to integrate natively with the HTML `<form>` element via the `action` prop. When a user submits the form, React automatically captures all form inputs into a `FormData` object and passes it to the Server Function.

```jsx
import { updateUser } from './actions';

function ProfileForm() {
  return (
    <form action={updateUser}>
      <input name="username" defaultValue="JohnDoe" />
      <button type="submit">Update Profile</button>
    </form>
  );
}

```

### Invoking from Client Components (Event Handlers)

You can import module-level Server Functions directly into Client Components and trigger them from event handlers (like `onClick`) or custom asynchronous workflows.

```jsx
'use client';
import { incrementLikes } from './actions';

export function LikeButton({ postId, likes }) {
  return (
    <button onClick={async () => {
      // Calls the server function directly from the browser!
      await incrementLikes(postId);
    }}>
      Likes: {likes}
    </button>
  );
}

```

### Progressive Enhancement

Because Server Functions rely on native HTML form actions, forms using Server Functions work even if JavaScript hasn't loaded yet or is disabled in the user's browser.

---

## 3. Security & Best Practices

* **Secure by Default:** Code inside a Server Function *never* runs on the client. Database passwords, secret API keys, and internal backend services remain completely hidden from the browser.
* **Automatic RPC Serialization:** React handles serializing arguments passed from client components to server functions and serializing return values back. However, you should treat all inputs coming from client invocations as untrusted and validate them using validation libraries (like Zod) before performing database operations.
