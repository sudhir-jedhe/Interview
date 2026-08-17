# Interview Questions: Context API

**Q: What problem does the Context API solve?**

Prop drilling — passing data through many layers of components that don't themselves need the data, just to get it to a deeply nested consumer. Context lets any component below a `Provider` read a value directly via `useContext`, without every intermediate component having to accept and forward a prop.

---

**Q: Walk through the three pieces of using Context.**

`createContext(defaultValue)` creates a context object. `<MyContext.Provider value={...}>` wraps part of the tree and supplies the current value to all descendants. `useContext(MyContext)` reads that value from the nearest enclosing Provider, or falls back to the `defaultValue` if there's no Provider above it in the tree.

---

**Q: What happens to consumers when a Context's Provider value changes?**

Every component that calls `useContext` on that context re-renders, regardless of whether it reads the specific part of the value that actually changed. React does a reference equality check (`Object.is`) on the whole `value` — if it's a new object/array, every consumer re-renders even if the fields they individually care about are unchanged.

---

**Q: Why is it important to memoize the object passed to a Provider's `value` prop?**

Because an inline object literal (`value={{ user, setUser }}`) is a new reference on every render of the Provider component, which forces every consumer to re-render even when `user` hasn't actually changed. Wrapping it in `useMemo(() => ({ user, setUser }), [user])` keeps the reference stable across renders where the dependencies haven't changed, letting consumers skip unnecessary re-renders.

---

**Q: How do you avoid unrelated components re-rendering when only part of your context's value changes?**

Split one large context into several smaller, focused contexts, each holding only related data, and consume only the one(s) each component actually needs. A common variant: split a `useReducer`-backed context into a state context and a dispatch context, since `dispatch` is referentially stable and consumers that only dispatch actions (and never read state) won't re-render when state changes.

---

**Q: Is Context a replacement for a state management library like Redux?**

No, not fully. Context is a dependency-injection mechanism for passing a value down the tree — it has no built-in selectors, middleware, devtools, or fine-grained subscription model. For infrequently-changing, broadly-shared data (auth, theme, locale) it's often sufficient on its own. For state that updates frequently and is read selectively by many components, a store with selector-based subscriptions (Redux, Zustand, Jotai) avoids the "every consumer re-renders" cost that plain Context has.

---

**Q: How would you combine `useReducer` and Context to build a small global state pattern?**

Create a reducer with your state transition logic, call `useReducer` inside a Provider component, and expose `state` and `dispatch` (optionally in separate contexts) via `.Provider value={...}`. Any component below can call `useContext` to read state or get `dispatch` to send actions, without prop drilling either one.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    default: return state;
  }
}

function CountProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <CountContext.Provider value={{ state, dispatch }}>{children}</CountContext.Provider>;
}
```

---

**Q: What does `createContext` return, and what does its argument mean?**

It returns a context object with `.Provider` and `.Consumer` properties (the class-style `.Consumer` render-prop API still exists but `useContext` is preferred in function components). The argument is the default value, used only when a consuming component has no matching `Provider` anywhere above it in the tree — not a fallback used when the Provider's value happens to be falsy.

---

**Q: Can you have multiple Providers for the same context nested inside each other?**

Yes — a consumer reads from the *nearest* Provider above it in the tree. This lets you override a context's value for a specific subtree, e.g. a nested "preview mode" section that provides a different theme value than the rest of the app, without affecting siblings outside that subtree.

---

**Q: What's a good pattern for handling "context used outside its Provider" errors?**

Wrap `useContext` in a custom hook that throws a descriptive error if the value is the sentinel default (commonly `undefined`), instead of letting consumers silently receive `undefined` and fail later with a confusing error:

```jsx
function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

---

**Q: Does wrapping a component in `React.memo` prevent it from re-rendering when a context it consumes changes?**

No. `React.memo` only affects re-renders triggered by prop changes from the parent — it has no effect on re-renders triggered by a subscribed context's value changing. A memoized component that calls `useContext` still re-renders whenever that context's value reference changes, regardless of its memo status.

---

**Q: When would you choose prop drilling over Context, even for a value used a few levels down?**

When the number of intermediate levels is small (roughly 1-3) and the components in between are logically related to that data anyway. Prop drilling keeps data flow explicit and traceable in the component signatures, which can be more maintainable than introducing a Context for something simple, especially in code that's read more often than it's written.
