# Scenario Questions — Components & Props

### 1. Five-level-deep component tree needs the current user's theme preference

You're building a settings feature where `<App>` → `<Dashboard>` → `<Panel>` → `<Widget>` → `<WidgetHeader>` all need access to the user's `theme` value, but only `WidgetHeader` actually uses it — every component in between is just forwarding a `theme` prop it doesn't care about.

**Approach:** This is textbook prop drilling. Since `theme` is cross-cutting and low-frequency-changing, it's a good fit for Context, which lets `WidgetHeader` read it directly without every intermediate component's signature being coupled to it:

```jsx
const ThemeContext = React.createContext('light');

function App() {
  const [theme] = React.useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Dashboard />
    </ThemeContext.Provider>
  );
}

function Dashboard() { return <Panel />; }
function Panel() { return <Widget />; }
function Widget() { return <WidgetHeader />; }

function WidgetHeader() {
  const theme = React.useContext(ThemeContext);
  return <h3 className={`header-${theme}`}>Settings</h3>;
}
```

`Dashboard`, `Panel`, and `Widget` no longer need to know `theme` exists at all — their signatures stay clean, and adding new theme-consuming components anywhere in the tree doesn't require touching the intermediate layers.

---

### 2. Reusable `<Modal>` needs a different body every time it's used

You're building a `<Modal>` component used across the app — a confirmation dialog in one place, a form in another, an image gallery in a third — and the current implementation hardcodes the modal's body content, requiring a new prop (`confirmMessage`, `formFields`, `images`) for every use case.

**Approach:** This is a composition problem, not a props-shape problem. Instead of the modal knowing about every possible content type, let it accept `children`:

```jsx
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// usage — modal doesn't need to know what's inside
<Modal isOpen={isOpen} onClose={close} title="Confirm delete">
  <p>Are you sure? This can't be undone.</p>
  <button onClick={confirmDelete}>Delete</button>
</Modal>

<Modal isOpen={isOpen} onClose={close} title="Edit profile">
  <ProfileForm user={user} onSave={save} />
</Modal>
```

`Modal` now only owns layout/open-close/overlay concerns; the caller fully controls content via `children`, so no growing list of content-specific props is needed.

---

### 3. Child component's prop mutation causes a bug that only shows up intermittently

You're debugging a shopping cart where the item count displayed in the header sometimes doesn't match the actual cart contents, and the bug is hard to reproduce — it seems to depend on which components happen to render in what order.

**Approach:** Look for a component mutating a props object directly instead of treating it as read-only, most likely a shared array or object being passed down and modified in place somewhere (e.g. `props.cartItems.push(newItem)` or `props.cartItems.sort(...)` inside a child). Because JS objects/arrays are passed by reference, such a mutation silently corrupts the same data other components (like the header) are also holding a reference to, without going through `setState` — so React doesn't know to re-render everyone consistently, producing timing-dependent inconsistencies. The fix is to audit every place that receives array/object props and ensure none of them mutate directly; always derive a new array/object and pass it up via a callback prop instead:

```jsx
// Wrong
function CartList({ items }) {
  items.sort((a, b) => a.price - b.price); // mutates the parent's array
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}

// Correct
function CartList({ items }) {
  const sorted = [...items].sort((a, b) => a.price - b.price); // new array, local only
  return <ul>{sorted.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}
```

---

### 4. Building a generic `<Table>` component that different teams want to customize differently

You're building a shared `<Table>` component for a design system, and different consuming teams each want to customize the header, row rendering, and empty state differently — a single fixed prop API (`headerText`, `rowFormat`, `emptyMessage`) is turning into an unmanageable pile of narrow, single-purpose props.

**Approach:** Move from "data-in, fixed-markup-out" props to composition/render-based props for the parts that vary structurally, while keeping simple scalar props for things that are genuinely just values:

```jsx
function Table({ columns, data, renderEmpty, children }) {
  if (data.length === 0) {
    return renderEmpty ? renderEmpty() : <p>No data</p>;
  }
  return (
    <table>
      <thead>{children}</thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id ?? i}>
            {columns.map(col => <td key={col.key}>{col.render(row)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// usage — each team supplies its own header markup and column renderers
<Table
  columns={[
    { key: 'name', render: row => <strong>{row.name}</strong> },
    { key: 'status', render: row => <StatusPill status={row.status} /> },
  ]}
  data={users}
  renderEmpty={() => <EmptyState icon="users" text="No users yet" />}
>
  <tr><th>Name</th><th>Status</th></tr>
</Table>
```

This keeps `Table`'s core prop surface (columns, data) simple while letting consumers inject custom markup for the parts that legitimately differ per use case, instead of the component trying to anticipate every formatting need with more scalar props.
