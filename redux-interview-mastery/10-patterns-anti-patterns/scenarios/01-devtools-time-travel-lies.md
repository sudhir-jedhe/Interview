# Scenario: Redux DevTools Time-Travel Shows Impossible State History

A teammate reports something bizarre: using Redux DevTools to "jump to" an earlier point in the action history shows data that doesn't match what the app actually displayed at that point in time — specifically, a task's assignee field shows the *current* assignee even when jumping back to before the reassignment action was dispatched. The team initially suspects a DevTools bug.

## Approach:

**1. Rule out DevTools first, cheaply.** Check the DevTools/extension version and reproduce in a fresh, minimal reducer to rule out an actual tooling bug before assuming it's application code — but treat "time-travel shows wrong history" as a strong prior for a mutation bug, since this is one of the most characteristic symptoms of Rule 2 (state is read-only) violations.

**2. Audit the reducer(s) touching the affected slice for shallow-only spreads.** The likely culprit: a reducer that does `return { ...state }` at the top level while reaching into a nested object (`state.byId[taskId].assignee = newAssignee`) and mutating it directly, rather than reconstructing every level of the path that changed. Confirm by checking whether `state.byId === previousState.byId` and `state.byId[taskId] === previousState.byId[taskId]` after the dispatch — if either is `true`, that's the smoking gun.

**3. Explain precisely why this corrupts history, not just the current render.** DevTools typically retains references to previous state snapshots (not deep clones, for performance) so it can render the action log's list of past states. If a reducer mutates a nested object in place rather than replacing it, every snapshot that happens to hold a reference to that same nested object — including snapshots from *before* the mutating action — now reflects the mutated value too, because there was never actually more than one copy of that nested object to begin with. This is retroactive corruption of "the past," which is why it looks so uncanny compared to a normal bug.

**4. Fix by reconstructing every level of the changed path**, per `output-based/07-nested-mutation-through-shared-reference.md` — either by hand (`{ ...state, byId: { ...state.byId, [taskId]: { ...state.byId[taskId], assignee } } }`) or, more robustly for the whole team going forward, by migrating this reducer into `createSlice`, where Immer handles the correct multi-level immutable update automatically even when the code is written in a mutation-looking style.

**5. Add a regression check.** Write a test that dispatches the reassignment action and asserts `previousState.byId[taskId] !== nextState.byId[taskId]` and `previousState.byId[taskId].assignee` is unchanged — this is exactly the kind of bug that's invisible from a single dispatch's "did the UI update correctly" smoke test (it did!) but is caught by an explicit reference-identity assertion.

**Result:** the team learns to distinguish "the UI looks right on this one dispatch" from "the state update is actually immutable," and gets a durable fix (migrating to `createSlice`'s Immer-backed reducers) that prevents the same class of bug from being reintroduced by future reducer code written in a mutating style.
