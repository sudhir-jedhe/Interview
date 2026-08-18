# Problem 2: Find and Fix a Non-Serializable Value in State

## Task

The following slice triggers RTK's `serializableCheck` warning in development. Find every non-serializable value, explain why each is a problem, and rewrite the slice so it's fully serializable while preserving equivalent functionality.

```javascript
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
  reducers: {
    notificationShown(state, action) {
      state.items.push({
        id: action.payload.id,
        message: action.payload.message,
        shownAt: new Date(),                        // (1)
        dismiss: () => { /* close logic */ },         // (2)
        autoDismissTimer: setTimeout(() => {}, 5000), // (3)
      });
    },
  },
});
```

## Solution

```javascript
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
  reducers: {
    notificationShown(state, action) {
      state.items.push({
        id: action.payload.id,
        message: action.payload.message,
        shownAt: Date.now(), // (1) fixed: epoch ms, a plain number
        // (2) fixed: `dismiss` is removed entirely. Dismissal is now modeled as
        // an action, not a stored callback — see notificationDismissed below.
        // (3) fixed: the timer handle is removed from state. Auto-dismiss is now
        // triggered by middleware/a thunk calling dispatch(notificationDismissed(id))
        // after a delay, with the setTimeout handle kept OUTSIDE Redux state
        // (e.g., in a module-level Map keyed by notification id, for cancellation).
      });
    },
    notificationDismissed(state, action) {
      state.items = state.items.filter((n) => n.id !== action.payload.id);
    },
  },
});

export const { notificationShown, notificationDismissed } = notificationSlice.actions;
export default notificationSlice.reducer;

// The auto-dismiss timer lives outside Redux state entirely:
const autoDismissTimers = new Map();

export function scheduleAutoDismiss(dispatch, id, delayMs = 5000) {
  const timerId = setTimeout(() => {
    dispatch(notificationDismissed({ id }));
    autoDismissTimers.delete(id);
  }, delayMs);
  autoDismissTimers.set(id, timerId);
}

export function cancelAutoDismiss(id) {
  clearTimeout(autoDismissTimers.get(id));
  autoDismissTimers.delete(id);
}
```

## Why each fix is correct

1. **`Date` → `Date.now()`**: a plain number is trivially serializable, compares correctly with `===`, and still gives you everything you need (pass it to `new Date(shownAt)` at render time if you need formatted display).
2. **A stored `dismiss` callback → an action.** Functions can never be serialized, full stop — there's no numeric or string equivalent to fall back to the way there is for `Date`. The behavioral fix is to model "dismiss this notification" as a dispatchable action (`notificationDismissed`) rather than a closure stored in state; any component that needs to trigger dismissal just dispatches the action with the notification's ID.
3. **A stored timer handle → kept outside Redux entirely.** A `setTimeout` handle isn't data describing application state — it's a reference to an in-progress side effect. It's moved to a plain module-level `Map` (or could live in a ref, or middleware), and the *fact* that an auto-dismiss is scheduled, if the UI needs to reflect that, would be tracked as a plain boolean/status field in state instead of the raw timer handle.
