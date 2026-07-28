**`useOptimistic`** is a React 19 hook that lets you implement **Optimistic UI updates** with zero boilerplate.

It allows your user interface to instantly reflect the expected result of an action (like "liking" a post, adding an item to a cart, or updating a profile name) _before_ the server has actually confirmed it. If the server request succeeds, the UI stays updated. If the server fails, React automatically rolls back the change.

---

### How It Works in 3 Steps

1. **The Real State:** You pass your actual database state (e.g., `likes = 5`) into the hook.
2. **The Optimistic Payload:** When an async action triggers, you call the optimistic updater function (e.g., `addOptimisticLike(1)`). The hook instantly returns a temporary, updated state (e.g., `6`) that you render on the screen.
3. **The Automatic Rollback:** The moment your async action (like a network request) finishes—whether it succeeds or fails—React automatically discards the temporary optimistic state and snaps back to your real source of truth.

---

### Basic Code Example

```jsx
import { useOptimistisc, useTransition } from "react";

export default function LikeButton({ likes, tweetId }) {
  const [isPending, startTransition] = useTransition();

  // Initialize the hook: base state + a reducer function for the temporary change
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes, amountToAdd) => currentLikes + amountToAdd,
  );

  const handleLike = () => {
    startTransition(async () => {
      // 1. Instantly update the UI before the network responds
      addOptimisticLike(1);

      // 2. Make the slow network request
      await updateDatabaseAPI(tweetId);

      // 3. When this finishes, React automatically syncs back to the real 'likes' prop.
    });
  };

  return (
    <button onClick={handleLike} disabled={isPending}>
      {/* Render the optimistic state for an instant response */}
      Likes: {optimisticLikes}
    </button>
  );
}
```

### Why It's a Game Changer

Before React 19, writing an optimistic update meant manually managing rollback logic inside a `try/catch` block, writing extra error state variables, and manually reverting the UI if the fetch threw an error. `useOptimistic` completely automates the rollback and sync mechanics for you.

```js
import { useOptimistic } from "react";

function MessageList({ messages, sendMessage }) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { text: newMessage, sending: true }],
  );

  async function handleSend(formData) {
    const text = formData.get("text");
    addOptimistic(text);
    await sendMessage(text);
  }

  return (
    <>
      {optimisticMessages.map((m, i) => (
        <p key={i} style={{ opacity: m.sending ? 0.5 : 1 }}>
          {m.text}
        </p>
      ))}
      <form action={handleSend}>
        <input name="text" />
      </form>
    </>
  );
}
```
