**`<Activity>`** is a built-in React component that lets you hide and restore the UI, DOM nodes, and internal state of its children without fully unmounting them.

Traditionally, hiding parts of your UI forced a trade-off:

1. **Conditional Rendering (`{isVisible && <Component/>}`):** Unmounts the component, completely destroying its state and DOM structure.
2. **CSS Hiding (`display: none`):** Keeps the state, but leaves Effects running, timers active, and DOM updates continuously executing in the background, wasting CPU resources.

`<Activity>` sits in the sweet spot: it preserves React state and DOM nodes while putting Effects to sleep and deprioritizing updates.

---

## 1. Reference

### `<Activity mode="{visibility}">...</Activity>`

* **`children`**: The UI subtree you want to control.
* **`mode`**: A string value determining visibility:
* `"visible"` (default): Children are visible, effects are active, and updates are processed normally.
* `"hidden"`: Children are visually hidden (via `display: none`), their effects are cleaned up (timers/subscriptions canceled), and updates are deferred until React is idle.

---

## 2. Usage Scenarios

### Restoring the state of hidden components

If you have a tabbed interface, multi-step wizard, or a complex form where users frequently navigate away and back, wrapping the view in `<Activity>` ensures user inputs, form drafts, and scroll positions remain intact without re-fetching or resetting.

```jsx
import { useState, Activity } from 'react';

function Dashboard() {
  const [currentTab, setCurrentTab] = useState('feed');

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentTab('feed')}>Feed</button>
        <button onClick={() => setCurrentTab('settings')}>Settings</button>
      </nav>

      {/* Feed stays mounted in memory, preserving its state and scroll position */}
      <Activity mode={currentTab === 'feed' ? 'visible' : 'hidden'}>
        <FeedTab />
      </Activity>

      <Activity mode={currentTab === 'settings' ? 'visible' : 'hidden'}>
        <SettingsTab />
      </Activity>
    </div>
  );
}

```

### Restoring the DOM of hidden components

When an `<Activity>` switches from `hidden` to `visible`, React instantly restores the exact DOM structure and focus states that were active previously, providing a seamless user experience.

### Pre-rendering content that’s likely to become visible

You can pre-render components that a user is likely to navigate to next in `hidden` mode. This allows images, CSS, and component trees to load in the background, making future navigations feel instantaneous.

### Speeding up interactions during page load

By rendering background or secondary panels in `hidden` mode, React assigns them lower priority in the scheduler, ensuring that critical user interactions on the visible screen remain completely unblocked and snappy.

---

## 3. Troubleshooting

### My hidden components have unwanted side effects

* **Cause:** Even when `mode="hidden"`, hidden components still receive prop updates and can re-render in the background (albeit at a lower priority). If your background computations are heavy or rely on frequent prop changes, it can still consume resources.
* **Fix:** Ensure your hidden components are optimized or use `React.memo` if their props change frequently while hidden.

### My hidden components have Effects that aren’t running

* **Cause:** This is intended behavior. When `mode="hidden"`, React unmounts and cleans up all Effects inside the `<Activity>` tree to prevent background memory leaks or active network polling.
* **Fix:** If an Effect *must* run even when hidden, move that logic outside of the `<Activity>` boundary.
