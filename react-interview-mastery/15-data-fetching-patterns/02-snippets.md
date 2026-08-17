# Snippets: Data Fetching Patterns

### 1. Basic fetch-on-mount with loading/error/data state
```jsx
function Todo({ id }) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    fetch(`/api/todos/${id}`)
      .then((r) => r.json())
      .then((data) => setState({ status: "success", data, error: null }))
      .catch((error) => setState({ status: "error", data: null, error }));
  }, [id]);

  if (state.status === "loading") return <p>Loading...</p>;
  if (state.status === "error") return <p>Failed: {state.error.message}</p>;
  return <p>{state.data.title}</p>;
}
```

### 2. Aborting a stale request with AbortController
```jsx
function Search({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    fetch(`/api/search?q=${query}`, { signal: controller.signal })
      .then((r) => r.json())
      .then(setResults)
      .catch((e) => {
        if (e.name !== "AbortError") console.error(e);
      });
    return () => controller.abort();
  }, [query]);

  return <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>;
}
```

### 3. Ignoring out-of-order responses with a cancelled flag
```jsx
function Price({ symbol }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getPrice(symbol).then((p) => {
      if (!cancelled) setPrice(p);
    });
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return <span>{price ?? "..."}</span>;
}
```

### 4. Parallel fetching with Promise.all
```jsx
function Dashboard({ userId }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${userId}`).then((r) => r.json()),
      fetch(`/api/users/${userId}/stats`).then((r) => r.json()),
    ]).then(([user, stats]) => setState({ user, stats }));
  }, [userId]);

  if (!state) return <p>Loading...</p>;
  return <p>{state.user.name}: {state.stats.total} posts</p>;
}
```

### 5. A tiny reusable useFetch hook
```jsx
function useFetch(url) {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, data: null, error: null });
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ loading: false, data: null, error });
        }
      });
    return () => controller.abort();
  }, [url]);

  return state;
}
```

### 6. Optimistic update with rollback on failure
```jsx
function LikeButton({ postId, initialLiked }) {
  const [liked, setLiked] = useState(initialLiked);

  async function toggleLike() {
    const previous = liked;
    setLiked(!liked); // optimistic
    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    } catch {
      setLiked(previous); // rollback
    }
  }

  return <button onClick={toggleLike}>{liked ? "Liked" : "Like"}</button>;
}
```

### 7. Manual refetch/retry via a version counter
```jsx
function RetryableData({ url }) {
  const [version, setVersion] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url).then((r) => r.json()).then(setData);
  }, [url, version]);

  return (
    <div>
      <pre>{JSON.stringify(data)}</pre>
      <button onClick={() => setVersion((v) => v + 1)}>Retry</button>
    </div>
  );
}
```
