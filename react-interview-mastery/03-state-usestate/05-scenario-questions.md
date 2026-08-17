# Scenario Questions — State & `useState`

### 1. "Like" button sometimes only registers one click out of several rapid clicks

You're building a "like" button that increments a counter, and users on slower devices report that rapidly double/triple-tapping sometimes only adds 1 instead of 2 or 3 to the count.

**Approach:** This is almost certainly the stale-closure batching issue — the handler likely uses `setLikes(likes + 1)`, and if multiple clicks get batched together (or if the handler is somehow called multiple times referencing the same render's `likes`), each call schedules the same "set to old+1" update. Switch to the functional updater form so each increment is guaranteed to build on the true latest value:

```jsx
function LikeButton() {
  const [likes, setLikes] = React.useState(0);
  function handleLike() {
    setLikes(prev => prev + 1); // always correct regardless of batching/timing
  }
  return <button onClick={handleLike}>❤️ {likes}</button>;
}
```

This is also the safer default any time an increment/toggle could conceivably fire more than once before a re-render completes (double-click, key repeat, async handlers).

---

### 2. Shopping cart quantity stepper occasionally shows a stale total

You're building a cart page where each line item has a `+`/`-` quantity stepper, and the "Total" line at the bottom sometimes lags by one step behind the actual quantities shown, especially when a user clicks quickly.

**Approach:** Check how quantities are stored and updated. If it's an array of `{ id, qty }` objects in state and the update handler mutates the array or a specific item in place before calling `setItems`, React may skip re-rendering (same reference) or a computed "Total" derived elsewhere may read stale data mid-update. Fix by always producing new array/object references on update:

```jsx
function CartItem({ item, onQtyChange }) {
  return (
    <div>
      <button onClick={() => onQtyChange(item.id, item.qty - 1)}>-</button>
      <span>{item.qty}</span>
      <button onClick={() => onQtyChange(item.id, item.qty + 1)}>+</button>
    </div>
  );
}

function Cart() {
  const [items, setItems] = React.useState([{ id: 1, qty: 2, price: 10 }]);

  function updateQty(id, qty) {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: Math.max(0, qty) } : item))
    );
  }

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <>
      {items.map(item => (
        <CartItem key={item.id} item={item} onQtyChange={updateQty} />
      ))}
      <p>Total: ${total}</p>
    </>
  );
}
```

Because `total` is derived directly from `items` on every render (not stored as separate state), and `items` is always replaced with a new array reference on update, the total can never desync from the actual quantities.

---

### 3. Search page re-parses a huge JSON blob from localStorage on every keystroke, causing lag

You're building a search page that seeds its initial filter state from a large cached JSON blob in localStorage, and profiling shows a noticeable parse/computation cost happening on every render, not just once at mount.

**Approach:** The initializer is almost certainly written as `useState(JSON.parse(localStorage.getItem('filters')))` — a plain function call passed as the argument, which JavaScript evaluates on every render regardless of whether `useState` will actually use the result. Switch to the lazy initializer form so React only invokes it once, on mount:

```jsx
function SearchPage() {
  // Bad: JSON.parse runs on every render even though only used once
  // const [filters, setFilters] = React.useState(JSON.parse(localStorage.getItem('filters') || '{}'));

  // Good: only parsed once, at mount
  const [filters, setFilters] = React.useState(() => {
    const raw = localStorage.getItem('filters');
    return raw ? JSON.parse(raw) : {};
  });

  const [query, setQuery] = React.useState('');
  // ...typing in the search box no longer triggers a re-parse of filters
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

This is a common perf trap: state initializers that look "run once" at a glance are actually eager function calls unless wrapped in the `() => ...` lazy form.

---

### 4. Two sibling components (a filter sidebar and a results list) get out of sync

You're building a product listing page with a `<FilterSidebar>` and a `<ResultsList>` as siblings, each currently managing its own local `selectedCategory` state, and users report the results list sometimes doesn't reflect the filter they just picked.

**Approach:** Sibling components can't directly share `useState` — each has its own independent copy, so there's no way for one to "know" the other changed. The fix is to lift the shared state up to their common parent and pass it down as props:

```jsx
function ProductPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [products] = React.useState(allProducts);

  const filtered = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="page">
      <FilterSidebar selected={selectedCategory} onSelect={setSelectedCategory} />
      <ResultsList products={filtered} />
    </div>
  );
}

function FilterSidebar({ selected, onSelect }) {
  return (
    <select value={selected} onChange={e => onSelect(e.target.value)}>
      <option value="all">All</option>
      <option value="shoes">Shoes</option>
    </select>
  );
}

function ResultsList({ products }) {
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

Neither sibling owns `selectedCategory` anymore — `ProductPage` is the single source of truth, and both children stay trivially in sync because they're both driven from the same state via props.
