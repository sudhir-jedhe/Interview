Here is a clean, structured reference guide detailing the **Before Mutation Phase**, `getSnapshotBeforeUpdate`, and how to handle pre-update DOM measurements in both Class Components and modern Function Components.

---

# React's Before Mutation Phase: Capturing Pre-Update DOM State

The **Before Mutation Phase** is the first sub-phase of React's **Commit Phase**.

While the Render Phase calculates what changes need to be made offscreen in memory, the Before Mutation Phase happens **immediately before React applies any structural or attribute changes to the live HTML DOM**. It acts as React's final window to capture DOM properties that will be permanently lost or altered once mutations take place.

---

## 1. Why Pre-Update Snapshotting Is Necessary

Once React mutates the DOM (inserting, deleting, or updating nodes), certain layout properties are overwritten or destroyed instantly:

* **Scroll Offsets:** Prepending new items to a scrollable log or chat container alters `scrollHeight`. Without measuring `scrollTop` first, the UI jumps, pushing the user away from their current reading position.
* **Text Selection & Focus:** Structural updates or node replacements can destroy active text selections or blur the focused element.
* **Element Dimensions:** Capturing bounding rect measurements before an element changes size or collapses.

Attempting to read these values inside `useEffect` or `componentDidUpdate` is too late because the DOM has already mutated.

---

## 2. Commit Phase Execution Timeline

During the Before Mutation Phase, React walks the Fiber tree in **depth-first post-order** (visiting children before parents) before making any live DOM changes.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. BEFORE MUTATION PHASE (Pre-DOM Read)                                │
 │ • Executes getSnapshotBeforeUpdate()                                   │
 │ • Captures pre-update DOM values before any live mutations occur       │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. MUTATION PHASE (DOM Writes)                                         │
 │ • Applies live DOM mutations: Deletions ──► Placements ──► Updates    │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. LAYOUT PHASE (Post-DOM Update, Pre-Paint)                           │
 │ • Executes componentDidUpdate(prevProps, prevState, snapshot)          │
 │ • Restores scroll positions or measurements using snapshot data        │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## 3. Class Components: `getSnapshotBeforeUpdate`

`getSnapshotBeforeUpdate` is the primary lifecycle method that runs during the Before Mutation Phase.

### Method Signature

```javascript
getSnapshotBeforeUpdate(prevProps, prevState) {
  // 1. Read current DOM layout properties via refs
  // 2. Return a snapshot value (or null)
}

```

### Data Flow to Layout Phase

Whatever value you `return` from `getSnapshotBeforeUpdate` is passed as the **third argument (`snapshot`)** to `componentDidUpdate(prevProps, prevState, snapshot)` inside the Layout Phase.

#### Practical Example: Chat Feed Scroll Preservation

```jsx
import React from 'react';

class ChatThread extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  // 1. BEFORE MUTATION PHASE: Read live DOM before React updates it
  getSnapshotBeforeUpdate(prevProps) {
    // If new messages were added to the list
    if (prevProps.messages.length < this.props.messages.length) {
      const list = this.listRef.current;
      
      // Calculate distance from the bottom of the container
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  // 2. LAYOUT PHASE: Runs post-mutation, pre-paint
  componentDidUpdate(prevProps, prevState, snapshot) {
    // If snapshot contains a returned scroll offset value
    if (snapshot !== null) {
      const list = this.listRef.current;
      
      // Restore scroll position so user's reading position remains steady
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef} style={{ height: '300px', overflowY: 'auto' }}>
        {this.props.messages.map((msg) => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
    );
  }
}

```

---

## 4. Function Components Equivalent

Because Hooks do not have a direct 1:1 `useSnapshotBeforeUpdate` API, function components capture pre-update DOM state by reading refs **during the Render Phase** and adjusting layout synchronously inside **`useLayoutEffect`**:

```jsx
import React, { useRef, useLayoutEffect } from 'react';

function ChatThreadFunction({ messages }) {
  const listRef = useRef(null);
  const snapshotRef = useRef(null);
  const prevMessagesLengthRef = useRef(messages.length);

  // Read pre-update DOM layout directly during render if incoming props changed
  if (messages.length > prevMessagesLengthRef.current) {
    if (listRef.current) {
      const list = listRef.current;
      snapshotRef.current = list.scrollHeight - list.scrollTop;
    }
    prevMessagesLengthRef.current = messages.length;
  }

  // Adjust scroll synchronously inside useLayoutEffect (before paint)
  useLayoutEffect(() => {
    if (snapshotRef.current !== null && listRef.current) {
      const list = listRef.current;
      list.scrollTop = list.scrollHeight - snapshotRef.current;
      snapshotRef.current = null; // Reset snapshot
    }
  }, [messages]);

  return (
    <div ref={listRef} style={{ height: '300px', overflowY: 'auto' }}>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.text}</div>
      ))}
    </div>
  );
}

```

---

## Summary Checklist

| Concept             | Key Takeaway                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Timing**          | First sub-phase of Commit Phase; runs **before** live DOM mutations.                                          |
| **Primary Method**  | `getSnapshotBeforeUpdate(prevProps, prevState)`                                                               |
| **Pipeline Target** | Passes returned `snapshot` value directly into `componentDidUpdate`.                                          |
| **Golden Rule**     | Use strictly for **reading** pre-update DOM state. Never trigger side-effects or state updates in this phase. |
