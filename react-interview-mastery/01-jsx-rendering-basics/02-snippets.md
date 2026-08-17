# Snippets — JSX & Rendering Basics

```jsx
// 1. JSX compiles to createElement / jsx() calls — these two are equivalent
const a = <p id="x">Hi</p>;
const b = React.createElement('p', { id: 'x' }, 'Hi');
```

```jsx
// 2. Fragments avoid an unnecessary wrapper div in the DOM
function Pair() {
  return (
    <>
      <dt>Name</dt>
      <dd>Ada Lovelace</dd>
    </>
  );
}
```

```jsx
// 3. Ternary for two-branch conditional rendering
function StatusBadge({ isOnline }) {
  return <span>{isOnline ? '🟢 Online' : '⚪ Offline'}</span>;
}
```

```jsx
// 4. && trap: guard with a boolean, not a raw number, to avoid rendering "0"
function Cart({ items }) {
  return (
    <div>
      {items.length > 0 && <p>{items.length} item(s) in cart</p>}
    </div>
  );
}
```

```jsx
// 5. Rendering a list with stable keys derived from data, not index
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

```jsx
// 6. Early return keeps the main render path flat and readable
function Profile({ user }) {
  if (!user) return <p>No user loaded.</p>;
  return <h2>{user.name}</h2>;
}
```

```jsx
// 7. Automatic batching in React 18 — one re-render, not two, even in a setTimeout
function Counter() {
  const [count, setCount] = React.useState(0);
  const [clicks, setClicks] = React.useState(0);

  function handleClick() {
    setTimeout(() => {
      setCount(c => c + 1);
      setClicks(c => c + 1); // batched with the update above in React 18+
    }, 0);
  }

  return <button onClick={handleClick}>{count} / {clicks}</button>;
}
```
