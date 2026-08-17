**`useDeferredValue`** is a React Hook that lets you defer updating a specific part of the UI so that it doesn't block the main thread. It is primarily used to keep your application highly responsive—like ensuring a text input doesn't lag—while React handles heavy background calculations or data fetching.

Here is a detailed breakdown of its API and how to implement its core usage patterns.

---

## 1. Reference

### `useDeferredValue(value, initialValue?)`

* **`value`**: The state or prop you want to defer. It can be of any type.
* **`initialValue` (Optional, React 19+)**: A value to use during the initial render of the component. If omitted, `useDeferredValue` will not defer during the very first render.

**Returns:**

* **`deferredValue`**: During the initial render, the returned deferred value will be identical to the `value` you provided. When an update occurs, React first re-renders the component with the *old* value (keeping the UI responsive), and then schedules a background re-render with the *new* value.

---

## 2. Usage Scenarios

### Showing stale content while fresh content is loading

When you use React `<Suspense>`, fetching new data usually hides the current UI and replaces it with a loading fallback (like a spinner). This can create a jarring user experience, especially for things like search results where the user expects to see the old results until the new ones arrive.

By passing your search query into `useDeferredValue`, React will keep the old data on the screen while the new data is fetching in the background.

```jsx
import { useState, useDeferredValue, Suspense } from 'react';
import SearchResults from './SearchResults';

function App() {
  const [query, setQuery] = useState('');
  
  // React will use the old query for the list until the new data is ready
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      
      <Suspense fallback={<h2>Loading results...</h2>}>
        {/* Pass the deferred value down to the component that fetches data */}
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  );
}

```

### Indicating that the content is stale

If you are showing old content while new content loads in the background, it is a good UX practice to let the user know the data on screen is temporarily out of date.

You can easily detect if the content is currently deferred by checking if the original `value` matches the `deferredValue`.

```jsx
function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  // If they don't match, React is currently calculating the new results in the background
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      
      <div style={{
        opacity: isStale ? 0.5 : 1,
        transition: 'opacity 0.2s ease'
      }}>
        <Suspense fallback={<h2>Loading...</h2>}>
          <SearchResults query={deferredQuery} />
        </Suspense>
      </div>
    </div>
  );
}

```

### Deferring re-rendering for a part of the UI

Sometimes, the performance bottleneck isn't network fetching, but heavy client-side rendering (like rendering a complex chart or filtering a list of 10,000 items). If this heavy component re-renders on every keystroke, the user's typing will lag and stutter.

You can use `useDeferredValue` combined with `React.memo` to prioritize the text input rendering and delay the heavy component rendering until the user stops typing.

**Important Rule:** To optimize a heavy component, you **must** wrap that component in `React.memo`. If you don't, the heavy component will re-render anyway when the parent updates the input state.

```jsx
import { useState, useDeferredValue, memo } from 'react';

// 1. Wrap the heavy component in memo so it only re-renders when its props change
const HeavyChart = memo(function HeavyChart({ data }) {
  // ... expensive rendering logic ...
  return <div>Chart based on {data}</div>;
});

function Dashboard() {
  const [text, setText] = useState('');
  
  // 2. Defer the text value
  const deferredText = useDeferredValue(text);

  return (
    <div>
      {/* The input uses the instant 'text' state. It will never lag. */}
      <input value={text} onChange={(e) => setText(e.target.value)} />
      
      {/* The chart uses the 'deferredText'. React waits until the main thread is idle to update it. */}
      <HeavyChart data={deferredText} />
    </div>
  );
}

```

### How `useDeferredValue` differs from Debounce or Throttle

* **Debounce/Throttle:** These are fixed timers. They block the update for an arbitrary amount of time (e.g., 300ms) regardless of how fast the user's computer is.
* **useDeferredValue:** This is deeply integrated into React's rendering engine. There is no fixed delay. If the user's device is fast, the deferred render happens almost instantly. If the device is slow, React waits until the browser has breathing room to paint the heavy UI. It is also interruptible—if the user types another key while React is doing the background work, React aborts the heavy render and handles the keystroke first.
