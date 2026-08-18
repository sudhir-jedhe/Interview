# Redux vs React Context

This is the single most common "why not just use X" question in Redux interviews, and it's also the one candidates most often get subtly wrong by treating Context and Redux as competitors solving the same problem. They aren't quite that.

## Context is dependency injection, not state management

`React.createContext` solves exactly one problem: avoiding prop drilling by letting a value be read from anywhere below a `Provider` without threading it through every intermediate component. It is a *transport mechanism*. It has no opinion about how the value it carries changes over time, no built-in update logic, and no concept of "action" or "reducer" unless you add one yourself.

```javascript
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar /> {/* can read the theme without props */}
    </ThemeContext.Provider>
  );
}
```

Nothing here manages *state* — `value="dark"` is just a static prop. Context becomes something resembling state management only once you pair it with `useState` or `useReducer` to hold the value that gets passed down.

## Context + useReducer becomes "Redux-lite"

```javascript
const CartContext = React.createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'itemAdded':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}
```

This genuinely replicates Redux's core loop — dispatch an action, a pure reducer computes new state, consumers re-render — for a single, localized piece of state. For small-to-medium apps, or state scoped to one feature/subtree, this is a completely legitimate choice and avoids a dependency.

## What you don't get without extra work

Three things Redux (or Zustand, or any dedicated store) gives you essentially for free that `useContext`+`useReducer` does not:

1. **No middleware pipeline.** There's no equivalent of `applyMiddleware` — if you want logging, async side effects via thunks, or analytics-on-every-action, you write that by hand inside (or wrapping) your `dispatch`, every time, per context.
2. **No DevTools/time-travel debugging.** Redux DevTools can inspect and replay the full action history because the store exposes a subscription API DevTools plugs into. A `useReducer` inside a component has no equivalent external hook.
3. **No built-in selector-based render optimization.** Every consumer of a context re-renders whenever *any* value passed to the `Provider` changes — Context has no concept of "subscribe to just this slice," unlike `useSelector`, which only re-renders a component when its specific selected value changes. Combining several pieces of frequently-changing state in one context provider is a well-known perf trap for exactly this reason.

## The honest interview answer

"Context is for passing values down the tree; Redux is for managing how those values change over time, with tooling around that change." They're complementary, not competing — Redux itself uses Context internally (`<Provider>`) purely as its transport mechanism, and layers the store, reducers, middleware, and DevTools integration on top. See `03-recoil-jotai-atomic-model.md` for a genuinely different single-vs-atomic state model, and `04-when-redux-still-wins.md` for when the extra machinery is worth it.
