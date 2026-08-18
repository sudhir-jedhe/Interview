# Output: Using `useSelector` in a component not wrapped by `Provider`

```jsx
function Orphan() {
  const count = useSelector((state) => state.counter.count);
  return <span>{count}</span>;
}

// Rendered WITHOUT any <Provider> anywhere above it in the tree:
ReactDOM.createRoot(document.getElementById('root')).render(<Orphan />);
```

**Answer:** Throws an error at render time, roughly: `could not find react-redux context value; please ensure the component is wrapped in a <Provider>`.

**Why:** `useSelector` (and `useDispatch`) read the store off React Context internally, via `useContext(ReactReduxContext)`. If no `<Provider>` exists anywhere above the component in the tree, that context value is `null`/undefined, and `react-redux` deliberately throws a descriptive error rather than silently failing or returning `undefined` state — because silently proceeding with no store would produce much more confusing downstream errors (e.g., `Cannot read properties of undefined (reading 'counter')`) far from the actual root cause. This is a very common early mistake when setting up a new Redux app, or when a component is accidentally rendered in an isolated context (e.g., a naive unit test that renders the component directly without a test-specific `<Provider store={testStore}>` wrapper).
