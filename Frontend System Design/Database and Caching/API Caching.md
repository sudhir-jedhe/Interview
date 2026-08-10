In Front-End System Design, **API Caching** is the technique of storing the HTTP responses of backend API calls in memory or local client storage so that subsequent requests for the exact same resource can be fulfilled instantly without making a network round-trip to the server.

By caching API responses effectively, front-end applications achieve **sub-millisecond UI rendering**, drastically reduce backend infrastructure costs, eliminate loading spinners, and maintain responsiveness even on slow or spotty networks.

---

## 1. API Caching Strategies at a Glance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FRONT-END API CACHING MATRIX                          │
│                                                                             │
│  1. STALE-WHILE-REVALIDATE (Recommended Default)                             │
│     • Serves cached data instantly; refetches fresh data in background.     │
│                                                                             │
│  2. CACHE-FIRST / OFFLINE-FIRST                                             │
│     • Checks cache first; hits network ONLY if cache is missing/expired.    │
│                                                                             │
│  3. NETWORK-FIRST                                                           │
│     • Tries fresh API request first; falls back to cache on failure.         │
│                                                                             │
│  4. OPTIMISTIC MUTATIONS WITH CACHE UPDATES                                 │
│     • Updates client cache instantly on user action; rolls back on failure. │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Implementing API Caching in React

In modern React applications, writing custom `useEffect` fetchers with manual state variables (`isLoading`, `data`, `error`) is an anti-pattern for caching because it lacks in-memory deduplication, garbage collection, and stale-time management.

Instead, modern React architectures use dedicated **Data Fetching & Caching Engines** like **TanStack Query (React Query)** or **SWR**.

---

### Strategy 1: Stale-While-Revalidate with TanStack Query (React Query)

TanStack Query manages an in-memory key-value cache indexed by a unique `queryKey` array.

#### Setting up the Provider (`src/App.tsx`)

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Create a central QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains "fresh" for 5 minutes (no background re-fetching)
      gcTime: 1000 * 60 * 30,    // Unused cache data remains in memory for 30 minutes
      refetchOnWindowFocus: true, // Revalidates cache when user refocuses browser tab
      retry: 2,                  // Auto-retry failed network calls twice
    },
  },
});

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProfile userId="usr_101" />
  </QueryClientProvider>
);

```

#### Consuming the Cached Query (`src/components/UserProfile.tsx`)

```tsx
// src/components/UserProfile.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';

async function fetchUserProfile(userId: string) {
  const res = await fetch(`/api/v1/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export const UserProfile = ({ userId }: { userId: string }) => {
  const { data, isPending, error, isFetching } = useQuery({
    queryKey: ['user', userId], // Unique cache key tuple
    queryFn: () => fetchUserProfile(userId),
  });

  if (isPending) return <div className="skeleton-loader">Loading profile...</div>;
  if (error) return <div role="alert">Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>Email: {data.email}</p>
      {/* Background revalidation indicator */}
      {isFetching && <small className="syncing-indicator">Updating in background...</small>}
    </div>
  );
};

```

---

### Strategy 2: Cache Invalidation & Mutations

When a user performs an action that modifies server state (e.g., updating their profile name or posting a comment), the front-end must **invalidate the affected cache key** so that dependent UI views automatically re-fetch fresh data.

```tsx
// src/components/EditProfileForm.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

async function updateUserProfile({ userId, name }: { userId: string; name: string }) {
  const res = await fetch(`/api/v1/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export const EditProfileForm = ({ userId }: { userId: string }) => {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      // 1. Invalidate cache key matching ['user', userId]
      // 2. Automatically triggers background refetch for any active UserProfile components
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ userId, name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New Name" />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Update Name'}
      </button>
    </form>
  );
};

```

---

### Strategy 3: Optimistic Updates (Zero-Latency UI)

For instant responsiveness, update the client-side cache **immediately** when the user performs an action (e.g., liking a post), assuming the API call will succeed. If the API request fails, roll back the cache to its previous snapshot.

```tsx
// Optimistic Cache Mutation Pattern
const mutation = useMutation({
  mutationFn: updateBookmarkAPI,
  // 1. Triggered right before network request fires
  onMutate: async (newBookmark) => {
    // Cancel outgoing refetches so they don't overwrite optimistic update
    await queryClient.cancelQueries({ queryKey: ['bookmarks'] });

    // Snapshot current cache state for rollback on error
    const previousBookmarks = queryClient.getQueryData(['bookmarks']);

    // Optimistically update cache state immediately
    queryClient.setQueryData(['bookmarks'], (old: any) => [...old, newBookmark]);

    // Return context object with snapshot
    return { previousBookmarks };
  },
  // 2. If API fails, roll back cache to previous snapshot
  onError: (err, newBookmark, context) => {
    queryClient.setQueryData(['bookmarks'], context?.previousBookmarks);
  },
  // 3. Always refetch after error or success to ensure server sync
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
  },
});

```

---

### Strategy 4: Persisting API Cache to Disk (`IndexedDB` / `localStorage`)

To preserve API caches across full browser restarts or tab closes, wrap your React Query client with a persistent storage adapter:

```typescript
// src/testing/persister.ts
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Persist query cache directly to localStorage or IndexedDB
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // Keep offline cache valid for 24 hours
});

```

---

## 3. Comparing React API Caching Solutions

| Feature                    | Custom `useEffect` + State                | TanStack Query / SWR                        | Service Worker (`CacheStorage`) |
| -------------------------- | ----------------------------------------- | ------------------------------------------- | ------------------------------- |
| **Primary Scope**          | Single Component Instance                 | Application Memory Cache                    | Browser Network Level Proxy     |
| **Request Deduplication**  | ❌ No (Triggers duplicate fetch per mount) | **✅ Yes** (Consolidates concurrent fetches) | ❌ No                            |
| **Stale-While-Revalidate** | Manual implementation required            | **✅ Built-in**                              | Requires custom SW script       |
| **Offline Persistence**    | ❌ None                                    | **✅ Supported** (via Storage adapters)      | **✅ Native** (Full PWA support) |
| **Ease of Setup**          | Low (Verbose & error-prone)               | **Very Easy** (Declarative hooks)           | Moderate to High                |

---

## Key Best Practices for Front-End API Caching

1. **Structure Query Keys Hierarchy:** Use arrays for query keys (e.g., `['products', 'list', { category: 'shoes' }]`). This allows granular invalidation (invalidating `['products']` clears all product lists simultaneously).
2. **Set Appropriate `staleTime`:** Avoid setting `staleTime: 0` for static or slow-changing data (like user permissions or country lists). A modest `staleTime` of 5–15 minutes eliminates thousands of redundant backend API requests.
3. **Handle Server Mutations Gracefully:** Always invalidate or optimistically update related cache keys after successful `POST`, `PUT`, `PATCH`, or `DELETE` operations.
