# Output: Does `connect` re-render on every dispatch, or does it also check equality?

```jsx
class UserGreeting extends React.Component {
  render() {
    console.log('render');
    return <span>Hello, {this.props.name}</span>;
  }
}

const mapStateToProps = (state) => ({ name: state.user.name });
const ConnectedUserGreeting = connect(mapStateToProps)(UserGreeting);

// Dispatches, in order:
dispatch({ type: 'user/nameChanged', payload: 'Ada' }); // changes state.user.name
dispatch({ type: 'ui/themeToggled' });                   // does NOT touch state.user
dispatch({ type: 'user/nameChanged', payload: 'Ada' });  // sets name to the SAME value it already had
```

**Answer:** `'render'` logs for the initial mount, then again for the first dispatch (name actually changed to `'Ada'`) — but **not** for the second dispatch (unrelated `ui/themeToggled`), and **not** for the third dispatch either (name is being set to the value it already is).

**Why:** `connect` (like `useSelector`) doesn't blindly re-render on every dispatch — it re-runs `mapStateToProps` after each dispatch and shallow-compares the resulting props object to the previous one, skipping the re-render if nothing meaningfully changed. The second dispatch doesn't touch `state.user` at all, so `mapStateToProps`'s output (`{ name: 'Ada' }` before, `{ name: 'Ada' }` after — wait, more precisely, the *reference* to `state.user.name` is unchanged since that slice wasn't touched) is unchanged, and `connect` skips re-rendering. The third dispatch does run the reducer (a real `user/nameChanged` action reaches it), but if the reducer correctly returns state unchanged when the new name equals the existing one (a well-written reducer would short-circuit, or even if it always returns a new object, `mapStateToProps`'s *output value* `'Ada'` is unchanged, which `connect`'s prop-level comparison still catches) — this illustrates that both `connect` and `useSelector` are built around the same underlying principle: compare selected *output* values, not raw dispatch counts, to decide whether to re-render.
