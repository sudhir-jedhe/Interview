# Scenario: A List Page Is Slow Because of Deeply Nested, Duplicated State

A support-ticket dashboard stores state as `{ tickets: [ { id, title, assignee: { id, name, ... }, comments: [ { id, author: {...}, text } ] } ] }`. The same user object is duplicated across dozens of tickets and comments. Updating a user's display name (e.g., after they change it in settings) requires walking the entire nested tree and updating every occurrence, and a single ticket-list re-render is slow because any tiny change deep in one ticket's comments creates a new top-level `tickets` array reference, invalidating memoized selectors for the whole list.

**Approach:** Normalize the state shape using RTK's `createEntityAdapter`, storing tickets, users, and comments as separate flat `{ ids: [], entities: {} }` collections keyed by id, and reference across them by id instead of nesting full objects.

```javascript
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

const ticketsAdapter = createEntityAdapter();
// initialState: { ids: [], entities: {} }

export const fetchTickets = createAsyncThunk('tickets/fetchAll', async () => {
  const res = await fetch('/api/tickets');
  return res.json(); // raw API response, still nested — normalized on the way in below
});

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: ticketsAdapter.getInitialState({ status: 'idle' }),
  reducers: {
    // updating one ticket is now an O(1) entity write, not a full-array replace
    ticketUpdated: ticketsAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      state.status = 'succeeded';
      const flatTickets = action.payload.map((t) => ({
        id: t.id,
        title: t.title,
        assigneeId: t.assignee.id,      // reference, not embedded object
        commentIds: t.comments.map((c) => c.id), // references
      }));
      ticketsAdapter.setAll(state, flatTickets); // replaces ids/entities in one immutable op
    });
  },
});

// Generated, memoized selectors — selectAll/selectById/selectIds
export const { selectAll: selectAllTickets, selectById: selectTicketById } =
  ticketsAdapter.getSelectors((state) => state.tickets);
```

Users and comments get their own adapters/slices the same way, populated from the same API response in the thunk (or a normalization step before dispatch). The user's display name now lives in exactly one place (`users.entities[userId].name`); updating it is a single `usersAdapter.updateOne` call and every ticket/comment that references that `userId` picks up the change automatically via a selector that joins `ticket.assigneeId` to `users.entities`, with no duplicated writes.

This also directly fixes the re-render problem: because `createEntityAdapter`'s `updateOne`/`setOne` mutate only the specific entity's slot in the `entities` map (via Immer) rather than replacing the whole `ids` array unless membership changes, a component that reads `selectAllTickets` and doesn't care about a single field somewhere in one comment doesn't get an unnecessary new-array reference on every unrelated update — the reference-equality memoization that `useSelector`/`reselect` depend on now actually holds. The tradeoff worth naming out loud: normalization is more upfront modeling work and requires selectors to "join" data back together for display, which is a real cost — it's justified here because relational, cross-referenced, frequently-updated data is exactly the case it's designed for, not because normalizing is free.
