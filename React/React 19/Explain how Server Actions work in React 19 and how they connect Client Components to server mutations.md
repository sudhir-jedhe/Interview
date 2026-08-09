**Server Actions** in React 19 are asynchronous functions that run exclusively on the server, but can be imported and invoked directly from Client Components (or HTML forms).

They eliminate the need to manually write API routes (`/api/items`), write fetch calls (`fetch('/api/items', { method: 'POST' })`), or manage HTTP status codes for simple data mutations.

---

## 1. How Server Actions Work Under the Hood

When you define a Server Action using the `'use server'` directive, React and your framework (like Next.js) create an optimized RPC (Remote Procedure Call) endpoint behind the scenes.

```
[ Client Component ]  ─── Invokes serverAction(data) ───►  [ Server Endpoint ]
        ▲                                                          │
        │                                                    Executes Mutation
        │                                                    (Database / API)
        │                                                          │
        └────── Returns updated result / revalidated UI ───────────┘

```

1. **Build Step:** React detects `'use server'` and replaces the function on the client bundle with a lightweight reference ID.
2. **Execution:** When called from the browser, React automatically dispatches a POST request carrying serialized arguments to the server.
3. **Response:** The server executes the function (with full access to databases or secrets), updates server state, and sends the result back to the client.

---

## 2. Defining a Server Action

Server Actions can be declared in two ways:

### Option A: Separate Action File (Shared between Server & Client)

By placing `'use server'` at the top of a file, **every function exported from that file becomes a Server Action**:

```typescript
// app/actions.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addBookmark(formData: FormData) {
  const url = formData.get('url') as string;
  const title = formData.get('title') as string;

  // 1. Direct database mutation on the server
  await db.bookmark.create({
    data: { url, title },
  });

  // 2. Revalidate cached UI data (if using a framework cache)
  revalidatePath('/bookmarks');
}

```

### Option B: Inline inside a Server Component

You can also define Server Actions directly inside a Server Component body:

```tsx
// BookmarkPage.tsx (Server Component)
import { db } from '@/lib/db';

export default async function BookmarkPage() {
  // Inline Server Action
  async function deleteBookmark(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await db.bookmark.delete({ where: { id } });
  }

  return <form action={deleteBookmark}>...</form>;
}

```

---

## 3. Connecting Client Components to Server Actions

Client Components (`'use client'`) cannot execute server code directly, but they can **import and call Server Actions** seamlessly.

React 19 provides multiple ways to invoke Server Actions from Client Components depending on the required level of interactivity:

### Approach 1: Native Form Submission

Pass the Server Action directly to the `<form action={...}>` prop.

```tsx
// AddBookmarkForm.tsx (Client Component)
'use client';

import { addBookmark } from '@/app/actions';

export function AddBookmarkForm() {
  return (
    <form action={addBookmark}>
      <input type="text" name="title" placeholder="Title" required />
      <input type="url" name="url" placeholder="URL" required />
      <button type="submit">Add Bookmark</button>
    </form>
  );
}

```

---

### Approach 2: Using `useActionState` for Pending & Error States

When you need to track loading state or capture error messages returned by the server, pair the action with React 19's **`useActionState`**:

```tsx
// UpdateProfile.tsx (Client Component)
'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/app/actions';

export function UpdateProfile() {
  // useActionState wraps the Server Action
  const [state, formAction, isPending] = useActionState(updateProfile, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction}>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state.success && <p style={{ color: 'green' }}>Profile updated!</p>}

      <input type="text" name="username" disabled={isPending} />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Update'}
      </button>
    </form>
  );
}

```

---

### Approach 3: Invoking Actions Programmatically (e.g., `onClick` or `startTransition`)

Server Actions are standard async JavaScript functions. You can trigger them outside forms inside event handlers using `useTransition`:

```tsx
// LikeButton.tsx (Client Component)
'use client';

import { useTransition } from 'react';
import { toggleLike } from '@/app/actions';

export function LikeButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    // Wrap non-form invocation in startTransition
    startTransition(async () => {
      await toggleLike(postId);
    });
  };

  return (
    <button onClick={handleLike} disabled={isPending}>
      {isPending ? 'Liking...' : '❤️ Like'}
    </button>
  );
}

```

---

## 4. Key Security Rules for Server Actions

Because Server Actions expose public HTTP endpoints under the hood, security must be handled carefully:

1. **Always Validate Inputs:** Never trust client-provided parameters. Validate incoming `FormData` or arguments using libraries like Zod inside the action.
2. **Check Authentication & Authorization:** Ensure the active user session is authorized to perform the action *inside* the Server Action body:

```typescript
'use server';

export async function deletePost(postId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  // Verify ownership
  const post = await db.post.findUnique({ where: { id: postId } });
  if (post.userId !== session.user.id) throw new Error('Forbidden');

  await db.post.delete({ where: { id: postId } });
}

```

1. **Arguments Must Be Serializable:** Because arguments travel over HTTP, you can pass primitives, plain objects, arrays, `FormData`, or `Date` objects—but **not** non-serializable values like JavaScript functions or complex class instances.

---

## Summary

| Aspect                      | Traditional API Route (`fetch`)                                                         | React 19 Server Actions                                                     |
| --------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Boilerplate**             | Create API file (`/api/items`), write `fetch()`, manually serialize/parse JSON.         | Export function with `'use server'` and call it directly.                   |
| **Progressive Enhancement** | Fails completely if JavaScript hasn't loaded yet in the browser.                        | Forms work natively before client JS hydrates.                              |
| **Type Safety**             | Requires manual TypeScript types for request/response payloads.                         | Automatic end-to-end type safety between client caller and server function. |
| **Cache Integration**       | Requires manual cache invalidation on client (e.g., `queryClient.invalidateQueries()`). | Direct integration with framework server cache (e.g., `revalidatePath()`).  |
