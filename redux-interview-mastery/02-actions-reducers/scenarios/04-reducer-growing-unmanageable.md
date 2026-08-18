# Scenario: A single 800-line reducer file becomes a merge-conflict magnet

**Problem:** `appReducer.js` has grown to handle actions for cart, user profile, notifications, and UI state, all in one `switch` statement with over 40 cases. Every sprint, at least two engineers touch this file for unrelated features and hit merge conflicts, because Git can't reconcile two people adding cases to the same `switch` block even when the changes are logically unrelated.

**Approach:**
1. Identify that this is purely an organizational problem, not a Redux limitation — Redux never required one giant reducer; `combineReducers` exists precisely to let you split state (and the reducer logic that owns it) along domain boundaries, each in its own file, independently editable.
2. Partition the 40 cases by the state key they actually touch — most cases in a giant reducer, on inspection, only ever read/write one specific sub-object (`state.cart`, `state.user`, etc.), even though they're jumbled together in one function.
3. Extract each domain into its own slice reducer file and wire them together with `combineReducers` (or migrate to `createSlice` per-domain during the same pass, per `02-migrating-legacy-reducers-to-createSlice.md`):
   ```javascript
   // Before: one 800-line switch in appReducer.js handling everything

   // After: features/cart/cartReducer.js, features/user/userReducer.js,
   // features/notifications/notificationsReducer.js, features/ui/uiReducer.js
   // each independently small, testable, and owned by one feature area.

   // rootReducer.js
   import cartReducer from '../features/cart/cartReducer';
   import userReducer from '../features/user/userReducer';
   import notificationsReducer from '../features/notifications/notificationsReducer';
   import uiReducer from '../features/ui/uiReducer';

   export default combineReducers({
     cart: cartReducer,
     user: userReducer,
     notifications: notificationsReducer,
     ui: uiReducer,
   });
   ```
4. Result: two engineers working on cart and notifications features respectively now touch entirely different files, eliminating the merge-conflict pattern by construction, and each reducer file is small enough to read and test in isolation. Any genuinely cross-domain reaction (e.g., clearing notifications on logout) still works via the `extraReducers`/cross-slice-action pattern from `05-splitting-and-composing-reducers.md` — splitting the reducer doesn't limit which actions a given slice can respond to, only how the state tree and the code are organized.

The interview framing: "reducer composition via `combineReducers` isn't just an API detail — it's the mechanism that lets a large team scale a Redux codebase without every feature colliding in one file."
