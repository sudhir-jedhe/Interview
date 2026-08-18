# The `Provider` Component

`Provider` is how a Redux store instance is made available to every component in a React tree, without manually threading it through props. It's the one piece of `react-redux` every hook (and `connect`) implicitly depends on.

## Basic usage

```jsx
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

Every component rendered inside `<Provider>` — at any depth — can call `useSelector`/`useDispatch` (or use `connect`) to reach the same `store` instance, with zero prop drilling.

## How it works under the hood

`Provider` is a thin wrapper around React Context: it creates (or uses an internally-managed) Context whose value includes the store instance and a subscription mechanism, and renders `<ReactReduxContext.Provider value={...}>` around its children. `useSelector` and `useDispatch` both call `useContext` internally to reach that value — this is precisely why they throw an error ("could not find react-redux context value... did you forget to wrap your root component in a `<Provider>`?") if used in a component tree that isn't wrapped in `<Provider>` anywhere above it.

```jsx
function CartBadge() {
  const count = useSelector((state) => state.cart.items.length);
  // internally: reads the store off Context, subscribes, runs the selector
  return <span>{count}</span>;
}
```

## One `Provider`, one store — usually

A React app almost always has exactly one `<Provider>` wrapping the whole app, with one store. Nested `<Provider>`s with *different* store instances are legal and occasionally used deliberately (e.g., isolating a self-contained widget with its own independent store, embedded inside a larger app) — components nested inside the inner `Provider` connect to the inner store; only the innermost matching `Provider` in the tree "wins" for a given component's `useSelector`/`useDispatch` calls.

## `Provider` and server-side rendering / testing

Because `Provider` is just Context, it's trivial to swap in a fresh store per request (SSR) or per test (unit/integration tests) — create a new store instance, wrap the component under test in `<Provider store={testStore}>`, and render normally. This is why testing Redux-connected components doesn't require mocking the store mechanism itself, just constructing a real (if minimal) store with the state you want the test to start from.

```jsx
// A typical test-utils wrapper
function renderWithStore(ui, { preloadedState, store = configureStore({ reducer: rootReducer, preloadedState }) } = {}) {
  return render(<Provider store={store}>{ui}</Provider>);
}
```

## What `Provider` is not

`Provider` doesn't create the store — you must construct it yourself (via `createStore`/`configureStore`) and pass it in as the `store` prop. `Provider` also doesn't do anything with middleware, reducers, or enhancers — all of that is fully resolved before the store instance ever reaches `Provider`; `Provider`'s only job is making that already-fully-configured store reachable via Context.
