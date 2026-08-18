`nuqs` (Type-safe Search Params for React/Next.js) gives you type-safe URL query state that works like `useState`, but automatically syncs with the browser address bar for shareable, bookmarkable table states.

---

### 1. Installation & Provider Setup

Install `nuqs`:

```bash
npm install nuqs

```

If you are using a standard Single Page App (SPA) with **React Router**, wrap your router with `NuqsAdapter`:

```tsx
import React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'; // or /v7, /next/app, /remix

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}

```

---

### 2. Define Type-Safe Search Param Parsers (`tableParams.ts`)

Define all parsers and their defaults in a single, reusable schema using `useQueryStates`:

```typescript
import {
  parseAsString,
  parseAsInteger,
  parseAsStringEnum,
  parseAsArrayOf,
  createSearchParamsCache,
} from 'nuqs';

export const USER_ROLES = ['admin', 'manager', 'editor', 'viewer'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SORT_FIELDS = ['name', 'createdAt', 'role'] as const;
export type SortField = (typeof SORT_FIELDS)[number];

export const tableSearchParams = {
  // Search query (cleared if empty string)
  q: parseAsString.withDefault('').withOptions({
    throttleMs: 400, // Throttles URL updates during typing
    shallow: true,   // Avoids full page/loader refreshes
  }),

  // Multi-select status/role filter (e.g. ?roles=admin,manager)
  roles: parseAsArrayOf(parseAsStringEnum<UserRole>(Object.values(USER_ROLES))).withDefault([]),

  // Pagination (1-indexed)
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),

  // Sorting
  sortBy: parseAsStringEnum<SortField>(Object.values(SORT_FIELDS)).withDefault('createdAt'),
  sortOrder: parseAsStringEnum(['asc', 'desc'] as const).withDefault('desc'),
};

// Optional: For server-side rendering / route loaders
export const searchParamsCache = createSearchParamsCache(tableSearchParams);

```

---

### 3. Build the Data Table Component (`UsersDataTable.tsx`)

`useQueryStates` binds your table inputs to the URL search params simultaneously.

```tsx
import React from 'react';
import { useQueryStates } from 'nuqs';
import { tableSearchParams, USER_ROLES, UserRole, SORT_FIELDS, SortField } from './tableParams';

// Mock data type
interface User {
  id: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

interface UsersDataTableProps {
  data: User[];
  totalCount: number;
}

export function UsersDataTable({ data, totalCount }: UsersDataTableProps) {
  // 1. Synchronized state with URL params
  const [params, setParams] = useQueryStates(tableSearchParams);

  const totalPages = Math.max(1, Math.ceil(totalCount / params.pageSize));

  // Handler: Update search input & reset page to 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({
      q: e.target.value || null, // null removes the param from the URL
      page: 1, // Reset to first page on new search
    });
  };

  // Handler: Toggle multi-select roles
  const handleRoleToggle = (role: UserRole) => {
    const nextRoles = params.roles.includes(role)
      ? params.roles.filter((r) => r !== role)
      : [...params.roles, role];

    setParams({
      roles: nextRoles.length > 0 ? nextRoles : null,
      page: 1,
    });
  };

  // Handler: Toggle column sort
  const handleSort = (field: SortField) => {
    if (params.sortBy === field) {
      setParams({
        sortOrder: params.sortOrder === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setParams({
        sortBy: field,
        sortOrder: 'asc',
      });
    }
  };

  // Handler: Reset all filters to default
  const handleResetFilters = () => {
    setParams({
      q: null,
      roles: null,
      page: null,
      sortBy: null,
      sortOrder: null,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'sans-serif' }}>
      {/* ── Toolbar: Search & Role Filters ── */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={params.q}
          onChange={handleSearchChange}
          placeholder="Search users..."
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', width: '220px' }}
        />

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Roles:</span>
          {USER_ROLES.map((role) => {
            const isSelected = params.roles.includes(role);
            return (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleToggle(role)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: '1px solid',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderColor: isSelected ? '#2563eb' : '#d1d5db',
                  backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                  color: isSelected ? '#1d4ed8' : '#374151',
                }}
              >
                {role}
              </button>
            );
          })}
        </div>

        {(params.q || params.roles.length > 0) && (
          <button
            type="button"
            onClick={handleResetFilters}
            style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* ── Table Grid ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <th
              onClick={() => handleSort('name')}
              style={{ padding: '10px 12px', cursor: 'pointer', userSelect: 'none' }}
            >
              Name {params.sortBy === 'name' ? (params.sortOrder === 'asc' ? '▲' : '▼') : '↕'}
            </th>
            <th
              onClick={() => handleSort('role')}
              style={{ padding: '10px 12px', cursor: 'pointer', userSelect: 'none' }}
            >
              Role {params.sortBy === 'role' ? (params.sortOrder === 'asc' ? '▲' : '▼') : '↕'}
            </th>
            <th
              onClick={() => handleSort('createdAt')}
              style={{ padding: '10px 12px', cursor: 'pointer', userSelect: 'none' }}
            >
              Created At {params.sortBy === 'createdAt' ? (params.sortOrder === 'asc' ? '▲' : '▼') : '↕'}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                No records matching your search/filters.
              </td>
            </tr>
          ) : (
            data.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 12px' }}>{user.name}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ padding: '2px 8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '12px' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', color: '#6b7280' }}>{user.createdAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ── Pagination Footer ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
        <span style={{ color: '#6b7280' }}>
          Page {params.page} of {totalPages} ({totalCount} total results)
        </span>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            disabled={params.page <= 1}
            onClick={() => setParams({ page: params.page - 1 })}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }}
          >
            Previous
          </button>

          <button
            type="button"
            disabled={params.page >= totalPages}
            onClick={() => setParams({ page: params.page + 1 })}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }}
          >
            Next
          </button>

          <select
            value={params.pageSize}
            onChange={(e) => setParams({ pageSize: Number(e.target.value), page: 1 })}
            style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}

```

---

### 4. Wire with TanStack Query (Data Fetching Integration)

Feed `params` directly into your query key to achieve automatic refetching, query cancellation, and caching per filter combination:

```tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { tableSearchParams } from './tableParams';
import { UsersDataTable } from './UsersDataTable';

export function UsersPage() {
  const [params] = useQueryStates(tableSearchParams);

  // TanStack Query refetches automatically whenever any URL parameter changes
  const { data, isLoading } = useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params.q) query.set('q', params.q);
      if (params.roles.length) query.set('roles', params.roles.join(','));
      query.set('page', String(params.page));
      query.set('pageSize', String(params.pageSize));
      query.set('sortBy', params.sortBy);
      query.set('sortOrder', params.sortOrder);

      const res = await fetch(`/api/users?${query.toString()}`);
      return res.json();
    },
  });

  if (isLoading) return <div>Loading users...</div>;

  return <UsersDataTable data={data?.items ?? []} totalCount={data?.total ?? 0} />;
}

```

---

### Key Advantages of this Setup

* **Clean URL Formatting:** Setting a value to `null` or its configured `withDefault()` value removes the key from the query string (e.g. `?page=1` is stripped, leaving clean URLs like `/users`).
* **Built-in Throttling:** `throttleMs: 400` avoids flooding browser history entries on fast keystrokes while keeping user typing responsive.
* **Shallow Routing:** `shallow: true` avoids remounting route layouts or triggering top-level data loaders.
