Here is the complete **Undo / Redo** pattern implementation in English using a custom React Hook (`useUndoRedo`).

---

### 1. Custom Hook (`useUndoRedo.js`)

This custom hook manages the `history` array, tracks the `currentIndex`, and trims "future" states if a new edit occurs after an undo operation.

```javascript
import { useState, useCallback } from 'react';

export function useUndoRedo(initialState) {
  // 1. Array to hold all history states
  const [history, setHistory] = useState([initialState]);
  // 2. Index pointing to the active state in history
  const [currentIndex, setCurrentIndex] = useState(0);

  // Active state derived directly from the current index
  const currentState = history[currentIndex];

  // Helper flags for enabling/disabling UI buttons
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Function to push a new state
  const setState = useCallback(
    (newState) => {
      // Support function updates: setState(prev => prev + 1)
      const resolvedState =
        typeof newState === 'function' ? newState(history[currentIndex]) : newState;

      // Prevent duplicate consecutive entries
      if (resolvedState === history[currentIndex]) return;

      // Truncate any "redo" future states if we make a new edit from an undone position
      const updatedHistory = history.slice(0, currentIndex + 1);

      setHistory([...updatedHistory, resolvedState]);
      setCurrentIndex(updatedHistory.length);
    },
    [history, currentIndex]
  );

  // Move back one step in history
  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  }, [canUndo]);

  // Move forward one step in history
  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }, [canRedo]);

  return {
    state: currentState,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    currentIndex,
  };
}

```

---

### 2. React UI Component (`UndoRedoExample.jsx`)

Here is how you can use the hook inside a React component (e.g., a text input or counter):

```jsx
import React from 'react';
import { useUndoRedo } from './useUndoRedo';

export default function UndoRedoExample() {
  const {
    state: text,
    setState: setText,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    currentIndex,
  } = useUndoRedo(''); // Initial state is an empty string ''

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h2>React Undo / Redo Pattern</h2>

      {/* Controlled Input */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something here..."
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '15px',
        }}
      />

      {/* Control Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={undo} disabled={!canUndo} style={{ padding: '8px 16px' }}>
          ↩ Undo
        </button>
        <button onClick={redo} disabled={!canRedo} style={{ padding: '8px 16px' }}>
          ↪ Redo
        </button>
      </div>

      {/* State Inspector / Debug Box */}
      <div style={{ background: '#f4f4f4', padding: '12px', borderRadius: '6px' }}>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>Current Index:</strong> {currentIndex}
        </p>
        <p style={{ margin: 0 }}>
          <strong>History Array:</strong> {JSON.stringify(history)}
        </p>
      </div>
    </div>
  );
}

```

---

### Step-by-Step Logic Breakdown

1. **Initial State:**

* `history = ["Hello"]`
* `currentIndex = 0`
* `currentState = history[0]` $\rightarrow$ `"Hello"`

1. **State Change (User types "World"):**

* `history = ["Hello", "Hello World"]`
* `currentIndex = 1`

1. **User Clicks Undo:**

* `currentIndex` decrements (`1 -> 0`).
* `currentState` evaluates to `history[0]` $\rightarrow$ `"Hello"`.

1. **User Clicks Redo:**

* `currentIndex` increments (`0 -> 1`).
* `currentState` evaluates to `history[1]` $\rightarrow$ `"Hello World"`.

1. **Branching / Trimming Future History:**

* If you undo back to index `0` and type something new (e.g., `"Hello React"`), `history.slice(0, 1)` strips out `"Hello World"` and appends `"Hello React"`.
* `history = ["Hello", "Hello React"]`
* `currentIndex = 1`
