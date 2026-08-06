The **Before Mutation Phase** is the very first sub-phase of React's **Commit Phase**.

While the Render Phase calculates what changes need to be made offscreen, the Before Mutation Phase happens **immediately before React touches or modifies any live DOM nodes**. It acts as React's final window to read information from the current, un-mutated DOM that would otherwise be lost or altered once structural updates occur.

---

### 1. Why the Before Mutation Phase Exists

Certain visual and layout properties only exist in the live DOM before an update takes place:

* **Scroll Positions:** Prepending new items to a scrollable container (e.g., a chat thread or activity feed) pushes the container down, causing the user's view to jump unexpectedly.
* **Text Selection & Focus State:** Structural DOM updates or node deletions can lose active text selections or element focus.
* **Element Dimensions:** Measuring an element's precise size before a layout transition or dynamic content injection.

If you attempt to read these properties inside `useEffect` or `componentDidUpdate`, the DOM has already mutated, and the original pre-update measurements are lost forever. The Before Mutation Phase provides a safe, synchronous window to capture this pre-update DOM state.

---

### 2. Execution Order & Traversal

During the Before Mutation Phase, React walks the Fiber tree in **depth-first post-order** (visiting child components before their parent components).

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. BEFORE MUTATION PHASE (Pre-DOM Read)                                │
 │ • Executes getSnapshotBeforeUpdate()                                   │
 │ • Captures pre-update DOM snapshot values                              │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. MUTATION PHASE (DOM Writes)                                         │
 │ • Applies DOM Deletions ──► Placements ──► Updates                    │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. LAYOUT PHASE (Post-DOM Update, Pre-Paint)                           │
 │ • Executes componentDidUpdate(prevProps, prevState, snapshot)          │
 └────────────────────────────────────────────────────────────────────────┘

```

---

### 3. `getSnapshotBeforeUpdate(prevProps, prevState)`

`getSnapshotBeforeUpdate` is the primary lifecycle method executed during the Before Mutation Phase. It is available on **Class Components**.

#### Method Signature

```javascript
getSnapshotBeforeUpdate(prevProps, prevState) {
  // 1. Inspect previous props/state alongside current DOM properties (via refs)
  // 2. Return a snapshot value (or null)
}

```

#### How the Snapshot Value Flows

1. React executes `getSnapshotBeforeUpdate(prevProps, prevState)` right before mutating the DOM.
2. Whatever value you `return` from `getSnapshotBeforeUpdate` is passed as the **third argument (`snapshot`)** to `componentDidUpdate(prevProps, prevState, snapshot)` in the **Layout Phase**.

---

### 4. Code Example: Chat Feed Scroll Preservation

A classic scenario for `getSnapshotBeforeUpdate` is a live chat window or log viewer where new messages arrive at the top or bottom, and you want to prevent the scroll position from jumping while the user is reading older messages.

```jsx
import React from 'react';

class ChatThread extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  // 1. BEFORE MUTATION PHASE: Read the live DOM before React updates it!
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Check if new messages were added to the list
    if (prevProps.messages.length < this.props.messages.length) {
      const list = this.listRef.current;
      
      // Calculate distance from the bottom of the scroll container
      const scrollOffset = list.scrollHeight - list.scrollTop;
      
      // Return this snapshot value to be used in componentDidUpdate
      return scrollOffset;
    }
    
    return null;
  }

  // 2. LAYOUT PHASE: Runs after DOM updates, before browser paint
  componentDidUpdate(prevProps, prevState, snapshot) {
    // If getSnapshotBeforeUpdate returned a value (not null)
    if (snapshot !== null) {
      const list = this.listRef.current;
      
      // Adjust scroll position so the user stays at the exact same relative scroll point
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div 
        ref={this.listRef} 
        style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc' }}
      >
        {this.props.messages.map((msg) => (
          <div key={msg.id} style={{ padding: '8px' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
    );
  }
}

export default ChatThread;

```

---

### 5. Function Components Equivalent (`useLayoutEffect` Pattern)

Because Hooks do not have a direct 1:1 equivalent to `getSnapshotBeforeUpdate`, in modern Function Components you achieve the same result by reading the DOM synchronously inside **`useLayoutEffect`** or by using state/ref snapshots **during the Render Phase**:

```jsx
import React, { useState, useRef, useLayoutEffect } from 'react';

function ChatThreadFunction({ messages }) {
  const listRef = useRef(null);
  const snapshotRef = useRef(null);
  const prevMessagesLengthRef = useRef(messages.length);

  // Read pre-update layout during render if props changed
  if (messages.length > prevMessagesLengthRef.current) {
    if (listRef.current) {
      const list = listRef.current;
      snapshotRef.current = list.scrollHeight - list.scrollTop;
    }
    prevMessagesLengthRef.current = messages.length;
  }

  // Adjust scroll in useLayoutEffect (before paint)
  useLayoutEffect(() => {
    if (snapshotRef.current !== null && listRef.current) {
      const list = listRef.current;
      list.scrollTop = list.scrollHeight - snapshotRef.current;
      snapshotRef.current = null; // Clear snapshot
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

### Summary Checklist

| Property           | Details                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **Phase Location** | First sub-phase of the Commit Phase.                                                        |
| **Timing**         | Post-Render Phase, **Before Mutation Phase** (DOM is untouched).                            |
| **Execution Mode** | Synchronous and Blocking.                                                                   |
| **Primary Method** | `getSnapshotBeforeUpdate(prevProps, prevState)`                                             |
| **Data Flow**      | Return value $\rightarrow$ 3rd argument (`snapshot`) of `componentDidUpdate`.               |
| **Primary Rule**   | Used purely for **reading** the DOM. Do **not** trigger state updates or side effects here. |
