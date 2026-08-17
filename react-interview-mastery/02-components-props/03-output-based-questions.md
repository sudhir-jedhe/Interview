# Output-Based Questions — Components & Props

### 1. What happens on click?

```jsx
function List({ items }) {
  function handleClick() {
    items.push('new item');
    console.log(items);
  }
  return (
    <div>
      <ul>{items.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
      <button onClick={handleClick}>Add</button>
    </div>
  );
}
```

**Answer:** The `console.log` shows the array with `'new item'` appended, but the UI never updates to show it — the `<ul>` stays visually unchanged.

**Why:** `items.push` mutates the array in place but doesn't call any state setter, so React has no signal that anything changed and never re-renders. Even if a parent's `useState` owns this array, mutating it directly (instead of calling `setItems([...items, 'new item'])`) breaks React's re-render trigger, which is a `setState` call — not a change to the underlying reference contents.

---

### 2. What renders?

```jsx
function Box({ children }) {
  return <div className="box">{children}</div>;
}

function App() {
  return <Box />;
}
```

**Answer:** `<div class="box"></div>` — an empty box, no error.

**Why:** `children` is `undefined` when nothing is nested between `<Box>` and `</Box>` (and there's no self-closing content). React happily renders `undefined` as nothing, so the div is just empty rather than throwing.

---

### 3. What does the console show?

```jsx
function Child({ user }) {
  user.name = 'Changed'; // eslint would flag this
  return <p>{user.name}</p>;
}

function Parent() {
  const user = { name: 'Original' };
  return (
    <div>
      <Child user={user} />
      <p>Parent still sees: {user.name}</p>
    </div>
  );
}
```

**Answer:** The page shows "Changed" from `Child` and "Parent still sees: Changed" from `Parent`.

**Why:** Objects are passed by reference. `Child` mutating `user.name` directly modifies the same object `Parent` holds, so both components see the mutated value — even though `Parent` never called a setter and has no idea its data changed. This illustrates why "props are read-only" is a discipline convention, not something React enforces at runtime; violating it causes action-at-a-distance bugs, especially once `user` is actual `useState` state (mutating it wouldn't even trigger a re-render, unlike this plain-object example).

---

### 4. What's logged, and in what order?

```jsx
function Child({ value }) {
  console.log('Child render', value);
  return <span>{value}</span>;
}

function Parent() {
  const [count, setCount] = React.useState(0);
  console.log('Parent render', count);
  return (
    <div>
      <Child value={count} />
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

**Answer:** Initial mount logs `Parent render 0` then `Child render 0`. Each click logs `Parent render N` then `Child render N`.

**Why:** Rendering flows top-down: React calls `Parent` first to get its returned element tree, then calls `Child` (since it's part of that tree) to resolve it further. Without `React.memo` on `Child`, every parent re-render also re-renders `Child`, regardless of whether `value` actually changed.

---

### 5. What happens here?

```jsx
function Card({ title = 'Untitled' }) {
  return <h2>{title}</h2>;
}

function App() {
  return <Card title={undefined} />;
}
```

**Answer:** Renders `<h2>Untitled</h2>`.

**Why:** Destructuring default values kick in specifically when the value is `undefined` — not when it's missing entirely vs. explicitly passed as `undefined`, both behave the same way. This differs from passing `title={null}`, which would render an empty `<h2></h2>` because `null` is a defined value and doesn't trigger the default.

---

### 6. What does this render?

```jsx
function Wrapper({ children }) {
  return <div>{children}</div>;
}

function App() {
  return (
    <Wrapper>
      {[1, 2, 3].map(n => <span key={n}>{n}</span>)}
      Hello
    </Wrapper>
  );
}
```

**Answer:** A `<div>` containing three `<span>` elements (1, 2, 3) followed by the text "Hello" — `children` here is an array mixing elements and a string.

**Why:** JSX allows multiple children of mixed types; React normalizes them into an array under `props.children` when there's more than one child. Components consuming `children` don't need to know or care whether it's a single node, a string, or an array — `{children}` just renders whatever it is.

---

### 7. What's wrong with this component (and what does it do at runtime)?

```jsx
function UserCard(props) {
  props.formatted = props.firstName + ' ' + props.lastName;
  return <p>{props.formatted}</p>;
}
```

**Answer:** It technically renders the correct full name and doesn't crash, but it's mutating the `props` object.

**Why:** Assigning a new key onto `props` directly mutates the object React passed in. It happens to "work" visually in this simple case because nothing else reads `props.formatted` before this render, but it violates the read-only-props contract: if `React.memo` or `PureComponent`-style shallow comparisons were involved anywhere, or if the same props object were reused/diffed elsewhere, this mutation could cause subtle bugs. The correct approach is a local variable: `const formatted = props.firstName + ' ' + props.lastName;`.
