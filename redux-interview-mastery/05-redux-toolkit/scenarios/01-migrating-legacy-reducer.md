# Scenario: Migrating a Legacy Reducer Module to RTK Under Deadline Pressure

Your team inherited a five-year-old dashboard app with hand-written Redux: string constants in `actionTypes.js`, action creators in `actions.js`, and a 200-line switch-statement reducer in `notificationsReducer.js`. Product wants a new feature (per-notification "snooze") added this sprint, and your tech lead asks whether it's worth migrating this slice to Redux Toolkit *while* adding the feature, or just bolting the feature onto the existing pattern to save time.

**Approach:** Migrate this specific slice now, and treat it as the template for future ones — but don't attempt a big-bang rewrite of the whole app in one PR.

The reasoning: the old reducer already has bugs typical of hand-written Redux — a `default: return state` case that's easy to get wrong, and at least one spot doing `state.list[index].read = true` directly on the incoming state object (a latent mutation bug masked by the fact that nothing currently re-renders off referential equality for that field). Adding a new "snooze" action to that pattern means writing a fourth action type, a fourth action creator, and extending the switch statement by hand — exactly the boilerplate RTK exists to remove, and exactly the place new mutation bugs get introduced under time pressure.

Migrating is genuinely low-risk here because `createSlice`'s output — an action creator per reducer key plus a single reducer function — is a drop-in replacement for the old module's public exports, provided you keep the exported names identical. The rest of the app that imports `{ markAsRead, dismissNotification }` from this module doesn't need to change at all.

```javascript
// notificationsSlice.js — replaces actionTypes.js + actions.js + notificationsReducer.js
import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { list: [], unreadCount: 0 },
  reducers: {
    notificationReceived(state, action) {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead(state, action) {
      const n = state.list.find((n) => n.id === action.payload);
      if (n && !n.read) {
        n.read = true; // safe now — was a real mutation bug in the old switch-reducer
        state.unreadCount -= 1;
      }
    },
    dismissNotification(state, action) {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
    // the new feature, added the same way as everything else — no new boilerplate tax
    notificationSnoozed(state, action) {
      const { id, until } = action.payload;
      const n = state.list.find((n) => n.id === id);
      if (n) n.snoozedUntil = until;
    },
  },
});

export const { notificationReceived, markAsRead, dismissNotification, notificationSnoozed } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
```

The migration itself is a small, reviewable, low-risk diff (delete two files, replace one, keep the same exported action creator names) and it fixes a real bug for free — Immer now guarantees the `n.read = true` mutation is safe, whereas in the original switch-reducer it was silently mutating the actual previous state object, which could cause stale/incorrect re-renders elsewhere in the app depending on how connected components compared state. The new feature is then implemented in the *new*, safer pattern rather than extending the old fragile one. What we explicitly avoid: rewriting every other legacy slice in the same PR — that's a separate, lower-urgency cleanup effort that shouldn't be coupled to a feature deadline.
