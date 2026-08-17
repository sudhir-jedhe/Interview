# Scenario Questions: React 18/19 Features

### 1. Typing in a filter box feels laggy on a large list
You're building a table with 10,000 rows and a text filter above it. Users report that every keystroke causes a visible stutter before the character appears in the input.

**Approach:** The filtering/re-render of the large list is happening synchronously in the same update as the input's own state change, blocking the input's repaint. Split them: keep the input's own state update urgent, and mark the derived, expensive list update as a transition (or use `useDeferredValue` on the filter text feeding the list).
```jsx
function FilterableTable({ rows }) {
  const [filterText, setFilterText] = useState("");
  const deferredFilter = useDeferredValue(filterText);

  const visibleRows = useMemo(
    () => rows.filter((r) => r.name.includes(deferredFilter)),
    [rows, deferredFilter]
  );

  const isStale = filterText !== deferredFilter;

  return (
    <div>
      <input
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <Table rows={visibleRows} style={{ opacity: isStale ? 0.5 : 1 }} />
    </div>
  );
}
```
`filterText` updates immediately so the input never lags; `deferredFilter` trails behind slightly during heavy renders, and React prioritizes keeping the UI responsive over updating the table instantly.

---

### 2. A tab-switch causes a visible flash of blank content
Switching between tabs in a dashboard (e.g., "Overview" → "Detailed Report") triggers a heavy re-render of the new tab's content, and during that time the previous tab's content disappears abruptly before the new content is ready, creating a flash.

**Approach:** Wrap the tab-switching state update in `useTransition` so React keeps rendering the old tab's content while the new tab's heavy render happens in the background, only swapping once it's ready, with `isPending` driving a subtle loading indicator instead of an abrupt disappearance.
```jsx
function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [isPending, startTransition] = useTransition();

  function selectTab(next) {
    startTransition(() => setTab(next));
  }

  return (
    <div>
      <nav>
        <button onClick={() => selectTab("overview")}>Overview</button>
        <button onClick={() => selectTab("detailed")}>Detailed Report</button>
      </nav>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        {tab === "overview" ? <Overview /> : <DetailedReport />}
      </div>
    </div>
  );
}
```
Because it's a transition, React can keep the current tab mounted and interactable while preparing the next one, avoiding the jarring blank flash.

---

### 3. A team is debugging inconsistent counters after upgrading to React 18
After upgrading from React 17 to React 18, a team notices a feature that increments two related counters inside a `setTimeout` callback (used for a debounced analytics batch update) now behaves differently — a test asserting an intermediate DOM state between the two updates started failing.

**Approach:** Explain that this is expected: React 18's automatic batching now applies inside `setTimeout` (previously only event handlers were batched), so both `setState` calls commit together in one render instead of two separate ones. The intermediate DOM state the test asserted on no longer exists because there's no render in between the two updates. Fix the test to assert on the final state, or if an intermediate render is genuinely required for correctness (rare), force it with `flushSync`.
```jsx
import { flushSync } from "react-dom";

function recordAnalyticsBatch() {
  setTimeout(() => {
    flushSync(() => {
      setPending(true); // forces its own render, if genuinely needed
    });
    setCount((c) => c + 1);
    setLastUpdated(Date.now());
    // these two still batch together into one render
  }, 300);
}
```
In practice, the better fix is almost always to stop relying on intermediate render timing in tests and assert on the final, settled state instead — `flushSync` should be a last resort since it opts out of a performance optimization.

---

### 4. Migrating a page to Server Components, but a component needs both DB access and a click handler
You're converting a product page to use React Server Components for performance. The page needs to read directly from the database, but also has an "Add to Wishlist" button that needs `onClick` and local state.

**Approach:** Split the concerns: keep the page itself a Server Component that fetches data directly, and extract the interactive button into its own file marked `"use client"`, passing down only the plain-data props it needs (not functions or non-serializable values from the server).
```jsx
// ProductPage.jsx (Server Component, default in an RSC framework)
async function ProductPage({ id }) {
  const product = await db.products.findById(id);
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <WishlistButton productId={product.id} />
    </div>
  );
}

// WishlistButton.jsx (Client Component)
"use client";
function WishlistButton({ productId }) {
  const [added, setAdded] = useState(false);

  async function handleClick() {
    setAdded(true);
    await fetch(`/api/wishlist`, {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  }

  return <button onClick={handleClick}>{added ? "Saved" : "Save to wishlist"}</button>;
}
```
Only `WishlistButton`'s JS ships to the client; the rest of the page's markup arrives pre-rendered from the server with no extra client-side bundle for the static content.

---

### 5. A shared hook subscribing to `window.matchMedia` causes inconsistent UI under concurrent rendering
You have a custom `useMediaQuery` hook implemented with `useEffect` + `useState` that subscribes to a media query and updates layout-dependent components. Under React 18's concurrent rendering (used via a transition elsewhere on the page), some components briefly render with a stale media-query result while others show the updated one, causing a layout mismatch mid-interaction.

**Approach:** This is textbook "tearing" — different components reading an external store at slightly different points in a concurrent render see inconsistent snapshots. Replace the manual `useEffect`/`useState` subscription with `useSyncExternalStore`, which is specifically designed to keep all consumers of an external store consistent during concurrent rendering.
```jsx
function useMediaQuery(query) {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches, // client snapshot
    () => false // server snapshot (SSR default)
  );
}
```
This guarantees every component calling `useMediaQuery(query)` in the same render sees the same value, eliminating the layout mismatch that the ad hoc `useEffect` version was prone to under concurrent features.
