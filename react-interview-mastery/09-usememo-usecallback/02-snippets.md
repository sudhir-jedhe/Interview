# Snippets: useMemo & useCallback

```jsx
// useMemo caching an expensive filter/sort
function ProductTable({ products, query }) {
  const visible = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [products, query]
  );
  return <ul>{visible.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

```jsx
// useCallback keeping a handler reference stable across renders
function SearchBox({ onSearch }) {
  const [text, setText] = useState('');
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearch(text);
    },
    [text, onSearch]
  );
  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </form>
  );
}
```

```jsx
// React.memo only pays off when paired with stable prop references
const Row = React.memo(function Row({ label, onSelect }) {
  console.log('Row render:', label);
  return <li onClick={onSelect}>{label}</li>;
});

function RowList({ items }) {
  const handleSelect = useCallback((id) => console.log('selected', id), []);
  return (
    <ul>
      {items.map((item) => (
        <Row key={item.id} label={item.label} onSelect={() => handleSelect(item.id)} />
      ))}
    </ul>
  );
}
```

```jsx
// useMemo to avoid recreating an object passed to a memoized child
const Chart = React.memo(function Chart({ config }) {
  console.log('Chart render');
  return <canvas />;
});

function Dashboard({ data }) {
  const config = useMemo(() => ({ type: 'line', data }), [data]);
  return <Chart config={config} />;
}
```

```jsx
// useMemo for a derived value used in a dependency array elsewhere
function Report({ rows }) {
  const total = useMemo(() => rows.reduce((sum, r) => sum + r.amount, 0), [rows]);

  useEffect(() => {
    document.title = `Total: ${total}`;
  }, [total]); // stable unless rows actually change
  return <p>{total}</p>;
}
```

```jsx
// Correctly listing all dependencies to avoid a stale useMemo result
function Cart({ items, taxRate }) {
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0) * (1 + taxRate),
    [items, taxRate] // both used, both listed
  );
  return <p>Total: {total.toFixed(2)}</p>;
}
```

```jsx
// useCallback(fn, []) and useMemo(() => fn, []) produce the identical reference
function Demo() {
  const a = useCallback(() => console.log('a'), []);
  const b = useMemo(() => () => console.log('b'), []);
  // a and b behave identically: stable function reference across every re-render
  return <button onClick={a} onDoubleClick={b}>Click</button>;
}
```
