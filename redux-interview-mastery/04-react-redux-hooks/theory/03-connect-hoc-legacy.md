# The Legacy `connect(mapStateToProps, mapDispatchToProps)` Pattern

Before hooks existed in React (pre-16.8) and before `react-redux` added hook support, `connect` was the *only* way to wire a component to the Redux store. It's still common in older, unmigrated codebases, and interviewers test it specifically because you may need to read (or migrate) legacy code.

## The shape

```jsx
import { connect } from 'react-redux';

class CartBadge extends React.Component {
  render() {
    return <span className="badge">{this.props.itemCount}</span>;
  }
}

const mapStateToProps = (state) => ({
  itemCount: state.cart.items.length,
});

const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch({ type: 'cart/cleared' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartBadge);
```

`connect` is a **higher-order component (HOC)**: a function that takes your component and returns a new, wrapped component. The wrapper subscribes to the store, computes `mapStateToProps(state)` and `mapDispatchToProps(dispatch)` on every relevant change, and passes the results down as props to your original component — which itself never touches the store directly.

## `mapDispatchToProps` shorthand

A common shorthand: passing an object of action creators directly instead of a function, letting `connect` auto-wrap each one in `dispatch(...)` for you:

```jsx
import { itemAdded, itemRemoved } from './cartSlice';

// Object shorthand — connect wraps each action creator with dispatch automatically
export default connect(mapStateToProps, { itemAdded, itemRemoved })(CartBadge);
// this.props.itemAdded(product) internally calls dispatch(itemAdded(product))
```

## Why hooks mostly replaced `connect`

- **Less indirection**: `connect` requires defining `mapStateToProps`/`mapDispatchToProps` as separate functions, then wrapping the component — three moving pieces for even a simple case. `useSelector`/`useDispatch` let you read state and dispatch actions directly inline in the component body, function-call style.
- **Composability**: stacking multiple HOCs (`connect(...)( withRouter( withStyles(...)(Component) ) )`) creates deeply nested wrapper trees that are harder to trace in React DevTools and awkward to type in TypeScript (each HOC's prop types have to compose correctly). Hooks avoid the wrapper-component layer entirely.
- **Granularity**: with `connect`, a single `mapStateToProps` computing multiple fields means the whole component re-renders if *any* of those fields change; with multiple separate `useSelector` calls, each one is independently compared, which can (with care) be finer-grained — though `connect`'s default shallow-equality check across its combined props object is often comparable in practice.
- **No class component requirement**: `connect` works with either class or function components, but was the *only* option for class components (since hooks don't exist there) — so class components in a codebase will always use `connect`, not `useSelector`/`useDispatch`, and won't be migrated to hooks without also converting the component to a function component.

## When you'll still see `connect` today

- Older codebases that haven't been migrated, often for cost/risk reasons rather than technical necessity.
- Any component that's still a **class component** for unrelated reasons (e.g., relies on `componentDidCatch` for error boundaries, which currently has no hook equivalent) — `connect` remains the only option there, since hooks cannot be used inside class components at all.
- Some libraries or codebases that adopted `connect` deeply enough (HOC composition patterns, `mapDispatchToProps` factories) that migrating is a larger, deliberate refactor rather than an incremental one.

See `problems/02-convert-connect-to-hooks.md` for a full worked migration of a class component from `connect` to function-component hooks.
