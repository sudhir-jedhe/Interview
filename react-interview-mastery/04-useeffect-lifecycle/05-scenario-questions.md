# Scenario Questions — `useEffect` & Lifecycle

### 1. Live notification badge shows a count that's always one behind

You're building a notification bell that polls for unread count and displays it, but users report the badge always seems to lag by exactly one update behind reality, even though network requests look correct in the dev tools.

**Approach:** This smells like a stale closure inside a `setInterval` effect that reads state directly instead of using the functional update form, or an effect with an incomplete dependency array that's comparing against a captured old value. Rewrite so the polling effect either has no dependency on stale local state or uses the functional form for any state derived from the previous value:

```jsx
function NotificationBell({ userId }) {
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    const id = setInterval(async () => {
      const count = await fetchUnreadCount(userId);
      if (!cancelled) setUnreadCount(count); // always sets the freshly-fetched value directly
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [userId]);

  return <span className="badge">{unreadCount}</span>;
}
```

Because `setUnreadCount(count)` here sets state to a freshly-fetched value (not derived from stale local state), there's no closure staleness to worry about — the badge always reflects the latest poll result. The `cancelled` flag also prevents a slow, in-flight fetch from a previous poll from overwriting a more recent state update.

---

### 2. Chat component reconnects on every keystroke in an unrelated typing indicator field

You're building a chat room component that opens a WebSocket connection on mount and shows a "user is typing" indicator, but users report the connection drops and reconnects every time anyone types in the message box — visible as a connect/disconnect flicker in the room status.

**Approach:** The WebSocket effect's dependency array likely includes something that changes on every keystroke (e.g., an inline options object built fresh each render, or the draft message text itself accidentally included as a dependency). Isolate the connection effect so it only depends on the room id, and keep typing-related state completely separate:

```jsx
function ChatRoom({ roomId }) {
  const [draft, setDraft] = React.useState('');

  // Connection: depends ONLY on roomId, unaffected by typing
  React.useEffect(() => {
    const socket = createSocket(roomId);
    socket.connect();
    return () => socket.disconnect();
  }, [roomId]);

  return (
    <div>
      <MessageList roomId={roomId} />
      <input value={draft} onChange={e => setDraft(e.target.value)} />
    </div>
  );
}
```

The key fix is separating concerns: the connection-lifecycle effect and the typing-state should never share a dependency array. If typing needs to send "is typing" events over the same socket, that belongs in its own effect (or handler) that reads the socket via a ref, not one that reopens the connection.

---

### 2b. (continued) Sending "is typing" events without reconnecting

**Approach:** Store the socket instance in a `ref` so other effects/handlers can use it without needing it as a dependency (refs are stable and don't trigger effect re-runs):

```jsx
function ChatRoom({ roomId }) {
  const socketRef = React.useRef(null);
  const [draft, setDraft] = React.useState('');

  React.useEffect(() => {
    const socket = createSocket(roomId);
    socket.connect();
    socketRef.current = socket;
    return () => socket.disconnect();
  }, [roomId]);

  function handleChange(e) {
    setDraft(e.target.value);
    socketRef.current?.emit('typing');
  }

  return <input value={draft} onChange={handleChange} />;
}
```

---

### 3. Infinite render loop crashes a filters panel

You're building a filters panel that fetches results based on a filters object, and the app hangs/crashes the tab shortly after the panel mounts.

**Approach:** Classic infinite-loop signature: an effect that both depends on an object/array and also (directly or indirectly) causes that object to be recreated on every render. Trace the dependency to find where a new reference is being created each render:

```jsx
// Bug: `filters` object literal recreated every render -> effect always "changes" -> refetch -> re-render -> loop
function FilterPanel({ category, sortBy }) {
  const filters = { category, sortBy }; // new reference every render
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    fetchResults(filters).then(setResults);
  }, [filters]); // always different reference

  return <ResultsList results={results} />;
}

// Fixed: depend on the primitive values instead of the object wrapper
function FilterPanel({ category, sortBy }) {
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    fetchResults({ category, sortBy }).then(setResults);
  }, [category, sortBy]); // primitives compare by value, stable across renders unless actually changed

  return <ResultsList results={results} />;
}
```

If the object genuinely needs to be constructed outside the effect (e.g., shared with other logic), wrap it in `useMemo(() => ({ category, sortBy }), [category, sortBy])` instead of depending on primitives directly — but depending on primitives is simpler and preferred when possible.

---

### 4. Tooltip briefly appears in the wrong position before snapping into place

You're building a tooltip that measures its own size to position itself above a trigger element, but users report a visible flash where it appears at position `(0, 0)` for a frame before jumping to the correct spot.

**Approach:** The positioning logic is running in `useEffect`, which fires *after* the browser has already painted the initial (wrong) position — hence the visible flash. Switch to `useLayoutEffect`, which runs before paint, so the correct position is calculated and applied before the user ever sees the wrong one:

```jsx
function Tooltip({ targetRef, children }) {
  const tooltipRef = React.useRef(null);
  const [style, setStyle] = React.useState({ top: 0, left: 0 });

  React.useLayoutEffect(() => {
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setStyle({
      top: targetRect.top - tooltipRect.height - 8,
      left: targetRect.left,
    });
  }, [targetRef]);

  return (
    <div ref={tooltipRef} style={{ position: 'fixed', ...style }}>
      {children}
    </div>
  );
}
```

`useLayoutEffect` is exactly for this class of bug — anything involving DOM measurement followed by a synchronous visual correction before the frame is shown to the user.
