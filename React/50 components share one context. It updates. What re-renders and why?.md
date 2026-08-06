When a React Context provider's value updates, **all 50 components that consume that context (via `useContext(MyContext)` or `<MyContext.Consumer>`) will re-render.**

Here is the exact breakdown of *why* this happens, why `React.memo` won't save them, and how to fix it.

---

### Why Do All 50 Consumers Re-Render?

1. **Context Bypasses `React.memo` and `shouldComponentUpdate`:**
React's Context mechanism is intentionally designed to propagate changes downward through the tree directly to subscribers. When a Context Provider gets a new `value`, React marks **every subscriber component** as needing an update. Wrapping consumer components in `React.memo` will **not** prevent them from re-rendering when the context value changes.
2. **Reference Equality Check (`Object.is`):**
React determines if a context value has changed by comparing the new value with the old value using `Object.is`.
If your context value is an object or array created inline inside the provider (e.g., `<MyContext.Provider theme user, value="{{" }}>`), a **new object reference is created on every provider render**. This causes `Object.is` to return `false`, triggering a re-render in all 50 consumers—even if `user` and `theme` primitive values didn't actually change!
3. **Lack of Granular Selector Subscriptions in Standard Context:**
Native React Context does **not** support fine-grained selector subscriptions. Even if Consumer #1 only reads `context.theme` and Consumer #2 reads `context.user`, both will re-render whenever *any* property on the shared context object changes.

---

### What About the 50 Components' Children?

* **Subscribers:** Re-render automatically.
* **Children of Subscribers:** Will re-render by default **unless** those child components are wrapped in `React.memo` or use `useMemo`/`children` props patterns.

---

### How to Fix / Optimize This Pattern

If only a few components care about a specific piece of state, you shouldn't force all 50 components to update. Use these architectural strategies:

#### Solution 1: Split the Context (Recommended Native Approach)

Instead of one monolithic context object containing multiple pieces of state, split them into smaller, single-purpose contexts.

```tsx
// ❌ BAD: One giant context
const AppContext = createContext({ user: null, theme: 'light', cart: [] });

// ✅ GOOD: Split into isolated contexts
const UserContext = createContext(null);
const ThemeContext = createContext('light');
const CartContext = createContext([]);

```

*Components subscribing to `ThemeContext` will no longer re-render when `CartContext` updates.*

---

#### Solution 2: Memoize the Provider Value

If the provider re-renders due to parent state changes, memoize the context payload so subscribers don't update unnecessarily.

```tsx
// Prevents value reference from changing unless `theme` or `user` actually change
const contextValue = useMemo(() => ({ theme, user }), [theme, user]);

return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;

```

---

#### Solution 3: Use an Atomic State Library (Zustand / Jotai)

For high-frequency or large-scale global state shared across dozens of components, replace React Context with an external store library that supports **selector subscriptions**.

```tsx
// With Zustand, Component A only re-renders when `theme` changes!
const theme = useStore((state) => state.theme);

```
