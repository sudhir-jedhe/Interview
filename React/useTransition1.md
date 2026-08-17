**`useTransition`** is a React Hook that lets you update state without blocking the UI, allowing critical interactions (like typing in an input or clicking a button) to remain snappy and responsive while heavy background rendering occurs.

---

## 1. Reference

### `const [isPending, startTransition] = useTransition()`

* **`isPending`**: A boolean flag indicating whether there is a pending transition in flight. You can use this to show loading indicators (e.g., dimming the UI or showing a spinner).
* **`startTransition(action)`**: A function that wraps your state update(s), marking them as non-blocking transitions.

---

## 2. Usage Scenarios

### Perform non-blocking updates

When a state update triggers a massive re-render (like filtering a heavy list or switching tabs), wrapping the update in `startTransition` tells React that user inputs take higher priority.

```jsx
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('home');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab); // Non-blocking background update
    });
  }

  return (
    <div>
      <button onClick={() => selectTab('home')}>Home</button>
      <button onClick={() => selectTab('posts')} disabled={isPending}>
        {isPending ? 'Loading...' : 'Posts'}
      </button>
      {tab === 'posts' && <HeavyPostList />}
    </div>
  );
}

```

---

## 3. Troubleshooting

### Updating an input in a Transition doesn’t work

* **Cause:** If you wrap the state update of a controlled input (`e.target.value`) in a transition, the typing will feel sluggish or lag behind because React deprioritizes it.
* **Fix:** Split your state. Keep the input text state immediate/urgent, and wrap only the *expensive filtering or downstream search action* in the transition.

### React doesn’t treat my state update as a Transition after an `await`

* **Cause:** Transitions rely on synchronous call stacks. If you place `startTransition` *after* an asynchronous `await` statement, React loses the transition context.
* **Fix:** Place `startTransition` around the state setter directly, or invoke it *before* any `await` calls.
