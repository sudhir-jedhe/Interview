# Scenario: Migrating a large legacy switch-reducer codebase to Redux Toolkit incrementally

**Problem:** You've inherited a five-year-old app with ~40 classic switch-statement reducers, hand-written action creators, and hand-written action type constants spread across dozens of files. Leadership wants to adopt Redux Toolkit for new features, but a full rewrite is too risky to do in one pass — the app needs to keep shipping.

**Approach:**
1. Confirm compatibility first: `configureStore` accepts plain classic reducer functions exactly the same way `combineReducers` does — nothing about `createSlice` is required to use `configureStore`, so you can swap the store *creation* mechanism (`createStore` → `configureStore`, getting good defaults like thunk middleware and dev-mode checks for free) without touching a single existing reducer.
   ```javascript
   // Works even though every reducer here is a classic hand-written one:
   const store = configureStore({
     reducer: { cart: cartReducer, user: userReducer, ui: uiReducer }, // all classic
   });
   ```
2. Migrate slice-by-slice, starting with the reducer that changes most often (most PR churn = most benefit from less boilerplate, and most opportunity to validate the migration pattern before touching stable code). For each slice: convert its `switch` cases into `createSlice`'s `reducers` object one case at a time, replacing manual spreads with Immer "mutations," and replace hand-written action creators with the auto-generated ones from `slice.actions`.
3. Preserve external action type strings during migration if any *other* still-classic reducer's `extraReducers`-equivalent (a `switch` case matching a string from a different domain) depends on them — `createSlice`'s default naming (`sliceName/reducerKey`) must match whatever the old code expects, or you pass an explicit type string to avoid silently breaking a cross-slice reaction like a logout-triggered reset (see `output-based/07-extraReducers-action-creator-vs-string.md` for exactly this failure mode).
4. Keep both styles running side by side during the transition — this is safe specifically because both classic reducers and `createSlice` reducers produce the same runtime contract, `(state, action) => newState`, and `combineReducers`/`configureStore` don't care which style produced a given slice reducer.

```javascript
// Before: classic
function cartReducer(state = initial, action) {
  switch (action.type) {
    case 'cart/itemAdded':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
}

// After: createSlice, same external action type, same store slot
const cartSlice = createSlice({
  name: 'cart',
  initialState: initial,
  reducers: {
    itemAdded(state, action) { state.items.push(action.payload); },
  },
});
```

This incremental strategy is what most real teams actually do — a full-app rewrite to adopt Redux Toolkit is rarely justified, and understanding that classic and `createSlice` reducers are runtime-interchangeable is exactly what makes incremental migration low-risk.
