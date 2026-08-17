```js
import React, { useState, useEffect } from "react";

const FetchAndDisplayData = () => {
  const [info, updateInfo] = useState(null);
  const [isLoading, toggleLoading] = useState(true);

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const res = await fetch("https://api.example.com/data");
        const data = await res.json();
        updateInfo(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        toggleLoading(false);
      }
    };

    retrieveData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Fetching data, please wait...</p>
      ) : (
        <pre>{JSON.stringify(info, null, 2)}</pre>
      )}
    </div>
  );
};

export default FetchAndDisplayData;
```

In a modern React app, don't roll your own useEffect + fetch for data loading — the React docs explicitly recommend against it. Reach first for a dedicated data-fetching library: TanStack Query, SWR, or RTK Query for client-side fetching, or Server Components and route-level loaders (Next.js App Router, Remix/React Router) when you control the framework. In React 19, the new use() hook lets a component read a promise directly and suspend, which pairs naturally with <Suspense> for loading states and error boundaries for failures. A hand-written useEffect+fetch is a low-level fallback that needs an AbortController, a response.ok check, and careful state handling to avoid race conditions and stale updates.

**Handling asynchronous data loading in React**
Prefer a data-fetching library (recommended)
The React team's recommendation in react.dev is to use a framework's built-in data fetching or a dedicated library, because they correctly handle caching, deduplication, refetching, race conditions, retries, and loading/error states — all of which are easy to get wrong by hand.

**TanStack Query** is the de facto standard for client-side fetching:

```js
import { useQuery } from "@tanstack/react-query";

function Profile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/users/${userId}`, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <h1>{data.name}</h1>;
}
```

**SWR** is a lightweight alternative with a similar mental model. RTK Query is the right pick if you already use Redux Toolkit.

These libraries give you for free:

An in-memory cache keyed by query parameters
Automatic deduplication of in-flight requests
Refetching on window focus, network reconnect, and on a stale interval
Cancellation via AbortSignal
Retries with backoff
Pagination, infinite scroll, and optimistic updates
**Server Components and framework loaders**
If you're using a framework, fetch on the server whenever possible — it's faster (no client waterfall) and ships less JS.

**Next.js App Router (React Server Components)** — async Server Components can await data directly and stream the result.
**React Router / Remix loaders** — co-locate a loader with the route; data is fetched in parallel with code.

```js
// Next.js Server Component (no useEffect needed)
async function UserPage({ params }) {
  const user = await fetch(`https://api.example.com/users/${params.id}`).then(
    (r) => r.json(),
  );
  return <h1>{user.name}</h1>;
}
```

**React 19: use() + <Suspense>**
React 19's use() hook lets a Client Component read a promise. While the promise is pending, the component suspends and the nearest <Suspense> boundary shows the fallback; if the promise rejects, the nearest error boundary catches it. The promise is typically created by a parent (often a Server Component) and passed down as a prop, so the request starts before the child renders.

```js
"use client";
import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

function UserName({ userPromise }) {
  const user = use(userPromise); // suspends until resolved
  return <h1>{user.name}</h1>;
}

function Page({ userPromise }) {
  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <UserName userPromise={userPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

Keeping the UI responsive: useTransition and useDeferredValue
When a user interaction triggers a re-fetch (filtering a list, switching tabs), wrap the state update that causes the new fetch in startTransition so the previous UI stays interactive while the new data loads. useDeferredValue gives you a lagging copy of a value — useful for letting an input stay snappy while a derived list re-renders against slower data.

```js
const [isPending, startTransition] = useTransition();

function onTabChange(next) {
  startTransition(() => setTab(next));
}
```

**Low-level: useEffect + fetch (when and how)**
Plain useEffect + fetch is a fine fallback for one-off fetches in a small app, or as an escape hatch. But you must handle two things the naive example always gets wrong: race conditions (an older request resolving after a newer one) and HTTP errors (fetch only rejects on network failure — a 500 still resolves).

```js
import { useEffect, useState } from "react";

function User({ id }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/users/${id}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    })();

    // Cancel the in-flight request if `id` changes or the component unmounts
    return () => controller.abort();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <h1>{data.name}</h1>;
}
```

Even with these fixes, useEffect does not give you caching across components, deduplication, or refetch-on-focus — which is why a real app outgrows it quickly.

| Option                                | Use When                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **TanStack Query / SWR / RTK Query**  | Default choice for client-side data fetching, caching, deduplication, and synchronization.              |
| **Server Components / Route Loaders** | You control a full-stack framework (like Next.js or Remix) and want to fetch data closer to the server. |
| **`use(promise)` + `<Suspense>**`     | Streaming a promise down from a parent component (or Server Component) in React 19+.                    |
| **`useEffect` + `fetch**`             | One-off exploratory fetches, basic learning exercises, or as a low-level escape hatch only.             |
