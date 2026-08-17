# Core Concepts

## Higher-order components (HOCs)

A HOC is a **function that takes a component and returns a new component**, wrapping the original with extra behavior or props. It's not a React API — it's just a function composition pattern applied to components, analogous to a decorator.

```jsx
function withLoading(WrappedComponent) {
  return function WithLoading({ isLoading, ...rest }) {
    if (isLoading) {
      return <div className="spinner">Loading...</div>;
    }
    return <WrappedComponent {...rest} />;
  };
}

function UserProfile({ user }) {
  return <h1>{user.name}</h1>;
}

const UserProfileWithLoading = withLoading(UserProfile);

// usage
<UserProfileWithLoading isLoading={isFetching} user={user} />;
```

Key conventions: the HOC should **not mutate** the wrapped component, should **pass through unrelated props** (`...rest`), and its display name should be set for debugging (`WithLoading.displayName = \`withLoading(${WrappedComponent.displayName || WrappedComponent.name})\``) — otherwise React DevTools shows an anonymous component in the tree.

A more realistic HOC injects data rather than just gating render:

```jsx
function withUser(WrappedComponent) {
  return function WithUser(props) {
    const [user, setUser] = useState(null);
    useEffect(() => {
      fetchUser().then(setUser);
    }, []);
    return <WrappedComponent {...props} user={user} />;
  };
}
```

## Render props

A render prop is a prop whose value is a **function that returns JSX**, letting the consumer decide what to render while the provider component controls the *logic/state*.

```jsx
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, [url]);

  return children({ data, loading });
}

// usage
<DataFetcher url="/api/user">
  {({ data, loading }) => (loading ? <Spinner /> : <h1>{data.name}</h1>)}
</DataFetcher>;
```

The prop doesn't have to be literally called `children` — `render={fn}` is equally common and was the more idiomatic name before children-as-function became popular. Functionally identical:

```jsx
<DataFetcher url="/api/user" render={({ data, loading }) => (
  loading ? <Spinner /> : <h1>{data.name}</h1>
)} />
```

## Why hooks largely replaced both

**Composability.** Stacking multiple HOCs creates deep, hard-to-read nesting: `withAuth(withLoading(withTheme(withUser(Component))))`. Each layer adds an extra component to the tree ("wrapper hell") visible in DevTools as `WithAuth > WithLoading > WithTheme > WithUser > Component`, making debugging and prop-flow tracing harder. Hooks let you compose the same logic *inside* one function body:

```jsx
function Component(props) {
  const auth = useAuth();
  const isLoading = useLoadingState();
  const theme = useTheme();
  const user = useUser();
  // no extra tree depth, no wrapper components
}
```

**Naming collisions.** Two HOCs that both want to inject a prop called `data` or `loading` silently clash — whichever is applied last wins, and there's no compile-time warning. Custom hooks avoid this because each hook's return value is destructured explicitly by the consuming component with whatever local names it chooses.

**Render props' indentation problem.** Nesting several render-prop components (`<DataFetcher>{() => <ThemeProvider>{() => <Auth>{() => ...}}}</ThemeProvider>}</DataFetcher>`) produces a "pyramid of doom." Hooks flatten this to sequential `const` declarations.

**Static typing / refactoring friction.** HOCs are notoriously awkward to type correctly in TypeScript (`hoist-non-react-statics`, generic prop merging), while hooks have straightforward return types.

## When you'd still reach for a HOC today

- **Library integration** where the library's own API is HOC-based (e.g., older Redux `connect()`, some routing libraries' legacy APIs, React Router v5's `withRouter`).
- **Cross-cutting concerns that must wrap at the component (not hook) level**, such as error boundaries — a HOC like `withErrorBoundary(Component)` is reasonable because error boundaries *must* be class components and can't be expressed as a hook at all.
- **Enhancing components you don't own** (e.g., wrapping a third-party component to inject analytics tracking) where you can't add a hook call inside it.
