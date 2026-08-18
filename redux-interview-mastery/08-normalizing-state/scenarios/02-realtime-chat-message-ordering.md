# Scenario: A Real-Time Chat App Needs Fast Inserts and Correct Ordering

You're building a chat app on Redux. Messages arrive over a WebSocket, potentially out of order (network jitter, reconnects re-delivering a buffered batch), and the UI needs to: insert a new message instantly without re-rendering the whole message list, keep messages sorted by timestamp, support "jump to message" by ID (e.g., from a search result or a reply-quote), and edit/delete individual messages in place.

## Approach:

**1. Recognize this as a textbook `createEntityAdapter` fit.** The requirements — insert-heavy, need O(1) lookup by ID for "jump to message," need consistent sort order independent of arrival order, need in-place edits — are exactly what `createEntityAdapter` with a `sortComparer` was built for, rather than something to hand-roll.

```javascript
const messagesAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.timestamp - b.timestamp,
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    messageReceived: messagesAdapter.upsertOne, // handles both new and re-delivered messages
    messageEdited: messagesAdapter.updateOne,
    messageDeleted: messagesAdapter.removeOne,
  },
});
```

**2. Use `upsertOne`, not `addOne`, for the WebSocket handler.** Because reconnects can redeliver a message that already arrived (at-least-once delivery is common for WebSocket reconnection logic), `addOne` would either throw away the duplicate silently or (depending on adapter version) leave stale data; `upsertOne` correctly treats a redelivered message with the same ID as a no-op-equivalent replace, which is idempotent and safe to call repeatedly.

**3. Let the `sortComparer` solve out-of-order arrival for free.** Because the adapter re-sorts `ids` after every `upsertOne` by `timestamp` rather than insertion order, a message that arrives late (delayed by network jitter) still lands in the correct chronological position in the rendered list, with no manual re-sort logic in the component.

**4. "Jump to message" becomes an O(1) selector, not a scroll-and-search.** `selectMessageById(state, targetId)` from `messagesAdapter.getSelectors()` finds the message instantly; combine it with the message's known sort position (its index in `state.messages.ids`) to compute a scroll offset, rather than iterating the rendered list to find a DOM node.

**5. Isolate per-message re-renders.** Render each message row as its own connected component subscribing to `selectMessageById(state, id)` (not the whole list), so an edit or a new incoming message only re-renders the affected row and the list container (for insertion), not every previously-rendered message.

**6. Keep the WebSocket handler pure of side effects beyond dispatch.** The socket's `onmessage` callback should do exactly one thing — parse the payload and `dispatch(messageReceived(parsedMessage))` — keeping all ordering/dedup logic inside the reducer (via the adapter), so it stays testable without a real socket connection.

**Result:** insert, edit, delete, and lookup are all O(1) or O(log n) via the adapter's internal `ids` array management, ordering is always correct regardless of network delivery order, and only the affected message row re-renders on any given update.
