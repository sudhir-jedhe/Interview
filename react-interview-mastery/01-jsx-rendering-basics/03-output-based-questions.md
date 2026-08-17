# Output-Based Questions — JSX & Rendering Basics

### 1. What renders?

```jsx
function Cart({ items }) {
  return <div>{items.length && <p>Items: {items.length}</p>}</div>;
}

// rendered with items = []
```

**Answer:** The div renders containing the text `0`.

**Why:** `items.length` is `0`, a falsy value, but `&&` returns the left operand itself when it's falsy — not `false`. React renders numbers (including `0`), so `0` shows up as literal text on the page. Only `false`, `null`, `undefined`, and `true` are silently skipped by React.

---

### 2. What's the console output order?

```jsx
function App() {
  console.log('render');
  React.useEffect(() => {
    console.log('effect');
  });
  return <div>hi</div>;
}
```

**Answer:** `render` logs first, then `effect`, on every render.

**Why:** JSX/function body execution happens synchronously during render, producing the element tree. Effects run after React commits that tree to the DOM, not during render — so any `useEffect` callback (without dependencies shown here, meaning it runs after every render) always logs after the render log.

---

### 3. What happens on click?

```jsx
function Toggle() {
  const [items, setItems] = React.useState(['a', 'b']);
  return (
    <div>
      {items.map((item, i) => (
        <input key={i} defaultValue={item} />
      ))}
      <button onClick={() => setItems(['c', ...items])}>Prepend</button>
    </div>
  );
}
```

**Answer:** After clicking, the input that used to show `b`'s value now shows `a`, and a new input shows `c` — but if the user had typed into either input first, the typed text appears to "jump" to the wrong item.

**Why:** Using the array index as `key` ties each input's identity to its position, not its data. When `c` is prepended, every item shifts position by one, so React matches the existing DOM `<input>` at position 0 to the new item `c` and reuses it (including whatever the user had typed there) rather than creating a fresh input. This is the classic index-as-key bug with uncontrolled inputs.

---

### 4. Does this compile/render?

```jsx
function Header() {
  return (
    <h1>Title</h1>
    <nav>Links</nav>
  );
}
```

**Answer:** It fails to compile — a syntax/build error, not a runtime one.

**Why:** JSX must evaluate to a single element (a single `createElement`/`jsx` call result). Two adjacent top-level elements with no wrapping parent are invalid JSX. Wrapping them in `<>...</>` or a `<div>` fixes it.

---

### 5. What logs, and how many times?

```jsx
function App() {
  const [a, setA] = React.useState(0);
  const [b, setB] = React.useState(0);

  function handleClick() {
    setA(1);
    setB(2);
    console.log('after setters', a, b);
  }

  return <button onClick={handleClick}>{a}-{b}</button>;
}
```

**Answer:** `after setters 0 0` — the old values, not `1 2`. The component then re-renders once, showing `1-2`.

**Why:** `useState` setters don't mutate state synchronously; they schedule an update. Inside the same event handler, `a` and `b` are still the values captured by that render's closure. React batches both `setA` and `setB` into a single re-render that happens after the handler finishes, so reading `a`/`b` right after calling the setters gives stale values.

---

### 6. What does this render for `user = null`?

```jsx
function Greeting({ user }) {
  return <div>Hello, {user.name}!</div>;
}
```

**Answer:** It throws at render time: `Cannot read properties of null (reading 'name')`, which crashes the component (and, without an error boundary, the whole tree below the boundary).

**Why:** JSX expressions inside `{}` are evaluated eagerly during render. There's no built-in optional chaining safety net — `user.name` is accessed directly, so a `null` user throws a TypeError before React ever gets to build the element tree for this component.

---

### 7. What's rendered in the DOM after this list renders?

```jsx
function List({ names }) {
  return (
    <ul>
      {names.map(name => (
        <React.Fragment key={name}>
          <li>{name}</li>
          <li className="sep">—</li>
        </React.Fragment>
      ))}
    </ul>
  );
}
```

**Answer:** A flat `<ul>` containing pairs of `<li>` elements (name, then separator) for each name, with no extra wrapper elements around each pair.

**Why:** `React.Fragment` (with an explicit `key`, required here since it's in a list) groups multiple children without adding a DOM node. Only fragments with a `key` prop can be written as `<React.Fragment key={...}>`; the shorthand `<>` syntax doesn't accept props/keys.
