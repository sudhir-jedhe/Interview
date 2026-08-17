# Snippets: Design Patterns & Anti-Patterns

### 1. Compound component sharing implicit state via context
```jsx
const AccordionContext = createContext();

function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      {children}
    </AccordionContext.Provider>
  );
}

function AccordionItem({ index, title, children }) {
  const { openIndex, setOpenIndex } = useContext(AccordionContext);
  const isOpen = openIndex === index;
  return (
    <div>
      <button onClick={() => setOpenIndex(isOpen ? null : index)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

### 2. Controlled input vs uncontrolled input with a ref
```jsx
function ControlledInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

function UncontrolledInput() {
  const ref = useRef(null);
  function handleSubmit() {
    console.log(ref.current.value); // read only when needed
  }
  return (
    <>
      <input ref={ref} defaultValue="" />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

### 3. Composition instead of prop drilling
```jsx
// Layout no longer needs to know or forward "sidebar" content
function Layout({ children, sidebar }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Layout sidebar={<UserMenu />}>
      <Dashboard />
    </Layout>
  );
}
```

### 4. Fixing a nested ternary with a status-to-component map
```jsx
const STATUS_VIEWS = {
  loading: <Spinner />,
  error: <ErrorMsg />,
  empty: <EmptyState />,
};

function StatusView({ status, items }) {
  return STATUS_VIEWS[status] ?? <List items={items} />;
}
```

### 5. Immutable state update for a nested object
```jsx
function updateAddress(setUser, city) {
  setUser((prev) => ({
    ...prev,
    address: { ...prev.address, city },
  }));
}
```

### 6. Stable keys derived from data, not index
```jsx
function TodoList({ todos, onRemove }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => onRemove(todo.id)}>x</button>
        </li>
      ))}
    </ul>
  );
}
```

### 7. Deriving a value during render instead of syncing via useEffect
```jsx
function PriceSummary({ items }) {
  // no effect, no extra state — just computed on every render
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return <p>Total: ${total.toFixed(2)}</p>;
}
```
