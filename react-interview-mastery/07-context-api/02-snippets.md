# Snippets: Context API

```jsx
// Basic createContext + Provider + useContext
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Panel />
    </ThemeContext.Provider>
  );
}

function Panel() {
  const theme = useContext(ThemeContext);
  return <div className={`panel panel--${theme}`}>Panel content</div>;
}
```

```jsx
// Default value is used only when there's no Provider above
const LocaleContext = createContext('en-US');

function LanguageLabel() {
  const locale = useContext(LocaleContext); // 'en-US' if rendered outside a Provider
  return <span>{locale}</span>;
}
```

```jsx
// Custom hook wrapper that throws if used outside its Provider
const AuthContext = createContext(undefined);

function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

```jsx
// Memoizing the provider value to avoid a new object every render
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addItem = useCallback((item) => setItems((prev) => [...prev, item]), []);
  const value = useMemo(() => ({ items, addItem }), [items, addItem]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
```

```jsx
// Splitting state and dispatch contexts (dispatch is stable, avoids extra re-renders)
const CountStateContext = createContext();
const CountDispatchContext = createContext();

function countReducer(state, action) {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    default: return state;
  }
}

function CountProvider({ children }) {
  const [count, dispatch] = useReducer(countReducer, 0);
  return (
    <CountStateContext.Provider value={count}>
      <CountDispatchContext.Provider value={dispatch}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  );
}

function CountDisplay() {
  const count = useContext(CountStateContext);
  return <p>{count}</p>;
}

function CountButtons() {
  const dispatch = useContext(CountDispatchContext); // never causes CountDisplay to re-render
  return (
    <>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

```jsx
// Nesting multiple providers cleanly
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

```jsx
// Consuming context conditionally based on a prop, not re-creating the context itself
function Avatar({ useCurrentUser }) {
  const { user } = useAuth();
  const displayUser = useCurrentUser ? user : null;
  return <img src={displayUser?.avatarUrl ?? '/default-avatar.png'} alt="avatar" />;
}
```
