# Snippets — Components & Props

```jsx
// 1. Basic function component with destructured props
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

```jsx
// 2. props.children makes a component a reusable container
function Panel({ title, children }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}
// usage: <Panel title="Info"><p>Some content</p></Panel>
```

```jsx
// 3. Default prop values via destructuring
function Avatar({ size = 40, src, alt = 'user avatar' }) {
  return <img src={src} alt={alt} width={size} height={size} />;
}
```

```jsx
// 4. Passing a callback prop instead of mutating props directly
function Counter({ count, onIncrement }) {
  return <button onClick={onIncrement}>Count: {count}</button>;
}
function App() {
  const [count, setCount] = React.useState(0);
  return <Counter count={count} onIncrement={() => setCount(c => c + 1)} />;
}
```

```jsx
// 5. Spreading props to forward unrelated attributes to the underlying element
function PrimaryButton({ children, ...rest }) {
  return <button className="btn-primary" {...rest}>{children}</button>;
}
// usage: <PrimaryButton onClick={...} disabled>Save</PrimaryButton>
```

```jsx
// 6. Composition instead of prop drilling — pass a built element down
function Layout({ sidebar, content }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}
// usage: <Layout sidebar={<Nav />} content={<Dashboard />} />
```

```jsx
// 7. Presentational component receiving all data/behavior via props
function TodoItem({ text, done, onToggle }) {
  return (
    <li style={{ textDecoration: done ? 'line-through' : 'none' }}>
      <input type="checkbox" checked={done} onChange={onToggle} />
      {text}
    </li>
  );
}
```
