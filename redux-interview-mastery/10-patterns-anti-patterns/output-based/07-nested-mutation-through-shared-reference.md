## What does `previousSnapshot` show after this dispatch — and why is that dangerous?

```javascript
function tasksReducer(state, action) {
  switch (action.type) {
    case 'task/assigneeChanged': {
      const task = state.byId[action.payload.taskId];
      task.assignee = action.payload.newAssignee; // mutating the nested object directly
      return { ...state }; // shallow-spreads the TOP level only
    }
    default:
      return state;
  }
}

const state0 = {
  byId: { t1: { id: 't1', assignee: 'Ada' } },
  allIds: ['t1'],
};

const previousSnapshot = state0; // simulating a DevTools "previous state" snapshot held elsewhere
const state1 = tasksReducer(state0, {
  type: 'task/assigneeChanged',
  payload: { taskId: 't1', newAssignee: 'Grace' },
});

console.log('previousSnapshot.byId.t1.assignee:', previousSnapshot.byId.t1.assignee);
console.log('state1.byId.t1.assignee:', state1.byId.t1.assignee);
console.log('state0 === state1:', state0 === state1);
console.log('state0.byId === state1.byId:', state0.byId === state1.byId);
```

**Answer:**
```
previousSnapshot.byId.t1.assignee: Grace
state1.byId.t1.assignee: Grace
state0 === state1: false
state0.byId === state1.byId: true
```
The "previous" snapshot shows `'Grace'` — the *new* value — not `'Ada'`, even though nothing intentionally reassigned `previousSnapshot`.

**Why:** The reducer only shallow-spreads the *top level* (`return { ...state }`), so `state1.byId` is the exact same object reference as `state0.byId`, and `state0.byId.t1` is the exact same object reference too — the reducer mutated `task.assignee` directly on that shared nested object before spreading the parent. Since `previousSnapshot` was holding a reference to `state0`, and `state0.byId.t1` is literally the same object `state1.byId.t1` is, mutating it retroactively corrupts anything else that still holds a reference to the "old" state — including Redux DevTools' own state history, which typically holds references rather than deep clones for performance. This is why a genuinely correct immutable update must reconstruct *every* level of the path that changed (`{ ...state, byId: { ...state.byId, t1: { ...state.byId.t1, assignee: newAssignee } } }`), not just the top level — a shallow spread only protects you from mutations if the thing being mutated is a top-level primitive or an object you're explicitly replacing, not a nested object you're reaching into and mutating in place.
