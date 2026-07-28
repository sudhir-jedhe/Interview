### What is `flushSync` in React?

`flushSync` forces React to **apply state updates immediately and synchronously**, instead of waiting for React's normal batching and rendering cycle.

It is provided by `react-dom`.

```jsx
import { flushSync } from "react-dom";
```

---

## Normal React Behavior

React batches state updates for performance.

```jsx
setCount(count + 1);
console.log(count); // Old value
```

The UI update happens later during React's render cycle.

---

## Using `flushSync`

```jsx
import { flushSync } from "react-dom";

const handleClick = () => {
  flushSync(() => {
    setCount((c) => c + 1);
  });

  console.log("DOM has been updated");
};
```

After `flushSync` completes, React has already processed the update and updated the DOM.

---

# Real-World Use Cases

## 1. Measure DOM Immediately After State Change

**Scenario:** Expand a panel and immediately measure its height.

```jsx
const handleExpand = () => {
  flushSync(() => {
    setExpanded(true);
  });

  const height = panelRef.current.offsetHeight;
  console.log(height);
};
```

Without `flushSync`, the measurement might occur before the DOM reflects the new state.

---

## 2. Auto-Scroll in Chat Applications

**Scenario:** Add a message and instantly scroll to the bottom.

```jsx
const addMessage = () => {
  flushSync(() => {
    setMessages((prev) => [...prev, newMessage]);
  });

  chatEndRef.current.scrollIntoView();
};
```

**Used in:** Chat apps, notifications, activity feeds.

---

## 3. Third-Party Library Integration

**Scenario:** A charting library needs the updated DOM before initialization.

```jsx
flushSync(() => {
  setShowChart(true);
});

initializeChart();
```

**Used with:** Chart.js, D3.js, maps, editors, visualization libraries.

---

## 4. Focus an Element Immediately

```jsx
flushSync(() => {
  setShowInput(true);
});

inputRef.current.focus();
```

The input exists in the DOM before `focus()` is called.

---

# When NOT to Use `flushSync`

Avoid using it for ordinary state updates:

```jsx
// ❌ Unnecessary
flushSync(() => {
  setLoading(true);
});
```

React's normal batching is usually faster and more efficient.

Because `flushSync` forces immediate rendering, excessive use can hurt performance.

---

# Interview Answer

> `flushSync` is used when React state updates must be processed immediately and the DOM needs to be updated before the next line of code executes. Common production use cases include measuring DOM elements after a state change, auto-scrolling chat windows, focusing newly rendered elements, and integrating with third-party libraries that require the latest DOM state. It should be used sparingly because it bypasses React's normal batching optimizations and can impact performance.
