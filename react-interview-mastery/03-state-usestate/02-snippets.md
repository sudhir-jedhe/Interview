# Snippets — State & `useState`

```jsx
// 1. Basic counter using functional update
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Count: {count}
    </button>
  );
}
```

```jsx
// 2. Two rapid updates in one handler — functional form applies both correctly
function DoubleIncrement() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  }
  return <button onClick={handleClick}>{count}</button>; // jumps by 2 each click
}
```

```jsx
// 3. Updating an array in state without mutating it
function TodoList() {
  const [todos, setTodos] = React.useState([]);
  function addTodo(text) {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  }
  return (
    <>
      <button onClick={() => addTodo('New task')}>Add</button>
      <ul>{todos.map(t => <li key={t.id}>{t.text}</li>)}</ul>
    </>
  );
}
```

```jsx
// 4. Updating a nested object in state without mutating it
function ProfileForm() {
  const [form, setForm] = React.useState({ name: '', address: { city: '' } });
  function setCity(city) {
    setForm(prev => ({ ...prev, address: { ...prev.address, city } }));
  }
  return <input value={form.address.city} onChange={e => setCity(e.target.value)} />;
}
```

```jsx
// 5. Lazy initial state — expensiveInit only runs once, on first mount
function Cache() {
  const [data, setData] = React.useState(() => expensiveInit());
  return <pre>{JSON.stringify(data)}</pre>;
}
function expensiveInit() {
  console.log('computing initial state'); // logs once, not on every render
  return { loadedAt: Date.now() };
}
```

```jsx
// 6. Lifting state up so two siblings stay in sync
function Parent() {
  const [query, setQuery] = React.useState('');
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <ResultsCount query={query} />
    </>
  );
}
function SearchInput({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
function ResultsCount({ query }) {
  return <p>Searching for: "{query}"</p>;
}
```

```jsx
// 7. Toggling boolean state with the functional form (avoids stale closures in rapid toggles)
function ToggleButton() {
  const [isOn, setIsOn] = React.useState(false);
  return (
    <button onClick={() => setIsOn(prev => !prev)}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}
```
