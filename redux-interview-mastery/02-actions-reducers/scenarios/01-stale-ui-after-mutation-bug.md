# Scenario: "The list updates in Redux DevTools but not on screen"

**Problem:** A teammate reports that a "mark as read" feature for a notifications list updates correctly in Redux DevTools (the array shows the item's `read: true`) but the notification still displays as unread in the UI. No errors in the console. They've spent an hour convinced `useSelector` is broken.

**Approach:**
1. Ask to see the reducer first, since "DevTools shows the right data but the UI doesn't update" is the textbook symptom of a mutation bug, not a `useSelector` bug — DevTools reads `getState()` fresh after every action (so it always reflects current data, mutated or not), while `useSelector` decides whether to re-render based on whether the *reference* returned by the selector changed.
2. Find the culprit: `notification.read = true;` directly on an object pulled out of `state.notifications`, followed by `return state;` — a direct mutation with no new object created anywhere in the update path.
   ```javascript
   // Buggy reducer
   case 'notification/markedRead': {
     const notification = state.notifications.find((n) => n.id === action.payload);
     notification.read = true; // mutates the object already inside state
     return state; // same reference at every level
   }
   ```
3. Explain the mechanism concretely: `useSelector((s) => s.notifications)` compares the new selector result to the previous render's result by reference (`===`). Since `state` (and `state.notifications`, and the notification object itself) were all mutated in place rather than replaced, every one of those references is unchanged — `useSelector` correctly (from its own point of view) concludes nothing relevant changed and skips the re-render, even though the underlying data is different.
4. Fix it with a proper immutable update, or migrate the slice to `createSlice`, where the equivalent "mutating" line becomes safe:
   ```javascript
   // Fixed classic version
   case 'notification/markedRead':
     return {
       ...state,
       notifications: state.notifications.map((n) =>
         n.id === action.payload ? { ...n, read: true } : n
       ),
     };

   // createSlice version — the "mutating" line is now safe via Immer
   markedRead(state, action) {
     const notification = state.notifications.find((n) => n.id === action.payload);
     if (notification) notification.read = true;
   }
   ```

The broader lesson for the team: "DevTools shows correct data but the screen doesn't update" is close to a diagnostic signature for a mutation bug specifically — it's worth checking the reducer for direct mutation before suspecting `useSelector`, `connect`, or React itself.
