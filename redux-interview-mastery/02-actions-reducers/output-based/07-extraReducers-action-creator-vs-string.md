# Output: `extraReducers` matching a plain string vs an action creator

```javascript
const { configureStore, createSlice } = require('@reduxjs/toolkit');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {
    loggedOut(state) { state.user = null; },
  },
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: ['book'] },
  reducers: {},
  extraReducers: (builder) => {
    // Deliberately using a hand-typed string instead of authSlice.actions.loggedOut
    builder.addCase('auth/loggedOut', () => ({ items: [] }));
  },
});

const store = configureStore({
  reducer: { auth: authSlice.reducer, cart: cartSlice.reducer },
});

store.dispatch(authSlice.actions.loggedOut());
console.log(store.getState().cart.items);

// Now suppose a teammate later renames the slice:
// createSlice({ name: 'authentication', ... })  <-- action type becomes 'authentication/loggedOut'
```

**Answer:** `[]` — it works today, because the hand-typed string `'auth/loggedOut'` happens to exactly match what `createSlice({ name: 'auth', ... })` generates.

**Why:** `builder.addCase` accepts either an action creator function or a raw string matching an action's `type`. Using the raw string works today, but it silently decouples the match from the actual source of truth — if `authSlice`'s `name` is ever renamed (a very plausible refactor), the generated action type becomes `'authentication/loggedOut'`, but the hardcoded string in `cartSlice`'s `extraReducers` still says `'auth/loggedOut'`. Nothing throws or warns: the cart's `extraReducers` case simply stops matching, silently, and the cart will no longer reset on logout — a regression that's easy to miss in review and painful to debug in production. The fix is always to prefer `builder.addCase(authSlice.actions.loggedOut, ...)` — passing the actual action creator, not a string — so a rename becomes a compile-time/type error (in TypeScript) or at minimum keeps the reference correct automatically, rather than a silent runtime behavior change.
