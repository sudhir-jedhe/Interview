**No, `useReducer` and `useState` perform identically under the hood in React.**

In fact, inside React’s internal codebase, `useState` is actually implemented using `useReducer`. Both hooks trigger re-renders in the exact same way when state changes, and both use `Object.is` reference checks to determine if an update occurred.

However, `useReducer` offers distinct **architectural and optimization advantages** that can help you prevent unnecessary re-renders in real-world applications.

---

### Key Architectural & Optimization Advantages of `useReducer`

#### 1. Stable `dispatch` Reference

The `dispatch` function returned by `useReducer` is guaranteed by React to be identity-stable across re-renders (it never changes).

* **With `useState`:** When passing callback functions down to child components, you often pass inline handlers or functions defined inside the component. If you forget to wrap them in `useCallback`, child components wrapped in `React.memo` will re-render needlessly.
* **With `useReducer`:** You can safely pass `dispatch` down through deep component trees (or via Context) without worrying about `useCallback` dependencies.

```jsx
// Parent Component
const [state, dispatch] = useReducer(reducer, initialState);

// 'dispatch' never changes, so Child won't re-render if wrapped in React.memo
return <Child dispatch={dispatch} />;

```

#### 2. Avoiding Stale Closures in Complex Callbacks

When an update depends on multiple existing state variables or previous states, `useState` requires those variables to be added to `useCallback` or `useEffect` dependency arrays, causing functions to recreate frequently.

With `useReducer`, state transitions are decoupled from the action triggers. The reducer function always receives the **latest state** as its first argument when invoked, eliminating stale closure bugs.

```jsx
// useState approach: Requires both 'count' and 'step' in callback dependencies
const increment = useCallback(() => {
  setCount(c => c + step);
}, [step]); // Recreated whenever 'step' changes

// useReducer approach: Dispatch is static; reducer accesses current state cleanly
const increment = () => dispatch({ type: 'INCREMENT' });

```

#### 3. Bypassing Re-renders via Early Return

Inside a reducer, if an action results in state returning the exact same reference as the current state, React bailouts kick in and prevent the component tree from re-rendering.

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      if (state.filter === action.payload) {
        return state; // Same reference -> React skips re-rendering entirely!
      }
      return { ...state, filter: action.payload };
  }
}

```

---

### When to Choose Which?

| Feature / Metric               | `useState`                           | `useReducer`                                 |
| ------------------------------ | ------------------------------------ | -------------------------------------------- |
| **Raw Rendering Benchmark**    | Identical                            | Identical                                    |
| **Code Footprint**             | Low (Best for simple state)          | Higher (Requires action/reducer boilerplate) |
| **Complex State Dependencies** | Prone to stale closures              | Clean & centralized                          |
| **Deep Component Trees**       | Requires `useCallback` everywhere    | Pass stable `dispatch` via Context           |
| **Unit Testability**           | Harder (Tied to component lifecycle) | Easy (Reducer is a pure JS function)         |

---

### Summary

Use **`useState`** when state is simple, independent, and local to a single component (e.g., toggles, form fields).

Use **`useReducer`** when you have complex state logic involving multiple sub-values, when the next state depends on the previous state, or when passing updates down deep component trees where avoiding unnecessary re-renders matters.

Show how to set up a React Context for useReducer dispatch to avoid re-rendering consumer components.

The most effective way to prevent unnecessary re-renders when using `useReducer` with React Context is the **Split-Context Pattern**.

If you put both `state` and `dispatch` in a single Context value object (e.g., `<Context.Provider dispatch state, value="{{" }}>`), every consumer subscribing to that context will re-render whenever `state` changes—even if a child component only needs `dispatch` to trigger actions.

By creating two separate Contexts—one for `state` and one for `dispatch`—components that only dispatch actions never re-render when state changes.

---

### Step-by-Step Implementation

#### 1. Define the Reducer and Contexts

Create separate contexts for state and dispatch, and export custom hooks for clean consumer access.

```jsx
// TaskContext.jsx
import { createContext, useContext, useReducer } from 'react';

// 1. Create separate contexts
const TaskStateContext = createContext(null);
const TaskDispatchContext = createContext(null);

// Initial state and reducer
const initialTasks = [
  { id: 1, text: 'Learn React Context', done: true },
  { id: 2, text: 'Optimize component re-renders', done: false },
];

function taskReducer(tasks, action) {
  switch (action.type) {
    case 'ADD':
      return [...tasks, { id: Date.now(), text: action.text, done: false }];
    case 'TOGGLE':
      return tasks.map(t => (t.id === action.id ? { ...t, done: !t.done } : t));
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// 2. Provider component wrapping both contexts
export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  return (
    <TaskStateContext.Provider value={tasks}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  );
}

// 3. Custom hooks with built-in safety checks
export function useTasks() {
  const context = useContext(TaskStateContext);
  if (context === null) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

export function useTaskDispatch() {
  const context = useContext(TaskDispatchContext);
  if (context === null) {
    throw new Error('useTaskDispatch must be used within a TaskProvider');
  }
  return context;
}

```

---

#### 2. Consuming in Components

Because the contexts are split, the component adding tasks only subscribes to `TaskDispatchContext`. It will **never re-render** when the task list updates.

```jsx
// AddTask.jsx
import { useState } from 'react';
import { useTaskDispatch } from './TaskContext';

export function AddTask() {
  const [text, setText] = useState('');
  
  // Subscribes ONLY to dispatch (stable reference)
  // This component DOES NOT re-render when the tasks list changes!
  const dispatch = useTaskDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    dispatch({ type: 'ADD', text });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Add a new task..." 
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

```

```jsx
// TaskList.jsx
import { useTasks, useTaskDispatch } from './TaskContext';

export function TaskList() {
  // Subscribes to state updates (re-renders when tasks change)
  const tasks = useTasks();
  const dispatch = useTaskDispatch();

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => dispatch({ type: 'TOGGLE', id: task.id })}
          />
          {task.text}
        </li>
      ))}
    </ul>
  );
}

```

---

### Why This Prevents Re-renders

```
                 <TaskProvider>
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
<TaskStateContext.Provider>   <TaskDispatchContext.Provider>
 (Changes on every state update)      (Reference never changes)
       │                               │
       ▼                               ▼
  <TaskList />                   <AddTask />
(Re-renders on update)         (NEVER re-renders on update)

```

1. **Dispatch Stability:** React guarantees that the `dispatch` function from `useReducer` remains identity-stable across all renders.
2. **Context Isolation:** `TaskDispatchContext.Provider`'s value (`dispatch`) never changes. As a result, React bypasses all components subscribing exclusively to `useTaskDispatch()`.
3. **No `useMemo` Overhead Needed:** You don't need to manually wrap context provider values in `useMemo` to keep `dispatch` stable.

Yes, absolutely! Creating a custom `useState` or `useReducer` is a highly popular interview topic. It tests your understanding of React's internal mechanics, specifically **closures** and **hook rules**.

Depending on the interview, you might be asked to do this in two different ways. Here is how you should document both approaches for your master repository.

> **Repo Organization Tip:** Save this content inside `08-Scenario-Based-Questions/react-internals.md` or a dedicated React folder if you create one.

---

## 1. Building `useReducer` using `useState`

This is a very common scenario question. The interviewer will ask: *"React actually builds `useState` on top of `useReducer` internally, but can you do the reverse? Can you write a custom `useReducer` using only `useState`?"*

**The Implementation:**

```javascript
import { useState } from 'react';

// Custom useReducer implementation
function useCustomReducer(reducer, initialState) {
  // 1. Hold the current state
  const [state, setState] = useState(initialState);

  // 2. Create a dispatch function that takes an action
  function dispatch(action) {
    // 3. Pass current state and action to the reducer to get the new state
    const nextState = reducer(state, action);
    
    // 4. Update the React state
    setState(nextState);
  }

  // 5. Return exactly like native useReducer
  return [state, dispatch];
}

```

---

## 2. Building `useState` from Scratch (Vanilla JS)

Sometimes, an interviewer will say: *"Forget React. Using pure JavaScript, implement how `useState` remembers data between function calls."*

This tests your knowledge of **Closures**. Because function variables are wiped out when the function finishes, React uses an external array hidden in a closure to remember your state.

**The Implementation:**

```javascript
// This represents React's internal memory
const ReactInternals = (function() {
  let hooksArray = []; // Stores all states for a component
  let cursor = 0;      // Tracks which useState is currently being called

  return {
    render(Component) {
      // Reset the cursor every time the component re-renders
      cursor = 0; 
      const output = Component();
      return output;
    },

    myUseState(initialValue) {
      // Capture the current cursor position for this specific state
      const currentCursor = cursor; 

      // Initialize state if it's the first render
      if (hooksArray[currentCursor] === undefined) {
        hooksArray[currentCursor] = initialValue;
      }

      // Create the setState function
      const setState = (newValue) => {
        hooksArray[currentCursor] = newValue;
        // In real React, this would trigger a re-render here
      };

      // Increment cursor for the NEXT useState call in the component
      cursor++;

      return [hooksArray[currentCursor], setState];
    }
  };
})();

// Extract our custom hook
const { myUseState, render } = ReactInternals;

```

### Why this explains the "Rules of Hooks"

If you look closely at the Vanilla JS implementation above, it relies entirely on the `cursor` index (0, 1, 2, etc.) remaining in the exact same order on every render.

This is exactly **why you cannot put hooks inside `if` statements or loops**. If a hook is skipped, the `cursor` gets misaligned, and your component will grab the wrong piece of state from the `hooksArray`!

Show me how to build a custom useLocalStorage hook that extends useState to automatically save data to the browser.

This is one of the most practical custom hooks you can build, and it frequently comes up in interviews when you are asked to demonstrate how to combine React state with browser APIs.

> **Repo Organization Tip:** Save this content inside `08-Scenario-Based-Questions/react-use-local-storage.md` or inside a dedicated `React-Hooks` folder if you choose to create one.

---

# Scenario: Building a `useLocalStorage` Hook

**The Task:** Create a custom hook that behaves exactly like `useState`, but automatically syncs its value to the browser's `localStorage`. If the page is refreshed, the hook should initialize with the saved value instead of the default value.

## The Implementation

```javascript
import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  // 1. Pass a callback to useState (Lazy Initialization)
  // This ensures we only read from localStorage on the FIRST render,
  // preventing expensive synchronous operations on every re-render.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Check if the item exists in local storage
      const item = window.localStorage.getItem(key);
      
      // Parse stored JSON or return initialValue if nothing is saved
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error (e.g., incognito mode restricts access), fallback to initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Create a wrapped setter function
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update React state
      setStoredValue(valueToStore);
      
      // Update local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 3. Return the state and our wrapped setter, just like useState
  return [storedValue, setValue];
}

```

## How to use it in a Component

To the component, this looks and acts exactly like a normal `useState` hook. The synchronization with the browser happens entirely behind the scenes.

```jsx
import React from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function ThemeToggle() {
  // Uses our custom hook instead of useState
  // If 'theme' exists in localStorage, it will use that instead of 'light'
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    // We can pass a callback just like normal useState
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}>
      <h1>Current Theme: {theme}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

```

## Key Interview Talking Points

If an interviewer asks you to explain this code, highlight these three concepts:

1. **Lazy Initialization:** By passing an arrow function to `useState(() => { ... })`, React only executes that function on the initial render. Reading from `localStorage` is synchronous and can be slow; doing it on every render would cause performance bottlenecks.
2. **API Parity:** The custom `setValue` function checks if the passed value is a function (`value instanceof Function`). This ensures our hook supports the functional update pattern of regular `useState` (e.g., `setCount(prev => prev + 1)`).
3. **Error Handling:** `localStorage` can throw errors. For example, if a user's storage quota is exceeded, or if they are using restrictive privacy settings (like older Safari incognito mode), `getItem` or `setItem` might fail. Wrapping them in `try/catch` prevents the entire React app from crashing.
