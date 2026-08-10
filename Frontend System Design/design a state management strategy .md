A scalable front-end state management strategy categorizes state by **ownership, lifetime, and source of truth** rather than stuffing everything into a single central store.

By categorizing state into distinct layers, you prevent unnecessary re-renders, simplify component testing, and reduce state synchronization bugs.

---

## 1. The Four Categories of Front-End State

```
                      ┌───────────────────────────┐
                      │    Categories of State    │
                      └─────────────┬─────────────┘
                                    │
    ┌──────────────────┬────────────┴─────────────┬──────────────────┐
    ▼                  ▼                          ▼                  ▼
 Server State      Global State               Local State         URL State
(Remote Cache)   (Cross-Cutting)            (UI / Component)    (Route / Query)

```

| State Category   | Definition & Scope                                                                           | Primary Responsibilities                                                                | Standard Solutions                                                     |
| ---------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Server State** | Asynchronous data from an external source (API). Owned remotely; client holds a cached copy. | Fetching, caching, deduplication, revalidation, optimistic updates.                     | TanStack Query (React Query), RTK Query, SWR, Apollo Client.           |
| **Global State** | Sync client-only state needed across unrelated components or deep trees.                     | Theme selection, current user session/roles, active modal/drawer stacks, feature flags. | Zustand, Redux Toolkit, Jotai, React Context (for low-velocity data).  |
| **Local State**  | UI state localized to a single component or tight component subtree.                         | Form input fields, toggle open/close states, active tab indexes, hover states.          | Framework primitives (`useState`, `useReducer`), Component DOM refs.   |
| **URL State**    | State reflected in and driven by the browser address bar.                                    | Search queries, pagination page/limit, filter selections, active view tabs.             | React Router, Next.js `useSearchParams`, Nuxt Router, TanStack Router. |

---

## 2. Decision Tree: Where Should State Live?

When adding a piece of state to a component, follow this decision matrix to determine its correct home:

1. **Does the data originate from an external API or database?**

* **Yes:** Treat as **Server State**. Use an asynchronous cache library. Do *not* copy this into Redux or local state unless mutating offline.
* **No:** Proceed to step 2.

1. **Should the current view be bookmarkable or shareable via URL?**

* **Yes:** Treat as **URL State**. Sync state with search params (e.g., `?page=2&filter=active`).
* **No:** Proceed to step 3.

1. **Is this state consumed by multiple components in unrelated DOM branches?**

* **Yes:** Treat as **Global State**. Place in a lightweight global store or context.
* **No:** Proceed to step 4.

1. **Is this state used strictly by this component or its immediate children?**

* **Yes:** Treat as **Local State**. Keep it inside the component or lift it up one parent level max.

---

## 3. Core Architectural Rules

### Rule 1: Never Sync Server State into Global Client Stores

Manually dispatching actions to put API responses into a global Redux or Zustand store forces you to manually manage cache invalidation, loading states, and race conditions.

* **Anti-Pattern:** `fetchUser().then(data => dispatch(setUserData(data)))`
* **Best Practice:** Use a dedicated server state manager that keys cache entries automatically (e.g., `useQuery({ queryKey: ['user', id], queryFn: fetchUser })`).

### Rule 2: Derive State Instead of Duplicating It

If a value can be computed from existing state or props, calculate it on the fly (or memoize it). Storing derived values in state creates synchronization bugs.

```typescript
// ❌ BAD: Redundant state sync
const [items, setItems] = useState<Item[]>([]);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

// ✅ GOOD: Store primitive key, derive the value
const [items, setItems] = useState<Item[]>([]);
const [selectedId, setSelectedId] = useState<string | null>(null);

const selectedItem = useMemo(
  () => items.find((item) => item.id === selectedId) ?? null,
  [items, selectedId]
);

```

### Rule 3: Minimize React Context for High-Velocity Global State

React Context is a dependency injection mechanism, not a full-fledged state management engine. Updating a Context value causes **every consuming component to re-render**, regardless of whether they use the modified property.

* **Use Context for:** Low-velocity data (Theme, Current Locale, Auth User Profile).
* **Use Atomic/Selector Stores for:** High-velocity data (Audio playback position, canvas cursors, complex real-time forms).

---

## 4. Architectural Summary Layering

```
┌─────────────────────────────────────────────────────────────┐
│ Components / Views                                          │
│  └── Local UI State (useState / useReducer)                 │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────┐┌──────────────────────────────┐
│ URL State Manager           ││ Global Store (Atomic / Slice)│
│ (Search Params / Router)    ││ (Zustand / Jotai / Redux)    │
└─────────────────────────────┘└──────────────────────────────┘
               │                              │
               └──────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Server State Manager (Cache Layer)                          │
│ (TanStack Query / RTK Query)                                │
└─────────────────────────────┬───────────────────────────────┘
                              ▼
                     REST / GraphQL / gRPC

```

This practical example demonstrates the separation of **Server State** (handled asynchronously by TanStack Query) and **Local Component State** (handled synchronously by React primitives).

In this scenario, a **UserProfileEditor** component fetches user data from an API, manages local form edits without polluting the remote cache prematurely, handles optimistic UI updates, and cleanly surfaces server errors.

---

### Implementation Example

```tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ============================================================================
// 1. TYPES & API SERVICES
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
}

interface UpdateUserDTO {
  name: string;
  bio: string;
}

// Simulated API Service
const api = {
  fetchUser: async (userId: string): Promise<User> => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to load user profile');
    return response.json();
  },
  updateUser: async ({ userId, data }: { userId: string; data: UpdateUserDTO }): Promise<User> => {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user profile');
    return response.json();
  },
};

// ============================================================================
// 2. CUSTOM HOOKS (SERVER STATE LAYER)
// ============================================================================

/** Encapsulates Server State fetching */
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => api.fetchUser(userId),
    staleTime: 1000 * 60 * 5, // Cache remains fresh for 5 minutes
  });
}

/** Encapsulates Server State mutations and cache updates */
export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDTO) => api.updateUser({ userId, data }),
    // Optimistic cache update before server confirms
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['users', userId] });
      const previousUser = queryClient.getQueryData<User>(['users', userId]);

      if (previousUser) {
        queryClient.setQueryData<User>(['users', userId], {
          ...previousUser,
          ...newData,
        });
      }

      return { previousUser };
    },
    // Rollback on failure
    onError: (_err, _newData, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['users', userId], context.previousUser);
      }
    },
    // Always sync with true server response after settling
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
    },
  });
}

// ============================================================================
// 3. PRESENTATIONAL & SMART COMPONENT (LOCAL + SERVER STATE COMBINED)
// ============================================================================

interface UserProfileEditorProps {
  userId: string;
}

export const UserProfileEditor: React.FC<UserProfileEditorProps> = ({ userId }) => {

  // --- SERVER STATE ---
  const { data: user, isLoading, isError, error } = useUser(userId);
  const updateUserMutation = useUpdateUser(userId);

  // --- LOCAL UI STATE ---
  // Draft values isolated from the global server cache until explicit submit
  const [formData, setFormData] = useState<UpdateUserDTO>({ name: '', bio: '' });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync server state to local form draft when server data initially arrives or refreshes
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, bio: user.bio });
    }
  }, [user]);

  // Local Form Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError(null); // Clear local errors on user input
  };

  const handleCancel = () => {
    if (user) {
      setFormData({ name: user.name, bio: user.bio }); // Reset to server truth
    }
    setIsEditing(false);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Local state validation guard
    if (formData.name.trim().length < 2) {
      setValidationError('Name must be at least 2 characters long.');
      return;
    }

    // Trigger Server State mutation
    updateUserMutation.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false); // Update local UI state on success
      },
    });
  };

  // --- RENDER STATES ---

  if (isLoading) return <div className="p-4 text-gray-500">Loading profile...</div>;
  if (isError) return <div className="p-4 text-red-500">Error: {(error as Error).message}</div>;
  if (!user) return null;

  return (
    <div className="max-w-md p-6 bg-white rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">User Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Server Email - Read Only (Server State Truth) */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase">Email</label>
        <p className="text-gray-700 font-mono">{user.email}</p>
      </div>

      {isEditing ? (
        /* EDIT MODE: Local state driving form fields */
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">
              {validationError}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              disabled={updateUserMutation.isPending}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              disabled={updateUserMutation.isPending}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={updateUserMutation.isPending}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* READ-ONLY MODE: Server state driving UI view */
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Name</label>
            <p className="text-gray-900 font-medium">{user.name}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Bio</label>
            <p className="text-gray-600">{user.bio || 'No bio provided.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

```

---

### Core Architectural Mechanics Highlighted

1. **Local Isolation vs. Server Synchronization:**

* `user` (Server State) is fetched via `useUser` and treated as immutable read-only cache data.
* `formData` (Local State) holds editable text fields. Editing a text field does **not** cause re-fetches or prematurely mutate the shared server cache.

1. **Explicit Lift-Off:**

* Clicking **Cancel** discards `formData` and resets it back to `user` (Server State).
* Submitting passes `formData` down to `useUpdateUser`, transitioning local edits into server updates.

1. **Optimistic Updates & Resilience:**

* `onMutate` instantly writes draft changes into TanStack Query's cache so UI elements outside this form reflect the updated user data without waiting for network round-trips.
* `onError` rolls back the server cache to its `previousUser` snapshot if the request fails.

Show how to integrate URL State (search params) alongside TanStack Query for filtering and paginated API requests.

Integrating **URL State** (search parameters) as the **single source of truth** for filters and pagination alongside **TanStack Query** creates shareable, bookmarkable, and back-button-friendly interfaces.

Instead of duplicating search inputs and page numbers in local `useState`, the UI reads directly from the URL. Updating a filter updates the URL, which automatically triggers a re-fetch via TanStack Query.

---

### Implementation Example (React Router + TanStack Query)

```tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

// ============================================================================
// 1. TYPES & API API LAYER
// ============================================================================

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface ProductResponse {
  data: Product[];
  totalCount: number;
  totalPages: number;
}

interface ProductFilters {
  search: string;
  category: string;
  page: number;
  limit: number;
}

// Fetcher accepting URL parameters
const fetchProducts = async (filters: ProductFilters): Promise<ProductResponse> => {
  const params = new URLSearchParams({
    q: filters.search,
    category: filters.category,
    _page: String(filters.page),
    _limit: String(filters.limit),
  });

  const response = await fetch(`/api/products?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

// ============================================================================
// 2. CUSTOM HOOK: SYNCING URL PARAMS WITH TANSTACK QUERY
// ============================================================================

export function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract and normalize URL parameters with safe defaults
  const filters: ProductFilters = {
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || 'all',
    page: Number(searchParams.get('page')) || 1,
    limit: 10,
  };

  // Helper to update specific URL search params safely
  const updateFilters = (newParams: Partial<Record<keyof ProductFilters, string | number>>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === '' || value === 'all' || value === undefined || value === null) {
          next.delete(key); // Keep URL clean by deleting default/empty values
        } else {
          next.set(key, String(value));
        }
      });

      // Reset to page 1 whenever search query or category filter changes
      if (newParams.search !== undefined || newParams.category !== undefined) {
        next.set('page', '1');
      }

      return next;
    });
  };

  // TanStack Query driven directly by URL filter values
  const query = useQuery({
    // Include full filter object in queryKey so changes automatically trigger re-fetches
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: keepPreviousData, // Keeps old data visible while fetching next page
    staleTime: 1000 * 60 * 2,
  });

  return {
    ...query,
    filters,
    updateFilters,
  };
}

// ============================================================================
// 3. PAGINATED & FILTERABLE PRODUCT TABLE COMPONENT
// ============================================================================

export const ProductList: React.FC = () => {
  const { data, isLoading, isPlaceholderData, filters, updateFilters } = useProducts();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Product Catalog</h1>

      {/* FILTER BAR: Direct mutation of URL State */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg border">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value })}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>
        </div>
      </div>

      {/* TABLE DATA DISPLAY */}
      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading products...</div>
      ) : (
        <div className={`transition-opacity ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
          <table className="w-full text-left border-collapse border">
            <thead>
              <tr className="bg-gray-100 border-b text-sm font-semibold text-gray-700">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.data.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3 capitalize">{product.category}</td>
                  <td className="p-3">${product.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-sm text-gray-600">
          Page <strong className="text-gray-900">{filters.page}</strong> of{' '}
          <strong className="text-gray-900">{data?.totalPages || 1}</strong>
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => updateFilters({ page: filters.page - 1 })}
            disabled={filters.page === 1 || isPlaceholderData}
            className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => updateFilters({ page: filters.page + 1 })}
            disabled={filters.page >= (data?.totalPages || 1) || isPlaceholderData}
            className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

```

---

### Key System Architecture Patterns Used

1. **`queryKey` Driven Invalidation:**
By passing the derived `filters` object inside `queryKey: ['products', filters]`, TanStack Query treats every URL parameter change as a distinct cache key. When `updateFilters` changes the URL, the component re-renders, recalculates `filters`, and automatically fires a new request.
2. **`placeholderData: keepPreviousData`:**
Prevents jarring UI blankouts or loader flashes when flipping pages. The UI keeps displaying Page 1 results slightly dimmed (`isPlaceholderData`) until Page 2 finishes loading in the background.
3. **Smart Reset Logic:**
Changing search input or category resets `page=1` inside `updateFilters`. This prevents users from getting stuck on `page=10` when a filter reduces total results to 1 page.
4. **URL Cleanliness:**
Default or empty filter parameters (e.g., `q=""` or `category="all"`) are automatically scrubbed from the URL bar to keep links clean (`/products?page=2`).
