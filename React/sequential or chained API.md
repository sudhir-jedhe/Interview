Structuring dependent (sequential or chained) API calls cleanly in React comes down to whether you want to manage them **imperatively inside an effect/event handler** or **declaratively using modern data-fetching hooks**.

Here are the standard, production-ready approaches depending on your architectural choices.

---

## Scenario: The Dependent API Requirement

Imagine a scenario where:

1. **API 1:** Fetch a user profile (`/api/user/123`).
2. **API 2:** Use `user.organizationId` from API 1 to fetch organization details (`/api/orgs/:id`).
3. **API 3:** Use `org.defaultProjectId` from API 2 to fetch project analytics (`/api/projects/:id/analytics`).

---

## Approach 1: Sequential Async/Await in a Single Effect (Native React)

If you are using plain React state (`useState` + `useEffect`) without third-party query libraries, **do not write nested `.then()` callbacks or separate dependent `useEffect` blocks.**

Instead, write a single `async` function inside `useEffect` and await each API call sequentially.

```tsx
import { useState, useEffect } from "react";

export function DependentFetchComponent({ userId }: { userId: string }) {
  const [data, setData] = useState<{
    user: any;
    org: any;
    analytics: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Controller to handle unmount cleanups / race conditions
    const controller = new AbortController();

    async function fetchChainedData() {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch User
        const userRes = await fetch(`/api/users/${userId}`, {
          signal: controller.signal,
        });
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const user = await userRes.json();

        // Step 2: Fetch Organization (depends on user.organizationId)
        const orgRes = await fetch(`/api/orgs/${user.organizationId}`, {
          signal: controller.signal,
        });
        if (!orgRes.ok) throw new Error("Failed to fetch organization");
        const org = await orgRes.json();

        // Step 3: Fetch Analytics (depends on org.defaultProjectId)
        const analyticsRes = await fetch(
          `/api/projects/${org.defaultProjectId}/analytics`,
          {
            signal: controller.signal,
          },
        );
        if (!analyticsRes.ok) throw new Error("Failed to fetch analytics");
        const analytics = await analyticsRes.json();

        // Batch update state once all dependencies resolve
        setData({ user, org, analytics });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchChainedData();

    return () => controller.abort(); // Cleanup on unmount or userId change
  }, [userId]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h1>Welcome, {data.user.name}</h1>
      <p>Organization: {data.org.name}</p>
      <p>Active Projects: {data.analytics.activeCount}</p>
    </div>
  );
}
```

### Why this pattern works well:

- **Single Loading / Error State:** Avoids intermediate layout shifts or partial rendering states.
- **Race Condition Safe:** Uses `AbortController` to cancel all pending requests in the chain if `userId` changes mid-flight.

---

## Approach 2: Dependent Queries with TanStack Query (React Query)

If you use a data-fetching library like **TanStack Query** (recommended for modern React applications), you can model dependencies declaratively using the `enabled` option.

This approach automatically handles caching, retries, deduplication, and loading states without writing manual `useEffect` logic.

```tsx
import { useQuery } from "@tanstack/react-query";

export function DependentQueryComponent({ userId }: { userId: string }) {
  // 1. Fetch User
  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
  });

  const organizationId = userQuery.data?.organizationId;

  // 2. Fetch Org (enabled ONLY when organizationId is available)
  const orgQuery = useQuery({
    queryKey: ["org", organizationId],
    queryFn: () =>
      fetch(`/api/orgs/${organizationId}`).then((res) => res.json()),
    enabled: !!organizationId, // 👈 Dependent condition
  });

  const defaultProjectId = orgQuery.data?.defaultProjectId;

  // 3. Fetch Analytics (enabled ONLY when defaultProjectId is available)
  const analyticsQuery = useQuery({
    queryKey: ["analytics", defaultProjectId],
    queryFn: () =>
      fetch(`/api/projects/${defaultProjectId}/analytics`).then((res) =>
        res.json(),
      ),
    enabled: !!defaultProjectId, // 👈 Dependent condition
  });

  // Derived loading & error states
  const isLoading =
    userQuery.isLoading || orgQuery.isLoading || analyticsQuery.isLoading;
  const error = userQuery.error || orgQuery.error || analyticsQuery.error;

  if (isLoading) return <div>Loading dependent data...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <h1>{userQuery.data?.name}</h1>
      <p>Org: {orgQuery.data?.name}</p>
      <p>Analytics: {analyticsQuery.data?.activeCount}</p>
    </div>
  );
}
```

---

## Approach 3: Independent Sub-components (Waterfall Pattern)

If each step in the chain renders its own sub-view, you can split the queries across individual child components. Each child component only mounts (or fetches) when its parent passes down the required ID.

```tsx
function ParentUser({ userId }: { userId: string }) {
  const { data: user } = useFetchUser(userId);

  if (!user) return <Spinner />;

  // User loaded -> Mount Org Component
  return <ChildOrg organizationId={user.organizationId} />;
}

function ChildOrg({ organizationId }: { organizationId: string }) {
  const { data: org } = useFetchOrg(organizationId);

  if (!org) return <Spinner />;

  // Org loaded -> Mount Analytics Component
  return <ChildAnalytics projectId={org.defaultProjectId} />;
}
```

---

## Anti-Patterns to Avoid 🚫

1. **Cascading `useEffect` Hooks:** Avoid triggering API 1 in `useEffect #1`, setting `user` state, then listening to `user` in `useEffect #2` to trigger API 2. This causes **multiple unnecessary re-renders** and renders intermediate flash/empty states.
2. **Missing Abort Cleanups:** Always attach `AbortController` signal to native `fetch()` calls inside `useEffect`. If a user navigates away mid-chain, unhandled promises can attempt to update state on unmounted components or trigger race conditions.
3. **Sequential Processing of Independent Requests:** If API 2 and API 3 _don't_ depend on each other (only on API 1), execute them concurrently using `Promise.all()` rather than sequential `await`s:

```javascript
// Fetch User first
const user = await fetchUser(userId);

// Fetch Org AND Settings concurrently since they don't depend on each other!
const [org, settings] = await Promise.all([
  fetchOrg(user.orgId),
  fetchUserSettings(user.id),
]);
```
