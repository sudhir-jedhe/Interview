# Scenario: A non-React widget needs to react to the same state as the React app

**Problem:** Your product has a React app, but one legacy page still embeds a jQuery-based notification bell widget (owned by another team, not worth rewriting yet) that needs to show an unread count. That count is computed from data your React app already fetches and stores. You could have the widget make its own API call, but that risks the count disagreeing with what the React app shows, and doubles the network load.

**Approach:**
1. Recognize that the Redux store is a plain JS object independent of React — `store.getState()` and `store.subscribe()` work from any JS context, not just inside React components. This is a direct consequence of the store's design: `Provider` is just a convenience for wiring React components to it via Context, not a hard dependency.
2. Expose the existing store instance (already created for the React app) to the legacy widget's bundle, and have the widget call `store.subscribe()` directly, reading `store.getState().notifications.unreadCount` on every callback invocation.
3. Because both the React app and the jQuery widget read from the exact same single store, there's no possibility of the two disagreeing, and no duplicated fetch logic — the widget is just another "view" subscribed to the one source of truth, exactly like a React component is, just without going through `useSelector`.

```javascript
// store.js — created once, exported for both React and non-React consumers
export const store = configureStore({ reducer: rootReducer });

// legacy-widget/bell.js — plain jQuery, no React involved
import { store } from '../store';

function renderBell() {
  const count = store.getState().notifications.unreadCount;
  $('#bell-badge').text(count > 0 ? count : '').toggle(count > 0);
}

store.subscribe(renderBell);
renderBell(); // initial paint
```

This scenario is a good way to demonstrate real understanding in an interview: candidates who've only used `react-redux` often assume the store *is* a React concept. Knowing that the store is framework-agnostic — and that this is precisely what "single source of truth" buys you across framework/technology boundaries, not just across React components — is a strong signal of depth.
