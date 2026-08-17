# Notes: Context API

## The mechanics

Context has three parts: create it, provide a value somewhere in the tree, and consume it anywhere below.

```jsx
const ThemeContext = createContext('light'); // default value, used if no Provider is above

function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <Button />; // doesn't need to know about theme at all
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

`Toolbar` never touches `theme` — that's the point. Without Context, `theme` would have to be passed as a prop through every intermediate component (`Toolbar`) even though only `Button` cares about it. That's prop drilling, and it gets unwieldy fast in deep trees or when many unrelated components need the same piece of data (current user, theme, locale, feature flags).

The default value passed to `createContext(defaultValue)` is only used when a component calls `useContext` and there is no matching `Provider` above it in the tree — useful for testing components in isolation, or as a sane fallback.

## The re-render cost

This is the detail interviewers probe hardest. **Every component that calls `useContext(SomeContext)` re-renders whenever the `value` prop passed to `SomeContext.Provider` changes** — React compares the new value to the old one with `Object.is`, and if they differ, all consumers re-render, full stop. It does not matter if the consumer only destructures one field out of a larger object.

```jsx
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // New object every render — even if only `notifications` changed,
  // every consumer that reads `user` also re-renders.
  const value = { user, setUser, notifications, setNotifications };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

Two compounding problems here: first, `value` is a brand-new object literal on every render of `AppProvider`, so it fails the `Object.is` check even when nothing meaningful changed (fix with `useMemo`). Second, even with memoization, if `notifications` updates, every consumer re-renders — including ones that only care about `user` — because Context doesn't do selective/fine-grained subscriptions like some external libraries do.

```jsx
const value = useMemo(
  () => ({ user, setUser, notifications, setNotifications }),
  [user, notifications]
);
```

That fixes the "new object every render" problem, but not the "unrelated consumers re-render" problem — for that, split contexts.

## Splitting contexts

If a provider bundles unrelated pieces of state together, split it into separate contexts so consumers only subscribe to what they actually need:

```jsx
const UserContext = createContext();
const NotificationsContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  return (
    <UserContext.Provider value={user}>
      <NotificationsContext.Provider value={notifications}>
        {children}
      </NotificationsContext.Provider>
    </UserContext.Provider>
  );
}
```

A common related pattern: split **state** from **dispatch** into two contexts when using `useReducer`, since the dispatch function is referentially stable (from `useReducer`) and rarely needs to trigger re-renders on its own.

## Context vs external state libraries

Context is built into React and is great for low-frequency-update, broadly-needed data: theme, locale, authenticated user, feature flags. It is not a full state management solution — it has no selectors, no fine-grained subscriptions, no middleware, and no devtools out of the box. For high-frequency updates (e.g., a value changing on every keystroke or every animation frame) consumed by many components, an external store (Redux, Zustand, Jotai) that supports selector-based subscriptions will avoid the "everyone re-renders" problem entirely.

## Context + useReducer

Pairing `useContext` with `useReducer` gives you a small, dependency-free global store: a single dispatch function, predictable state transitions, and no prop drilling.

```jsx
const CountContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

function CountProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <CountContext.Provider value={{ state, dispatch }}>
      {children}
    </CountContext.Provider>
  );
}
```
