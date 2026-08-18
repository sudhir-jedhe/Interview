# Scenario: A junior engineer put every modal's open/closed flag in Redux

**Problem:** In a code review, you see a PR that adds `isDeleteConfirmModalOpen`, `isEditProfileModalOpen`, and `isFilterPanelOpen` booleans to a global `ui` slice in Redux, each with its own `opened`/`closed` action pair and a `useSelector` in the one component that renders that modal. No other component reads these flags. The PR works, but it adds six new action types, six selectors, and a slice update for what is fundamentally "is this one component's popup visible."

**Approach:**
1. Apply the decision checklist from `04-when-to-use-redux.md`: ask whether this state is read by more than the component that owns it. Here, each flag is read by exactly one component (the modal itself) and written by exactly one nearby component (the button that opens it) — a parent/child relationship, not a "distant components" one.
2. Point out concretely what centralizing it costs versus buys: every modal open/close now round-trips through `dispatch` → reducer → `useSelector` re-render, for a value that never needs to survive a re-render, be time-traveled, or be read elsewhere. It also means anyone reading the `ui` slice in DevTools now sees noise unrelated to actual business state.
3. Suggest reverting to local `useState` (or `useReducer` if a single modal has several intertwined UI states like "closed / confirming / submitting / error") in the component that owns each modal, and reserve the Redux `ui` slice for flags that genuinely need to be read from multiple, unrelated places (e.g., a global "app is offline" banner shown in several places).

```javascript
// Before: unnecessary global state for a local concern
// ui/uiSlice.js
reducers: {
  deleteConfirmModalOpened: (state) => { state.isDeleteConfirmModalOpen = true; },
  deleteConfirmModalClosed: (state) => { state.isDeleteConfirmModalOpen = false; },
}

// After: local state, zero Redux involvement
function DeleteButton({ onConfirm }) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  return (
    <>
      <button onClick={() => setConfirmOpen(true)}>Delete</button>
      {isConfirmOpen && (
        <ConfirmModal onConfirm={onConfirm} onCancel={() => setConfirmOpen(false)} />
      )}
    </>
  );
}
```

The review comment to leave: "This state has exactly one reader and one writer, both in the same component subtree — that's the definition of local state. Let's keep Redux for state that's genuinely shared or needs the guarantees it provides."
