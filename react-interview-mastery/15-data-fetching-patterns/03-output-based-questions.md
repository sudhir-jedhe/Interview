# Output-Based Questions: Data Fetching Patterns

### 1. Which user ends up rendered?
```jsx
function Profile({ id }) {
  const [name, setName] = useState("");

  useEffect(() => {
    fetchUser(id).then((u) => setName(u.name));
  }, [id]);

  return <p>{name}</p>;
}

// Simulated network: user 1 takes 500ms, user 2 takes 50ms.
// Parent rapidly changes id from 1 -> 2 within 10ms.
```
**Answer:** The name for user 1 is rendered, even though `id` is now 2.

**Why:** Both requests fire (effect reruns on each `id` change), but user 2's request resolves first (50ms) and sets state, then user 1's request resolves later (500ms) and overwrites it. Without a cancellation/ignore mechanism, the last *response to arrive* wins, not the last *request sent*.

---

### 2. Does this log a warning or crash?
```jsx
function Widget() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/data").then((r) => r.json()).then(setData);
  }, []);

  return <p>{data?.value}</p>;
}

// Widget is unmounted 10ms after mount; the fetch takes 200ms.
```
**Answer:** No crash. In React 18, calling `setData` on an unmounted component is silently ignored (no dev warning like in React 16/17's "Can't perform a React state update on an unmounted component").

**Why:** React 18 removed that specific warning because it was overly aggressive and often unavoidable in this exact scenario. The update is still wasted work, though — it's a code smell worth fixing with an abort/cleanup even if it no longer warns.

---

### 3. What does the console print?
```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch("/api/slow", { signal: controller.signal })
    .catch((e) => console.log(e.name));
  controller.abort();
}, []);
```
**Answer:** `"AbortError"`

**Why:** Calling `controller.abort()` synchronously right after starting the fetch still cancels it — the abort signal is checked asynchronously by the fetch implementation. The fetch promise rejects with a `DOMException` whose `name` is `"AbortError"`.

---

### 4. How many network requests fire?
```jsx
function App() {
  return (
    <>
      <UserCard id={1} />
      <UserCard id={1} />
    </>
  );
}

function UserCard({ id }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(`/api/users/${id}`).then((r) => r.json()).then(setUser);
  }, [id]);
  return <p>{user?.name}</p>;
}
```
**Answer:** 2 separate requests for the same `/api/users/1`.

**Why:** Each `UserCard` instance has its own effect and no shared cache, so plain `useEffect` fetching duplicates identical requests across sibling components. This duplication is exactly what request deduplication in libraries like React Query solves — a hand-rolled fetch has no concept of "someone already asked for this."

---

### 5. What renders first, second, and does it flicker?
```jsx
function List({ page }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([]); // reset before fetch
    fetch(`/api/items?page=${page}`).then((r) => r.json()).then(setItems);
  }, [page]);

  return <ul>{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul>;
}
```
**Answer:** On every `page` change: empty list renders first, then the new page's items render once the fetch resolves — a visible flicker to empty on each page change.

**Why:** `setItems([])` runs synchronously inside the effect before the async fetch resolves, so React commits an empty-list render immediately, then a second render once data arrives. This is the classic "loading flash" that stale-while-revalidate patterns (keep old data visible while fetching new) are designed to avoid.

---

### 6. Is `error` ever set here?
```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch("/api/data", { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch(setError);
  return () => controller.abort();
}, [id]);
```
**Answer:** Yes — whenever the effect cleanup runs (e.g., `id` changes or unmount) before the fetch resolves, `.catch(setError)` fires with an `AbortError`, incorrectly putting the component into an error state.

**Why:** This code aborts on cleanup but doesn't distinguish `AbortError` from real failures, unlike the corrected version in the notes that checks `err.name !== "AbortError"`. This is a common, subtle bug: cancellation gets treated as failure.

---

### 7. What's wrong with the dependency array?
```jsx
function Orders({ userId }) {
  const options = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetch(`/api/orders?user=${userId}`, options).then((r) => r.json()).then(setOrders);
  }, [userId, options]);

  // ...
}
```
**Answer:** The effect refetches on every render, not just when `userId` changes.

**Why:** `options` is a new object literal created on every render, so it's referentially different each time even if its contents are identical, making `[userId, options]` effectively change every render and defeating the dependency array's purpose. Fix by moving `options` inside the effect or memoizing it with `useMemo`.
