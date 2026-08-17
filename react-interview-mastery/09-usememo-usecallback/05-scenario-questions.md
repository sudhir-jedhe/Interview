# Scenario Questions: useMemo & useCallback

### Scenario 1: A data grid with 10,000 rows lags on every keystroke in an unrelated search box elsewhere on the page

You're building a dashboard with a large sortable/filterable data grid and, separately, a global search box in the header. Typing in the header search box causes the entire page — including the unrelated grid — to noticeably lag on every keystroke.

**Approach:** The header search state likely lives in a common ancestor of both the search box and the grid, so every keystroke re-renders that ancestor and, by default, every descendant — including the grid, which re-sorts/re-filters its 10,000 rows from scratch on every render even though its own inputs haven't changed. Fix with `useMemo` around the grid's actual expensive computation, keyed only on the grid's own relevant inputs:

```jsx
function DataGrid({ rows, sortKey, filterText }) {
  const processedRows = useMemo(() => {
    const filtered = rows.filter((r) => r.name.includes(filterText));
    return filtered.sort((a, b) => a[sortKey] - b[sortKey]);
  }, [rows, sortKey, filterText]); // NOT dependent on the unrelated header search state

  return <Table rows={processedRows} />;
}
```

If `DataGrid` itself is also expensive to re-render (not just the sort), additionally wrap it in `React.memo` and ensure `rows`/`sortKey`/`filterText` are referentially stable across the header's re-renders — otherwise `React.memo` won't help since new prop references would still force a re-render even with unchanged data.

---

### Scenario 2: A "favorite" button component causes its entire parent list to re-render every time any single item is favorited

You're building a product grid where each `ProductCard` has a favorite toggle. Clicking favorite on one card visibly causes every other card to flash/re-render in the React DevTools profiler, even though only one item's data changed.

**Approach:** Likely culprits: the favorite-toggle handler is defined inline inside the `.map()` (new function per card per render), and/or the cards aren't wrapped in `React.memo` at all. Fix both:

```jsx
const ProductCard = React.memo(function ProductCard({ product, onToggleFavorite }) {
  console.log('ProductCard render', product.id);
  return (
    <div>
      {product.name}
      <button onClick={() => onToggleFavorite(product.id)}>
        {product.isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
});

function ProductGrid({ products, onToggleFavorite }) {
  // onToggleFavorite is expected to be a stable useCallback from the parent
  return (
    <div>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}

function ProductPage() {
  const [products, setProducts] = useState(initialProducts);
  const toggleFavorite = useCallback((id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  }, []);
  return <ProductGrid products={products} onToggleFavorite={toggleFavorite} />;
}
```

With `toggleFavorite` memoized (stable reference) and the state update using `.map()` (which only creates a new object for the toggled product — every other product object keeps its old reference), `React.memo` on `ProductCard` correctly skips re-rendering for every card except the one that was actually favorited.

---

### Scenario 3: A team is memoizing every value and callback in a component "for performance," and code review has become slow

You're reviewing a PR where a mid-size form component wraps every derived value in `useMemo` and every handler in `useCallback`, even trivial ones (`useMemo(() => name.trim(), [name])`, `useCallback(() => setOpen(true), [])`), none of which are passed to a `React.memo` child or used in another hook's deps.

**Approach:** Push back constructively: memoization isn't free — it adds a dependency array that has to stay correct (a maintenance burden and a common source of stale-value bugs) and a small runtime overhead for the comparison itself, in exchange for avoiding a recomputation that, for a `.trim()` call, is cheaper than the memoization machinery itself. Recommend removing memoization unless one of these is true: (1) the computation is measurably expensive, (2) the value/function is passed to a component wrapped in `React.memo`, or (3) it's a dependency of another hook where referential stability actually prevents unwanted reruns.

```jsx
// Unnecessary — trim() on a short string is cheaper than useMemo's bookkeeping
const trimmedName = useMemo(() => name.trim(), [name]);

// Just do this instead
const trimmedName = name.trim();

// Unnecessary — setOpen(true) isn't passed to a memoized child or used as a dep elsewhere
const openModal = useCallback(() => setOpen(true), []);

// Just do this instead
const openModal = () => setOpen(true);
```

Suggest the team default to plain values/functions, and reach for `useMemo`/`useCallback` reactively — once profiling (React DevTools Profiler, or a visible jank issue) actually points at a specific component.

---

### Scenario 4: An expensive chart re-renders and re-processes data on every parent re-render, even though the underlying data hasn't changed

You're building a dashboard where a `<RevenueChart data={revenueData} options={chartOptions} />` component does a heavy client-side aggregation of `data` before rendering, wrapped in `React.memo`. Despite that, it still re-processes and re-renders every time the parent dashboard updates (e.g., when an unrelated filter dropdown's open/closed state changes).

**Approach:** Audit how `revenueData` and `chartOptions` are produced in the parent — if they're computed inline on every render (e.g., `data={rawData.map(...)}` or `options={{ theme: 'dark' }}` directly in JSX), they're new references every time, defeating `React.memo` regardless of the internal aggregation logic:

```jsx
function Dashboard({ rawData, isDropdownOpen }) {
  // Buggy: new array/object every render, defeats RevenueChart's React.memo
  return (
    <RevenueChart
      data={rawData.map((d) => ({ month: d.month, total: d.amount }))}
      options={{ theme: 'dark' }}
    />
  );
}

function Dashboard({ rawData, isDropdownOpen }) {
  const data = useMemo(
    () => rawData.map((d) => ({ month: d.month, total: d.amount })),
    [rawData]
  );
  const options = useMemo(() => ({ theme: 'dark' }), []); // truly constant, memoize once

  return <RevenueChart data={data} options={options} />;
}
```

Additionally, move the heavy aggregation itself inside `RevenueChart` behind its own `useMemo` keyed on `data`, so even if `RevenueChart` does re-render for a legitimate prop change unrelated to `data`, the expensive aggregation isn't redone unless `data` specifically changed.
