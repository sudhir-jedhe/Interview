# Scenario: A Dashboard Widget Needs Data Assembled From Three Unrelated Slices

An analytics dashboard's "Team Activity" widget needs to show, per team member: their name (from `state.users`), their assigned ticket count (derived from `state.tickets`), and whether they're currently online (from `state.presence`). These three slices are maintained by different features, are updated at very different frequencies (`presence` updates roughly every few seconds via a websocket; `users` and `tickets` update rarely), and none of them was designed with this specific combined view in mind.

**Approach:** Build the combined view as a composed selector reading from all three slices, structured so that the frequently-changing slice (`presence`) doesn't force recomputation of the expensive part (the ticket-count aggregation) that doesn't actually depend on it.

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectUsers = (state) => state.users.list;
const selectTickets = (state) => state.tickets.list;
const selectPresenceMap = (state) => state.presence.onlineUserIds; // e.g. a Set or {[id]: true}

// Step 1: the expensive aggregation — does NOT depend on presence at all,
// so it's isolated from presence's frequent websocket-driven updates.
const selectUsersWithTicketCounts = createSelector(
  [selectUsers, selectTickets],
  (users, tickets) => {
    const countsByUser = tickets.reduce((acc, t) => {
      acc[t.assigneeId] = (acc[t.assigneeId] ?? 0) + 1;
      return acc;
    }, {});
    return users.map((u) => ({ ...u, ticketCount: countsByUser[u.id] ?? 0 }));
  }
);

// Step 2: cheap — just merges in an online flag. Recomputes on every presence
// update, but this step is O(n) with no aggregation, so that's fine.
export const selectTeamActivity = createSelector(
  [selectUsersWithTicketCounts, selectPresenceMap],
  (usersWithCounts, onlineIds) =>
    usersWithCounts.map((u) => ({ ...u, online: onlineIds.has(u.id) }))
);
```

The design decision worth defending in review: without splitting this into two stages, a single `createSelector([selectUsers, selectTickets, selectPresenceMap], ...)` would re-run the *entire* function — including the ticket-count aggregation — every time presence changes, which given websocket-driven updates every few seconds means redoing an O(tickets) reduction repeatedly for no reason, since ticket counts never actually depend on who's online. Splitting into `selectUsersWithTicketCounts` (stable, only recomputes when `users`/`tickets` change) and `selectTeamActivity` (cheap, recomputes on every presence tick but does trivial work) means the expensive aggregation genuinely only runs when its real inputs change, while still keeping the final composed view correctly up to date every time presence changes. This mirrors the general principle from `../theory/03-selector-composition.md`: structure a selector pipeline so volatile, high-frequency inputs are consumed as late (as cheaply) in the pipeline as possible, keeping expensive computation gated behind the inputs that actually change it.
