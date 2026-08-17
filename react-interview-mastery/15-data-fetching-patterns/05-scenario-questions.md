# Scenario Questions: Data Fetching Patterns

### 1. Search-as-you-type shows stale results
You're building an autocomplete search box. Users report that when they type quickly, the results sometimes flash to match an earlier, shorter query before settling — e.g., typing "react" briefly shows results for "rea" after showing results for "react".

**Approach:** This is the classic out-of-order response race condition — a longer query happened to resolve before a shorter one. Fix with `AbortController`: abort the previous request whenever a new keystroke fires a new one, so only the latest request's response can ever be applied.
```jsx
function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then(setResults)
        .catch((e) => {
          if (e.name !== "AbortError") console.error(e);
        });
    }, 250); // debounce

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{results.map((r) => <li key={r.id}>{r.label}</li>)}</ul>
    </div>
  );
}
```

---

### 2. Dashboard takes forever to load
Your dashboard fetches the current user, then the user's team, then the team's projects — each fetch starts only after the previous one resolves, and support tickets say the page feels sluggish even though each individual API call is fast (~150ms).

**Approach:** Profile the network waterfall first — three sequential 150ms calls is 450ms minimum even though nothing about them is inherently sequential if you already have IDs up front (e.g., team ID comes back with the user, but if `teamId` is available from auth/session data already, you don't need to wait). Restructure to fetch independent data in parallel and only sequence what's a genuine dependency.
```jsx
function Dashboard({ userId }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // user and org-level settings are independent — fetch in parallel
      const [user, settings] = await Promise.all([
        fetchUser(userId),
        fetchOrgSettings(userId),
      ]);
      // team depends on user.teamId, so it must come after
      const team = await fetchTeam(user.teamId);
      // projects depend on team.id, but could be parallelized with anything
      // that doesn't need team data
      const projects = await fetchProjects(team.id);
      if (!cancelled) setState({ user, settings, team, projects });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!state) return <Spinner />;
  return <DashboardView {...state} />;
}
```
Only `team` truly depends on `user`, and only `projects` truly depends on `team` — but `settings` never depended on anything and was needlessly serialized in the original waterfall.

---

### 3. "Like" button feels laggy on a social feed
Product wants likes to feel instant when tapped, even on a slow connection, but also wants to gracefully handle the rare case where the like fails server-side (e.g., the post was deleted).

**Approach:** Use an optimistic update: flip the UI state immediately, fire the mutation in the background, and roll back with a toast if it fails. Keep a snapshot of prior state so rollback is exact.
```jsx
function LikeButton({ post }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [count, setCount] = useState(post.likeCount);

  async function handleClick() {
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!liked);
    setCount(count + (liked ? -1 : 1));

    try {
      await fetch(`/api/posts/${post.id}/like`, {
        method: liked ? "DELETE" : "POST",
      });
    } catch {
      setLiked(prevLiked);
      setCount(prevCount);
      showToast("Couldn't update like, please try again.");
    }
  }

  return (
    <button onClick={handleClick}>
      {liked ? "♥" : "♡"} {count}
    </button>
  );
}
```

---

### 4. Duplicate requests slow down page load
Multiple independent components on the same page (a header avatar, a profile card, and a settings panel) each fetch `/api/users/me` on mount, tripling an otherwise-identical request and making the network tab noisy.

**Approach:** The root problem is that fetching is duplicated per-component with no shared cache. Two viable fixes: lift the fetch to a common ancestor and pass data down via props/context, or introduce a small cache layer (or adopt React Query/SWR) so identical in-flight requests are deduped automatically. For a lightweight fix without a library:
```jsx
const userCache = new Map();

function useCurrentUser() {
  const [user, setUser] = useState(() => userCache.get("me") ?? null);

  useEffect(() => {
    if (userCache.has("me")) return;
    let cancelled = false;
    let promise = userCache.get("me-promise");
    if (!promise) {
      promise = fetch("/api/users/me").then((r) => r.json());
      userCache.set("me-promise", promise);
    }
    promise.then((data) => {
      userCache.set("me", data);
      if (!cancelled) setUser(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}
```
In a real codebase, this is exactly the problem React Query solves out of the box via query-key-based deduplication — worth naming as the "real" fix in an interview even if you sketch the manual version.

---

### 5. Data goes stale after navigating away and back
Users navigate from a product list to a product detail page and back; the list shows outdated inventory counts because it was fetched once on first mount and never refreshed.

**Approach:** Decide on a staleness policy: refetch on every mount (simplest, extra network calls), refetch on window focus (catches the common "came back to this tab" case), or cache with a TTL and background-refresh (stale-while-revalidate). For a manual implementation, refetch on mount but show cached data instantly to avoid a loading flash:
```jsx
const listCache = new Map();

function ProductList() {
  const cached = listCache.get("products");
  const [products, setProducts] = useState(cached ?? []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        listCache.set("products", data);
        setProducts(data);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {loading && !cached && <Spinner />}
      <ul>{products.map((p) => <li key={p.id}>{p.name}: {p.stock}</li>)}</ul>
    </div>
  );
}
```
This is a hand-rolled version of exactly what SWR's name describes: show stale cached data immediately, revalidate in the background, update when the fresh response lands.
