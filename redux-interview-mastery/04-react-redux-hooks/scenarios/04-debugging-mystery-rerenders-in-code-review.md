# Scenario: A code reviewer flags a `useSelector` call before it ships

**Problem:** In a PR, a teammate adds this to a frequently-rendered `NotificationBell` component, which sits in the app's persistent header (rendered on every page):

```jsx
function NotificationBell() {
  const unread = useSelector((state) =>
    state.notifications.items.filter((n) => !n.read)
  );
  return <span className="bell">{unread.length > 0 && <Dot />}</span>;
}
```

It works correctly in manual testing — the bell shows/hides appropriately — so the PR looks ready to merge.

**Approach:**
1. As reviewer, recognize the shape immediately: a `useSelector` returning the result of `.filter(...)` with no equality function and no `reselect` memoization, on a component that lives in the persistent header — meaning it's mounted for the *entire session*, on *every page*, and will re-run its selector on *every single dispatch* the app ever makes, for the whole time a user has the app open.
2. Leave a specific, actionable review comment rather than a vague "this could be slow": explain that `.filter(...)` returns a new array reference every render, so this component will re-render on every dispatch app-wide (not just notification-related ones), and because it's a persistent header component, that's a much larger blast radius than a component that only mounts on one page.
3. Suggest the minimal fix that preserves the PR's intent — since the component only needs a *boolean* (are there any unread notifications), not the actual filtered array, select a primitive instead of an array entirely, sidestepping the reference-equality issue altogether rather than reaching for `shallowEqual` or `reselect`:
   ```jsx
   function NotificationBell() {
     const hasUnread = useSelector((state) =>
       state.notifications.items.some((n) => !n.read)
     );
     return <span className="bell">{hasUnread && <Dot />}</span>;
   }
   ```
4. Note in the review why this fix is better than reaching for `reselect` here specifically: `.some(...)` short-circuits on the first unread item and returns a `boolean`, which compares by value — there's no array construction to memoize away in the first place, so introducing a memoized selector would be solving a problem that a simpler selector avoids by construction. Reach for `reselect`/`shallowEqual` when the component genuinely needs the derived array/object itself (e.g., to render each unread notification), not when a primitive summary would do.

This scenario is a good interview talking point because it demonstrates two skills at once: recognizing the referential-equality gotcha *and* picking the right-sized fix rather than defaulting to the heaviest tool (`reselect`) out of habit.
