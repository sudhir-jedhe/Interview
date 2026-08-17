# Notes: Data Fetching Patterns

## The classic pattern

Fetching in a function component almost always starts as `useEffect` that fires a request and stores the result in state:

```jsx
function UserProfile({ userId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <Profile user={data} />;
}
```

This works, but it has two well-known bugs.

## Bug 1: race conditions

If `userId` changes quickly (fast tab clicks, a search box, arrow-key navigation), you fire multiple requests and they can resolve **out of order**. The last request to resolve wins, not the last request to be sent. If request A (for user 1) resolves after request B (for user 2), you render user 1's data while `userId` is 2. The fix is either an abort flag or `AbortController` (below) — you need to ignore results from stale requests.

## Bug 2: missing cleanup / setting state after unmount

If the component unmounts (or the effect re-runs) before the promise resolves, calling `setData` afterward is a no-op in React 18 that also logs a warning in older versions and is genuinely a bug: you're doing unnecessary work and can mask stale-closure issues. Always guard with a cleanup flag or abort the request.

```jsx
useEffect(() => {
  let cancelled = false;
  fetch(`/api/users/${userId}`)
    .then((res) => res.json())
    .then((json) => {
      if (!cancelled) setData(json);
    });
  return () => {
    cancelled = true;
  };
}, [userId]);
```

## AbortController — the proper fix

`AbortController` cancels the underlying network request (not just the state update), which is strictly better: it saves bandwidth and lets the server stop working on a response nobody wants.

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        signal: controller.signal,
      });
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") setError(err);
    } finally {
      setLoading(false);
    }
  }

  load();
  return () => controller.abort();
}, [userId]);
```

Gotcha: an aborted `fetch` rejects with a `DOMException` named `"AbortError"` — you must special-case it, otherwise you'll show an error UI for a cancellation that isn't really an error.

## Why React Query / SWR exist

Hand-rolled fetching re-solves the same problems in every component: caching (don't refetch data you already have), deduplication (two components requesting the same resource in the same render shouldn't fire two network calls), background refetching, and cache invalidation. These libraries implement **stale-while-revalidate**: show cached data immediately, then silently refetch in the background and update the UI if the server disagrees. They also refetch automatically on window focus or network reconnect, which hand-rolled `useEffect` fetching never does unless you build it yourself. You don't need to memorize their APIs for an interview — you need to be able to say *why* they exist: they turn fetching from an imperative, per-component concern into a declarative cache keyed by query params.

## Waterfalls vs parallel fetching

A waterfall happens when a child component's fetch depends on a parent's fetch finishing first, even when the data isn't actually dependent — e.g., fetching a user, then only *after* that fetching their posts, when both could be fetched with the user ID you already had. Fix by hoisting the fetches and firing them together:

```jsx
// Waterfall — posts fetch waits on user fetch to even start
useEffect(() => {
  fetchUser(id).then((u) => {
    setUser(u);
    fetchPosts(id).then(setPosts); // could've started immediately
  });
}, [id]);

// Parallel
useEffect(() => {
  Promise.all([fetchUser(id), fetchPosts(id)]).then(([u, p]) => {
    setUser(u);
    setPosts(p);
  });
}, [id]);
```

## Optimistic updates

Instead of waiting for the server to confirm a mutation, update local state immediately as if it succeeded, then roll back if the request fails. This makes UIs feel instant for actions like liking a post or checking off a todo. The tradeoff is complexity: you need a rollback path, and you must reconcile with the eventual server response.
