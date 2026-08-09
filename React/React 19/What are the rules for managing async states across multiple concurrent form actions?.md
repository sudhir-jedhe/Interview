Managing async states across multiple concurrent form actions requires coordinating optimistic updates, network requests, state transitions, and UI lockouts so that out-of-order responses don't corrupt your application state.

React 19 provides built-in mechanisms like `useTransition`, `useActionState`, and `useOptimistic` to handle these scenarios. The core rules for managing concurrent form actions safely are detailed below.

---

## 1. The Single Source of Truth & Passthrough Rule

When managing concurrent optimistic updates across multiple form actions, **never let an action mutate local state independently of your underlying server-confirmed state.**

* **The Passthrough Rule:** The first argument of `useOptimistic(passthroughState, updateFn)` must always be your real, server-confirmed state.
* **How React handles concurrency:** When multiple concurrent actions dispatch optimistic updates, React queues them in order. Whenever a new server-confirmed state arrives, React re-applies all remaining in-flight optimistic updates on top of the fresh server state automatically.

```tsx
// ✅ Correct: Both forms update the same underlying server-backed state
const [serverData, setServerData] = useState(initialData);

// Single optimistic hook derived from real server state
const [optimisticData, setOptimisticData] = useOptimistic(
  serverData,
  (current, update) => applyOptimisticUpdate(current, update)
);

```

---

## 2. Wrap Concurrent Submissions in Transitions (`startTransition`)

In React 19, async actions triggered outside of standard native HTML `<form action>` attributes (e.g., button clicks, multi-step actions) **must be wrapped in `startTransition**`.

* Wrapping concurrent actions inside `startTransition` marks the network request and state update as **non-blocking**.
* This keeps the user interface interactive, allowing users to submit a second form or switch tabs while the first action is still processing in the background.

```tsx
const [isPending, startTransition] = useTransition();

const handleFormAction = (formData: FormData) => {
  startTransition(async () => {
    // 1. Optimistic update
    setOptimisticState(formData);
    // 2. Async network mutation
    const result = await apiCall(formData);
    // 3. Sync real state
    setServerState(result);
  });
};

```

---

## 3. Handle Out-of-Order Responses (Race Conditions)

When a user submits Form A and then immediately submits Form B, there is no guarantee that Form A will finish first. If Form A finishes *after* Form B, Form A’s response could overwrite the fresher state from Form B.

### Rules to prevent race conditions

1. **Use Timestamps or Version Counters:** Include a client timestamp or incrementing sequence ID with every submission. Reject or ignore responses from older requests if a newer request has already resolved.
2. **Use `AbortController`:** Cancel pending HTTP requests when a new action is triggered on the same form context:

```tsx
const abortControllerRef = useRef<AbortController | null>(null);

const handleSubsequentSubmit = async (formData: FormData) => {
  // Cancel previous in-flight request for this form
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  const controller = new AbortController();
  abortControllerRef.current = controller;

  try {
    await submitForm(formData, { signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') return; // Ignore canceled requests
    // Handle actual runtime errors
  }
};

```

---

## 4. Scope Isolation vs. Shared Locking

Decide whether concurrent actions affect the **same entity** or **independent entities**:

* **Entity-Scoped Locking (Independent Forms):** If Form A edits User Profile and Form B adds a Comment, allow both forms to process concurrently without locking each other out. Use local `useActionState` or `useFormStatus` hooks inside each specific form.
* **Mutual Exclusion Locking (Conflicting Actions):** If Form A deletes an item and Form B edits the same item, allow only one action to run at a time. Disable Form B while Form A’s `isPending` is `true`.

```tsx
// Using useFormStatus to disable individual forms while submitting
function SaveButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;
}

```

---

## 5. Automatic Error Rollbacks & Granular Recovery

When multiple actions run concurrently and one fails:

* **React's `useOptimistic` Rollback:** If an async action wrapped in a transition throws an error, React automatically drops the optimistic update associated with that transaction on the next render pass.
* **Isolate Action Errors:** Never store global error states that get overwritten by adjacent form actions. Keep error results tied to the specific `useActionState` instance of the form that caused them:

```tsx
// Form A has its own isolated error/pending state
const [stateA, formActionA, isPendingA] = useActionState(actionA, initialA);

// Form B has its own isolated error/pending state
const [stateB, formActionB, isPendingB] = useActionState(actionB, initialB);

```

---

## Summary Rules Checklist

| Rule                        | Problem Addressed                                | Solution                                                                      |
| --------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| **Passthrough Rule**        | Broken or out-of-sync optimistic UI.             | Always pass the true server state as the 1st argument to `useOptimistic`.     |
| **Non-blocking Execution**  | UI freezes during multi-form submissions.        | Wrap async action calls in `startTransition`.                                 |
| **Race Condition Guarding** | Stale network responses overwriting fresh state. | Use `AbortController` or compare response sequence IDs.                       |
| **Form Isolation**          | One form's loading state blocking another form.  | Use `useFormStatus` / `useActionState` scoped locally to each form.           |
| **Fail-Safe Rollbacks**     | Failed actions leaving fake data on screen.      | Let React's transition boundary auto-revert `useOptimistic` on thrown errors. |
