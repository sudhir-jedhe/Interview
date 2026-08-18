# Problem: Convert a Class Component Using `connect` to Function-Component Hooks

## Task

Convert the class component below — which uses `connect` with both `mapStateToProps` and `mapDispatchToProps` (function form), plus a lifecycle method — into a function component using `useSelector`, `useDispatch`, and `useEffect`, preserving identical behavior.

## Given (legacy) code

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { fetchUser, userCleared } from './userSlice';

class UserProfile extends React.Component {
  componentDidMount() {
    this.props.fetchUser(this.props.userId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.props.fetchUser(this.props.userId);
    }
  }

  componentWillUnmount() {
    this.props.userCleared();
  }

  render() {
    const { user, loading, error } = this.props;
    if (loading) return <Spinner />;
    if (error) return <ErrorBanner message={error} />;
    return <div>{user.name} — {user.email}</div>;
  }
}

const mapStateToProps = (state) => ({
  user: state.user.data,
  loading: state.user.loading,
  error: state.user.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (id) => dispatch(fetchUser(id)),
  userCleared: () => dispatch(userCleared()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
```

## Solution — converted function component

```jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, userCleared } from './userSlice';

function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(fetchUser(userId));

    return () => {
      dispatch(userCleared());
    };
  }, [userId, dispatch]);

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  return <div>{user.name} — {user.email}</div>;
}

export default UserProfile;
```

## Mapping table: which lifecycle/connect piece became what

| Legacy | Hooks equivalent |
|---|---|
| `mapStateToProps`'s three fields | Three separate `useSelector` calls (narrower than the original combined object — a free improvement) |
| `mapDispatchToProps`'s `fetchUser`/`userCleared` | `useDispatch()` once, then calling the imported action creators directly at each call site |
| `componentDidMount` + `componentDidUpdate` (re-fetching on `userId` change) | A single `useEffect` with `[userId, dispatch]` as its dependency array — runs on mount and whenever `userId` changes, matching both lifecycle methods' combined behavior |
| `componentWillUnmount` | The `useEffect`'s cleanup function (the `return () => {...}` inside it) |
| `this.props.userId` (passed in from a parent, e.g., via `connect`'s `ownProps` or a router param) | A plain function parameter/prop, `{ userId }` |

## Interview follow-ups this problem invites

- "Why combine `componentDidMount` and `componentDidUpdate` into one `useEffect` instead of two separate hooks?" `useEffect` with a dependency array already runs on mount *and* on every subsequent render where a listed dependency changed — that's the built-in semantics that replaces needing two separate lifecycle methods to express "run on mount, and also re-run when this prop changes."
- "Is it safe to call `dispatch(fetchUser(userId))` directly in the effect body instead of storing `fetchUser`/`userCleared` as bound props like the class version did?" Yes, and it's the idiomatic hooks approach — since `dispatch` is a stable reference (per `output-based/03-useDispatch-reference-stability.md`) and the imported action creators are plain functions (also stable, since they're module-level, not recreated per render), there's no need to pre-bind them the way `mapDispatchToProps` did; calling `dispatch(actionCreator(...))` directly is simpler and equally safe to include in a dependency array.
- "What would you need to change if `fetchUser` were a `createAsyncThunk` instead of a plain thunk?" Nothing about this component — `dispatch` works identically whether the dispatched value is a hand-written thunk function or a `createAsyncThunk`-generated one; the difference is entirely inside `userSlice.js`'s implementation, not in how the component calls `dispatch`.
