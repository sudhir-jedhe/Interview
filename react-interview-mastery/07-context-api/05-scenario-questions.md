# Scenario Questions: Context API

### Scenario 1: A single "app state" context is causing the whole app to lag on every keystroke

You're building a dashboard with a single `AppContext` holding `{ user, theme, searchQuery, notifications }`, updated from various places, including a search box that updates `searchQuery` on every keystroke. Users on lower-end devices report the whole app feels laggy while typing in search.

**Approach:** Every keystroke updates `searchQuery`, which changes the single bundled context object, which re-renders *every* consumer of `AppContext` — including components that only care about `user` or `theme` and have nothing to do with search. Split the context by concern so unrelated consumers stop re-rendering:

```jsx
const UserContext = createContext();
const ThemeContext = createContext();
const SearchContext = createContext();
const NotificationsContext = createContext();

function AppProviders({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);

  return (
    <UserContext.Provider value={useMemo(() => ({ user, setUser }), [user])}>
      <ThemeContext.Provider value={useMemo(() => ({ theme, setTheme }), [theme])}>
        <SearchContext.Provider value={useMemo(() => ({ searchQuery, setSearchQuery }), [searchQuery])}>
          <NotificationsContext.Provider value={useMemo(() => ({ notifications, setNotifications }), [notifications])}>
            {children}
          </NotificationsContext.Provider>
        </SearchContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

Now typing in search only re-renders components subscribed to `SearchContext`. If search results themselves are rendered from a large list, additionally debounce the query before it hits state, and consider `React.memo` on list rows.

---

### Scenario 2: A theme toggle button re-renders the entire page tree

You're building a theme toggle in the header. Clicking it flips `ThemeContext`'s value between `light` and `dark`, but you notice (via React DevTools profiler) that a large, unrelated data table below re-renders every time, even though it doesn't read `ThemeContext` at all.

**Approach:** First verify the data table genuinely doesn't call `useContext(ThemeContext)` anywhere in its subtree — if it truly doesn't, the re-render isn't caused by context at all, it's caused by the table being a child of a component that re-renders for other reasons (e.g., the header and table share a common non-memoized parent that re-renders on state change, cascading to all children by default).

```jsx
function Page() {
  const [theme, setTheme] = useState('light'); // lives in Page, so Page re-renders on toggle
  return (
    <>
      <Header theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
      <DataTable /> {/* re-renders too, just because Page re-rendered */}
    </>
  );
}
```

Fix by moving the theme state (and its Provider) into a component that only wraps what actually needs it, or by wrapping `DataTable` in `React.memo` so it skips re-rendering when its own props haven't changed:

```jsx
const DataTable = React.memo(function DataTable() { /* ... */ });
```

If the app does use `ThemeContext` and `DataTable` legitimately doesn't consume it, `React.memo` alone won't help if `DataTable` is inside the `ThemeProvider`'s children and something else about the parent re-renders — the fix there is ensuring `ThemeProvider`'s `value` is memoized so its own re-renders (for unrelated reasons) don't create a new context value.

---

### Scenario 3: Building a shopping cart with Context + useReducer, but action creators are duplicated everywhere

You're building a cart feature with Context + `useReducer`. Multiple components dispatch actions like `dispatch({ type: 'ADD_ITEM', payload: item })` directly, and a typo in an action type (`'ADD_ITME'`) silently does nothing because the reducer's `default` case just returns the state unchanged, with no error.

**Approach:** Two improvements: centralize action creators as functions exported alongside the context, and make the reducer loud about unknown actions in development.

```jsx
const CartContext = createContext();
const CartDispatchContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
    default:
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Unknown cart action: ${action.type}`);
      }
      return state;
  }
}

// Action creators — the only sanctioned way to dispatch, so typos are caught by imports, not strings
export const cartActions = {
  addItem: (item) => ({ type: 'ADD_ITEM', payload: item }),
  removeItem: (id) => ({ type: 'REMOVE_ITEM', payload: { id } }),
};

function useCartDispatch() {
  const dispatch = useContext(CartDispatchContext);
  if (!dispatch) throw new Error('useCartDispatch must be used within CartProvider');
  return dispatch;
}

// usage in a component
const dispatch = useCartDispatch();
dispatch(cartActions.addItem(item)); // typo-proof, autocompletable
```

This is essentially reinventing a small slice of what Redux gives you for free — worth calling out to the team as a signal that if the cart logic grows further, a proper state library might pay for itself.

---

### Scenario 4: A `useAuth()` hook returns `undefined` and crashes a component in production, but not in tests

Your app crashes with "Cannot read properties of undefined" when calling `user.name` inside a component using `useContext(AuthContext)`. It works fine in tests because tests always wrap the component in `<AuthProvider>`, but in production a newly added route was rendered outside the provider tree by mistake.

**Approach:** Guard the context consumption with a custom hook that throws a clear, early error rather than letting `undefined` silently propagate into a cryptic runtime error deep in the render:

```jsx
const AuthContext = createContext(undefined);

function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>. Did you forget to wrap this route?');
  }
  return ctx;
}
```

This turns a confusing "cannot read property of undefined" (pointing at the wrong line) into an immediate, actionable error at the exact point of misuse. Then fix the actual routing bug — likely the new route was added as a sibling of `<AuthProvider>` in the router config instead of a child. This pattern (default value `undefined` + throwing wrapper hook) is worth using for every context that's genuinely required, not optional.
