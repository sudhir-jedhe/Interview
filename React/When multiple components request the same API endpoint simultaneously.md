When **multiple components request the same API endpoint simultaneously or repeatedly**, making duplicate network calls degrades application performance and overloads the server.

To avoid duplicate network requests and achieve **Caching**, **Background Updates**, and **Request Deduplication**, you can use the following battle-tested solutions:

---

### Key Architectural Concepts

```text
┌────────────────────────────────────────────────────────┐
│ MULTIPLE COMPONENTS CALLING SAME API                   │
│ Component A ──┐                                        │
│ Component B ──┼──► [ Request Deduplication Layer ]     │
│ Component C ──┘              │                         │
└──────────────────────────────┼─────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       [ Read from Cache ]           [ Single Network Fetch ]
     (Instant UI Response)           (Fires only 1 request)

```

---

### Solution 1: TanStack Query (React Query) — The Industry Standard

Using **TanStack Query** (or **RTK Query**) is the most modern, production-grade way to handle server state in React.

It solves all three problems out-of-the-box:

1. **Request Deduplication:** If 5 components call `useQuery(['users'])` at the exact same millisecond on mount, React Query intercepts them and fires **only 1 network request**, broadcasting the result to all 5 listeners.
2. **Smart Caching:** Stores the API response in an in-memory cache mapped by a unique `queryKey`.
3. **Background Updates (Stale-While-Revalidate):** Instantly serves cached data while silently refetching fresh data in the background if the data is considered "stale" (`staleTime`).

#### Code Example

```jsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUsers = async () => {
  const { data } = await axios.get('/api/users');
  return data;
};

// Component A
function ComponentA() {
  const { data } = useQuery({
    queryKey: ['users'], // Shared cache key
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes (no extra network calls)
  });

  return <div>Users Count: {data?.length}</div>;
}

// Component B (Rendered on the same or another page)
function ComponentB() {
  // Shares the EXACT SAME queryKey! Zero extra API calls fired.
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

```

---

### Solution 2: Custom In-Memory Cache with Promise Deduplication (Zero Third-Party Libraries)

If you cannot install external libraries, you can implement **In-flight Request Deduplication** and **In-Memory Caching** using JavaScript `Map` objects.

#### How Promise Deduplication Works

Instead of caching only the *data*, you also cache the active **`Promise` instance**. If a request is currently pending ("in-flight"), subsequent callers receive and `await` the **same exact promise**.

```javascript
// apiService.js
const cache = new Map();
const inFlightRequests = new Map();

export async function fetchUsersWithCache() {
  const cacheKey = 'users';

  // 1. Caching: Return cached data immediately if available
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  // 2. Request Deduplication: If a request is already pending, return the active Promise
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  // 3. Initiate Single Network Request
  const requestPromise = fetch('/api/users')
    .then((res) => res.json())
    .then((data) => {
      cache.set(cacheKey, data); // Store result in cache
      inFlightRequests.delete(cacheKey); // Clean up active promise
      return data;
    })
    .catch((err) => {
      inFlightRequests.delete(cacheKey);
      throw err;
    });

  // Track the pending promise
  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

```

---

### Solution 3: Global State Management (Redux Toolkit / React Context)

If your project already uses Redux or Context API:

1. **Component A** triggers an action/thunk to fetch data on mount.
2. The fetched data is saved in the **Redux Store** or **Context State**.
3. **Component B** checks if `store.users` already contains data before dispatching another API request. If data exists, it reads directly from `useSelector`.

---

### Solution 4: HTTP Browser Caching & Service Workers

At the network layer, you can leverage native HTTP caching headers sent by the backend:

* **`Cache-Control: max-age=300, stale-while-revalidate=60`**
* When this header is set, the browser automatically caches the HTTP response. Subsequent component calls within 300 seconds will be served directly from the browser's disk/memory cache.

---

### Strategy Comparison Summary

| Approach                       | Request Deduplication | Background Revalidation            | Best Use Case                                  |
| ------------------------------ | --------------------- | ---------------------------------- | ---------------------------------------------- |
| **TanStack Query / RTK Query** | ✅ Automatic           | ✅ Configurable (`staleTime`)       | **Recommended for all modern React apps**      |
| **Custom Promise Map**         | ✅ Manual              | ❌ Manual implementation required   | Light projects with zero-dependency constraint |
| **Redux Store / Context**      | ⚠️ Manual check needed | ❌ Requires manual timer or trigger | Apps already heavily built around Redux        |
| **HTTP Browser Caching**       | ⚠️ Managed by browser  | ✅ via `stale-while-revalidate`     | Static or semi-static REST APIs                |
