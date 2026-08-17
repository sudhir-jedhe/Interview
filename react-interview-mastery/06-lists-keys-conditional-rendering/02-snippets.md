# Snippets: Lists, Keys & Conditional Rendering

```jsx
// Basic list rendering with a stable key
function Fruits() {
  const fruits = [
    { id: 'a1', name: 'Apple' },
    { id: 'a2', name: 'Banana' },
  ];
  return (
    <ul>
      {fruits.map((f) => (
        <li key={f.id}>{f.name}</li>
      ))}
    </ul>
  );
}
```

```jsx
// Filtering a list before rendering (keys stay attached to the right items)
function ActiveUsers({ users }) {
  return (
    <ul>
      {users
        .filter((u) => u.isActive)
        .map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
    </ul>
  );
}
```

```jsx
// Ternary conditional rendering: two mutually exclusive branches
function AuthGate({ isLoggedIn }) {
  return isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>;
}
```

```jsx
// The count && <Badge/> bug and its fix
function CartBadge({ itemCount }) {
  return (
    <div>
      {/* Buggy: renders "0" when itemCount is 0 */}
      {itemCount && <span className="badge">{itemCount}</span>}
      {/* Fixed: coerce to boolean first */}
      {itemCount > 0 && <span className="badge">{itemCount}</span>}
    </div>
  );
}
```

```jsx
// Nested lists each need their own key scoped to their own siblings
function Categories({ categories }) {
  return (
    <div>
      {categories.map((cat) => (
        <section key={cat.id}>
          <h3>{cat.name}</h3>
          <ul>
            {cat.items.map((item) => (
              <li key={item.id}>{item.label}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

```jsx
// Multiple early returns for conditional rendering instead of nested ternaries
function Status({ state }) {
  if (state === 'loading') return <Spinner />;
  if (state === 'error') return <ErrorMessage />;
  if (state === 'empty') return <EmptyState />;
  return <DataView />;
}
```

```jsx
// Using a Fragment with a key when mapping to multiple sibling elements
function DefinitionList({ entries }) {
  return (
    <dl>
      {entries.map((e) => (
        <React.Fragment key={e.id}>
          <dt>{e.term}</dt>
          <dd>{e.definition}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```
