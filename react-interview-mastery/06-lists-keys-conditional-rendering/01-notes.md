# Notes: Lists, Keys & Conditional Rendering

## Rendering arrays

React doesn't have a special "list" construct — you just build an array of JSX elements, usually with `.map()`, and put it wherever you'd put any other expression:

```jsx
function ItemList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
}
```

`.map()` returns a real JS array, and React knows how to render arrays of elements. Each element in that array needs a `key` prop so React can identify it across re-renders.

## Why keys exist

React's reconciliation is a diffing algorithm: on every render it compares the new element tree to the previous one and computes the minimal set of DOM mutations. For children of the same parent, React needs a stable identity for each child to know "is this the same logical item, just moved/updated, or is it a brand new item?"

Without keys (or with keys that don't uniquely identify the item), React falls back to matching children by **position**. That's fine if the list never reorders, filters, or has items inserted/removed from the middle. It breaks badly otherwise, because React will reuse the DOM node — and any state hooks attached to a component instance at that position — for whatever item now happens to occupy that index.

## The index-as-key bug, concretely

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoRow key={index} todo={todo} />
      ))}
    </ul>
  );
}

function TodoRow({ todo }) {
  const [editing, setEditing] = useState(false);
  return editing ? (
    <input defaultValue={todo.text} onBlur={() => setEditing(false)} />
  ) : (
    <li onClick={() => setEditing(true)}>{todo.text}</li>
  );
}
```

Say you click row 2 to edit it (`editing` becomes `true` for the component instance at index `2`). Now the user deletes row 0. Every item shifts up by one index. React sees "index 2 still exists" and reuses that same component instance — including its `editing === true` state — but now it's rendering a *different todo's* text in edit mode. The edit UI appears to have jumped to the wrong row. This is the single most common key-related bug in React interviews and real code.

The fix: key by something stable and unique to the data, like `todo.id` from your database, not the array position.

## Key uniqueness scope

Keys only need to be unique **among siblings** — not globally across the whole app. Two different `.map()` calls in two different lists can reuse the same key values without conflict, because React compares keys within a single parent's children, not across the whole tree.

```jsx
// fine — these are two separate sibling groups
<div>
  {users.map((u) => <UserCard key={u.id} user={u} />)}
</div>
<div>
  {posts.map((p) => <PostCard key={p.id} post={p} />)}
</div>
```

## Conditional rendering

Common patterns:

```jsx
{isLoggedIn && <Dashboard />}
{isLoggedIn ? <Dashboard /> : <LoginForm />}
{user ?? <GuestBanner />}
if (!data) return <Spinner />;
```

### The `count && <Component />` trap

`&&` short-circuits on any falsy value, but JSX renders the falsy value itself if it isn't `false`, `null`, or `undefined`. `0` is falsy but React *will* render it as text:

```jsx
function Cart({ itemCount }) {
  return (
    <div>
      {itemCount && <Badge count={itemCount} />}
    </div>
  );
}
// itemCount === 0 → renders a literal "0" on the page, not nothing
```

Fix by forcing a boolean or using a ternary:

```jsx
{itemCount > 0 && <Badge count={itemCount} />}
{Boolean(itemCount) && <Badge count={itemCount} />}
{itemCount ? <Badge count={itemCount} /> : null}
```

`NaN` has the same problem and is arguably worse since it's harder to spot in review.

## Gotchas checklist

- Never use array index as key when the list can reorder, filter, or insert/delete from the middle.
- It's fine to use index as key for a genuinely static list that never changes (rare in practice — treat it as a code smell).
- Keys are not passed to your component as a prop — if you need the id inside the component, pass it explicitly (`<Row key={id} id={id} />`).
- `.map()` without a `return` (implicit arrow body) is a common bug — `items.map(item => { doStuff(item) })` returns `undefined` for every item.
