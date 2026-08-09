In pure React 19, data fetching without `useEffect` or third-party state libraries relies on combining **React Server Components (RSC)**, **Promises**, **`<Suspense>`**, and the new **`use()`** API.

There are two primary paradigms depending on whether you are fetching on the **Server** or on the **Client**.

---

## Pattern 1: Direct Async Data Fetching in Server Components (RSC)

The cleanest pattern in React 19 is executing data fetching directly inside an `async` Server Component. Because Server Components run exclusively on the server, you do not need hooks, `useEffect`, or loading flags.

### Step 1: Create the Async Server Component

```tsx
// UserProfile.tsx (Server Component by default)
import { Suspense } from 'react';

// Simulated DB or API call
async function fetchUserData(userId: string) {
  const res = await fetch(`https://api.example.com/users/${userId}`, {
    // Standard web cache or revalidation options
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

async function UserCard({ userId }: { userId: string }) {
  // Direct async/await inside the component body — NO useEffect needed!
  const user = await fetchUserData(userId);

  return (
    <div className="card">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}

```

### Step 2: Wrap with `<Suspense>` in the Parent

To prevent blocking the entire page layout while the data fetches, wrap the async component in `<Suspense>`:

```tsx
// Page.tsx
export default function Page() {
  return (
    <main>
      <h1>User Dashboard</h1>

      {/* React handles loading UI automatically */}
      <Suspense fallback={<div>Loading profile...</div>}>
        <UserCard userId="usr_123" />
      </Suspense>
    </main>
  );
}

```

---

## Pattern 2: Passing Promises from Server to Client with `use()`

If you need a **Client Component** (`'use client'`) to render fetched data (e.g., when the component needs state or interactivity), you pass an **unresolved Promise** from a Server Component into the Client Component and resolve it using React 19’s **`use()`** Hook.

### Step 1: Client Component consuming the Promise with `use()`

```tsx
// InteractiveUserCard.tsx
'use client';

import { use, useState } from 'react';

interface User {
  name: string;
  email: string;
}

export function InteractiveUserCard({
  userPromise,
}: {
  userPromise: Promise<User>;
}) {
  // use() suspends rendering until userPromise resolves.
  // Unlike hooks, use() can even be called conditionally inside if/else blocks!
  const user = use(userPromise);
  const [likes, setLikes] = useState(0);

  return (
    <div className="card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => setLikes((l) => l + 1)}>❤️ Likes: {likes}</button>
    </div>
  );
}

```

### Step 2: Server Component Initiates Fetching (Without `await`)

The parent Server Component initiates the fetch (returning a Promise) and passes it down **without blocking execution**:

```tsx
// Page.tsx (Server Component)
import { Suspense } from 'react';
import { InteractiveUserCard } from './InteractiveUserCard';

function getUserPromise(userId: string): Promise<{ name: string; email: string }> {
  return fetch(`https://api.example.com/users/${userId}`).then((res) => res.json());
}

export default function Page() {
  // Initiate the request on the server (returns a Promise, does not block)
  const userPromise = getUserPromise('usr_123');

  return (
    <main>
      <h1>Interactive Profile Page</h1>

      {/* Suspense handles the pending Promise stream */}
      <Suspense fallback={<div>Loading user data over stream...</div>}>
        <InteractiveUserCard userPromise={userPromise} />
      </Suspense>
    </main>
  );
}

```

---

## Pattern 3: Pure Client-Side Data Fetching (Without Server Components)

If you are running a pure Client-Side Rendered (CSR) Single Page Application without Server Components, you can fetch data inside event transitions or cached Promise creators paired with `use()` and `<Suspense>`.

### The Critical Rule for `use()` on the Client

> ⚠️ **The Promise MUST be created outside the component render phase or cached.**
> If you instantiate a new Promise inside the render function (`use(fetch(...))`), it will create a new Promise on every render, triggering an infinite fetch loop.

### Code Example using a Simple Promise Cache

```tsx
import { use, Suspense, useState, useTransition } from 'react';

// 1. Simple module-level cache map for client promises
const promiseCache = new Map<string, Promise<any>>();

function fetchWithCache(url: string) {
  if (!promiseCache.has(url)) {
    const promise = fetch(url).then((res) => res.json());
    promiseCache.set(url, promise);
  }
  return promiseCache.get(url)!;
}

// 2. Client Component reading the cached promise
function UserDetails({ userId }: { userId: string }) {
  const data = use(fetchWithCache(`/api/user/${userId}`));
  return <div>Username: {data.username}</div>;
}

// 3. Parent Component
export function ClientApp() {
  const [userId, setUserId] = useState('1');
  const [isPending, startTransition] = useTransition();

  const handleUserChange = (newId: string) => {
    // Wrap state updates in startTransition to keep current UI visible while fetching
    startTransition(() => {
      setUserId(newId);
    });
  };

  return (
    <div>
      <button onClick={() => handleUserChange('1')}>User 1</button>
      <button onClick={() => handleUserChange('2')}>User 2</button>

      {isPending && <span> Updating UI...</span>}

      <Suspense fallback={<div>Fetching user details...</div>}>
        <UserDetails userId={userId} />
      </Suspense>
    </div>
  );
}

```

---

## Summary of the Pure React 19 Data-Fetching Mental Model

1. **Server Components:** `await` async functions directly in the component body. Wrap with `<Suspense>` for loading states.
2. **Client Components:** Receive a `Promise` as a prop and read its value using `use(promise)`. Wrap with `<Suspense>` in the parent.
3. **No `useEffect`:** You never need `useEffect` for data fetching on component mount anymore.
4. **No `useState` loading flags:** Loading states are completely declarative and managed by `<Suspense>` fallbacks and `useTransition`.
