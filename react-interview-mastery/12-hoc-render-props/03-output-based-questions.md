# Output-Based Questions

### 1. What renders?
```jsx
function withUpperCase(Wrapped) {
  return function WithUpperCase({ text, ...rest }) {
    return <Wrapped text={text.toUpperCase()} {...rest} />;
  };
}
const Label = ({ text }) => <span>{text}</span>;
const UpperLabel = withUpperCase(Label);
function App() {
  return <UpperLabel text="hello" />;
}
```
**Answer:** `<span>HELLO</span>`

**Why:** The HOC intercepts `text`, transforms it, and passes the transformed value plus any remaining rest props down to `Label`. Straightforward prop transformation — no surprises here.

---

### 2. What happens when `App` re-renders?
```jsx
function withLoading(Wrapped) {
  return function WithLoading(props) {
    console.log('WithLoading render');
    return props.isLoading ? <p>Loading</p> : <Wrapped {...props} />;
  };
}
const Inner = (props) => {
  console.log('Inner render');
  return <p>data</p>;
};
const Enhanced = withLoading(Inner);
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Enhanced isLoading={false} />
    </>
  );
}
```
**Answer:** Both `"WithLoading render"` and `"Inner render"` log on every click.

**Why:** `Enhanced` (the `WithLoading` wrapper) is not memoized, so it re-renders whenever `App` re-renders, and since `isLoading` is `false`, it renders `Inner`, which also re-renders. This illustrates that a HOC adds an extra component in the re-render chain — no different from any other component tree in terms of re-render triggers.

---

### 3. What's wrong with this HOC, and what breaks at runtime?
```jsx
function withData(Wrapped) {
  Wrapped.defaultProps = { data: [] }; // mutating the original component
  return function WithData(props) {
    return <Wrapped {...props} />;
  };
}
const List = ({ data }) => <ul>{data.map((d, i) => <li key={i}>{d}</li>)}</ul>;
const EnhancedList = withData(List);
// elsewhere in the app, someone also renders <List /> directly (unwrapped)
```
**Answer:** Nothing crashes immediately, but `<List />` rendered directly elsewhere now also gets `defaultProps = { data: [] }` — a side effect the author of that other usage never opted into.

**Why:** The HOC mutates the original `Wrapped` component object instead of only configuring the new wrapper it returns. Because `List` is the *same reference* everywhere it's imported, mutating it leaks the HOC's behavior to every consumer, including ones that never call `withData`. HOCs should treat the wrapped component as read-only and only add behavior on the new component they create.

---

### 4. What does clicking the toggle button log, and in what order?
```jsx
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  console.log('Toggle render, on =', on);
  return children({ on, toggle: () => setOn(o => !o) });
}
function App() {
  console.log('App render');
  return (
    <Toggle>
      {({ on, toggle }) => {
        console.log('render prop function called, on =', on);
        return <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>;
      }}
    </Toggle>
  );
}
```
**Answer:** On initial mount: `"App render"`, `"Toggle render, on = false"`, `"render prop function called, on = false"`. After one click: only `"Toggle render, on = true"` and `"render prop function called, on = true"` — `"App render"` does not log again.

**Why:** `setOn` is state local to `Toggle`, so only `Toggle` re-renders (and the children function it calls, since that function is invoked fresh — it's not a separate component that could be skipped). `App` itself never re-renders because none of its own state changed and nothing forces it to.

---

### 5. Two HOCs both inject a prop called `status`. What does the button show?
```jsx
function withAuthStatus(Wrapped) {
  return (props) => <Wrapped {...props} status="authenticated" />;
}
function withNetworkStatus(Wrapped) {
  return (props) => <Wrapped {...props} status="offline" />;
}
const Display = ({ status }) => <p>{status}</p>;
const Enhanced = withAuthStatus(withNetworkStatus(Display));
```
**Answer:** `"offline"` — the innermost HOC's value wins.

**Why:** `Enhanced` renders `<WithNetworkStatus {...props} status="authenticated" />` (the outer `withAuthStatus` wrapper spreads its incoming props, then sets `status="authenticated"` after — that attribute order means "authenticated" wins *at that layer*). `WithNetworkStatus` then receives `status: "authenticated"` as an incoming prop, but its own JSX is `<Display {...props} status="offline" />` — it spreads the incoming props (including the "authenticated" it just received) and then overwrites `status` with its own hardcoded `"offline"` *after* the spread. Since explicit attributes placed after a spread always win in JSX, the innermost wrapper's hardcoded value overrides whatever the outer wrapper injected. This ordering-dependent, silent overwrite is exactly the naming-collision problem hooks avoid — the "winner" depends on wrapper nesting order and where each HOC places its attribute relative to its spread, which is easy to get backwards and has no compile-time warning.

---

### 6. Does the render-props version below cause the child function to be redefined and does that matter?
```jsx
function App() {
  const [count, setCount] = useState(0);
  return (
    <DataFetcher url="/api">
      {({ data }) => <p onClick={() => setCount(c => c + 1)}>{data}, {count}</p>}
    </DataFetcher>
  );
}
```
**Answer:** Yes, a brand-new inline function is created every time `App` renders, and it does matter for performance (though not for correctness): if `DataFetcher` were wrapped in `React.memo`, the new `children` function reference would defeat that memoization every render.

**Why:** Inline arrow functions passed as render props are recreated on every parent render just like any other inline function prop — the render-props pattern doesn't get special treatment from React. This is one of the concrete downsides of render props relative to hooks: there's no clean way to "memoize away" the child-function recreation without `useCallback`, which is exactly the ceremony hooks avoid needing in the first place.
