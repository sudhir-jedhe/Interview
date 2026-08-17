# Scenario Questions — JSX & Rendering Basics

### 1. Reorderable task list loses input focus and shows wrong text

You're building a drag-to-reorder task list where each task has an editable `<input>` for its title. Users report that after dragging a task to a new position, the wrong title appears in the input, and their cursor/focus jumps unexpectedly.

**Approach:** This is the index-as-key problem. If the list is rendered with `key={index}`, reordering changes which index each task occupies, so React reuses the DOM `<input>` at each index for whatever task now sits there — including its uncontrolled `defaultValue` or controlled `value` state — rather than moving the actual DOM node with its task. Fix by keying on the task's stable id:

```jsx
function TaskList({ tasks, onReorder }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <input
            value={task.title}
            onChange={e => updateTitle(task.id, e.target.value)}
          />
        </li>
      ))}
    </ul>
  );
}
```

With `key={task.id}`, React tracks each `<input>` by the task it belongs to, so reordering moves the actual DOM nodes (and their focus/selection state) along with the data instead of reusing them positionally.

---

### 2. Dashboard shows a stray "0" instead of staying blank

You're building a notifications dropdown that should show a badge count only when there are unread notifications, but QA reports a bare `0` character appearing in the corner when the inbox is empty.

**Approach:** The render logic is almost certainly `{unreadCount && <Badge count={unreadCount} />}`. When `unreadCount` is `0`, `&&` short-circuits and returns `0` itself, and React renders that number as text. Fix by forcing a real boolean:

```jsx
function NotificationIcon({ unreadCount }) {
  return (
    <div className="icon">
      <BellSvg />
      {unreadCount > 0 && <Badge count={unreadCount} />}
    </div>
  );
}
```

More generally, treat any `&&` guard in JSX as suspect unless the left-hand value is already a boolean; convert with a comparison (`> 0`, `!!value`, `Boolean(value)`) rather than relying on truthiness of numbers or strings.

---

### 3. New component tree flashes/unmounts entirely on minor prop change

You're building a settings page where a `<Panel>` component conditionally renders as either `<AdminPanel>` or `<UserPanel>` based on a role prop, and every time the role prop briefly flips during a loading transition, all child state (expanded sections, scroll position) resets.

**Approach:** React's reconciliation compares elements at the same tree position by *type*. Swapping between `<AdminPanel>` and `<UserPanel>` — different component types at the same slot — causes React to unmount the old subtree entirely and mount a fresh one, discarding all local state and DOM (including scroll position). If the panels are meant to represent variations of "the same logical panel," unify them into one component that branches internally so the type stays stable across the transition:

```jsx
function Panel({ role, ...sharedState }) {
  return (
    <div className="panel">
      {role === 'admin' ? <AdminControls /> : <UserControls />}
      {/* shared scroll container / state stays mounted */}
    </div>
  );
}
```

If they must remain separate top-level components, preserve state outside the component (lift it up) so it survives the unmount/remount, or use a stable `key` intentionally to force remount only when you actually want a reset.

---

### 4. Long list of 5,000 rows causes visible jank on every keystroke in a filter box

You're building a search-as-you-type filter over a large product catalog rendered as a JSX list, and every keystroke causes the whole page to freeze for a noticeable moment.

**Approach:** Before reaching for virtualization or memoization (later topics), first confirm the basics: each keystroke triggers a state update, which triggers a full re-render of the parent, which re-runs `.map()` over the filtered array and creates a fresh element tree of up to 5,000 elements every time. React still has to reconcile all of them even if the diff avoids most DOM writes. A quick, topic-appropriate fix is to make sure the list itself isn't being recreated unnecessarily (e.g., don't inline a new array/object literal as `items` on every keystroke if it doesn't need to be) and that keys are stable so React can bail out of re-rendering unchanged rows structurally:

```jsx
function ProductList({ query, products }) {
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <ul>
      {filtered.map(p => (
        <li key={p.id}>{p.name}</li> // stable key lets React diff cheaply
      ))}
    </ul>
  );
}
```

For real performance at this scale you'd eventually reach for `React.memo` on row components, debouncing the filter input, or list virtualization — but ruling out unstable keys and unnecessary reference churn is the first, cheapest check.

---

### 5. Server-rendered markup mismatches client render, causing a console warning and flicker

You're adding server-side rendering to an existing app, and after hydration you see a "Text content does not match server-rendered HTML" warning along with a visible flash of different content.

**Approach:** Hydration reuses the server-rendered DOM and only attaches event listeners/reconciles against it — it doesn't blindly trust that the client's first render will produce identical output. A common cause is rendering something environment-dependent (like `new Date().toLocaleString()` or `window`-based checks) directly in JSX during the initial render, which differs between server and client:

```jsx
// Bad: differs between server and first client render
function Timestamp() {
  return <span>{new Date().toLocaleTimeString()}</span>;
}

// Better: render a stable placeholder on first pass, fill in client-only value after mount
function Timestamp() {
  const [time, setTime] = React.useState(null);
  React.useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);
  return <span>{time ?? '--:--:--'}</span>;
}
```

The fix is to keep the first client render's JSX output identical to what the server produced, and defer any environment-specific or non-deterministic content to an effect that runs post-hydration.
