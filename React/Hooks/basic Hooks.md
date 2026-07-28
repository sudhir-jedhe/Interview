React Hooks are functions that let you “hook into” React state and lifecycle features from function components. They simplify the logic and make it easier to manage state, side effects, context, and more within a component. Below is a list of commonly used React hooks with examples and scenarios for when to use them.

### **1. `useState`**

The `useState` hook lets you add state to your function components. It's used when you need to store a variable in the component that can change over time.

#### **When to use**:

- Use `useState` when you need to track simple state values like numbers, strings, booleans, or arrays.

#### **Example**:

```jsx
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default Counter;
```

### **2. `useEffect`**

The `useEffect` hook lets you perform side effects in function components. It runs after every render by default, and you can control when it runs by passing dependency arrays.

#### **When to use**:

- Use `useEffect` to handle side effects like fetching data, setting up subscriptions, or manually modifying the DOM.
- It’s also used for cleanup tasks (e.g., removing event listeners or canceling network requests).

#### **Example**:

```jsx
import React, { useState, useEffect } from "react";

function FetchData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://api.example.com/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []); // Empty array ensures this effect runs only once when the component mounts

  if (!data) return <div>Loading...</div>;
  return <div>Data: {JSON.stringify(data)}</div>;
}

export default FetchData;
```

### **3. `useContext`**

The `useContext` hook allows you to access values from the nearest `Context` without having to pass props through every level of your component tree.

#### **When to use**:

- Use `useContext` when you need to access global state or props at a deep level without passing them through every intermediate component.

#### **Example**:

```jsx
import React, { useContext } from "react";

// Create a context
const ThemeContext = React.createContext("light");

function ThemedComponent() {
  const theme = useContext(ThemeContext);

  return <div>The current theme is {theme}</div>;
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedComponent />
    </ThemeContext.Provider>
  );
}

export default App;
```

### **4. `useReducer`**

The `useReducer` hook is usually preferable to `useState` when dealing with complex state logic involving multiple sub-values or when the next state depends on the previous one.

#### **When to use**:

- Use `useReducer` when your state logic is complex or when you're managing multiple related state variables. It's especially useful for state management in larger applications.

#### **Example**:

```jsx
import React, { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
      <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
    </div>
  );
}

export default Counter;
```

### **5. `useRef`**

The `useRef` hook is used to create a mutable object that persists across renders. You can use it to access DOM elements directly or keep a mutable value that doesn't trigger re-renders.

#### **When to use**:

- Use `useRef` for accessing DOM elements (e.g., focusing an input), storing a value that doesn't cause re-rendering, or keeping track of previous state values.

#### **Example**:

```jsx
import React, { useState, useRef } from "react";

function FocusInput() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}

export default FocusInput;
```

### **6. `useMemo`**

The `useMemo` hook returns a memoized value. It only recomputes the memoized value when one of the dependencies changes.

#### **When to use**:

- Use `useMemo` when you want to optimize expensive calculations and avoid unnecessary re-computation on every render.

#### **Example**:

```jsx
import React, { useMemo } from "react";

function ExpensiveComputation({ a, b }) {
  const result = useMemo(() => {
    console.log("Computing...");
    return a + b;
  }, [a, b]);

  return <div>Result: {result}</div>;
}

export default ExpensiveComputation;
```

### **7. `useCallback`**

The `useCallback` hook returns a memoized version of a callback function that only changes if one of the dependencies has changed.

#### **When to use**:

- Use `useCallback` to prevent unnecessary re-creation of functions that are passed as props to child components or used in effects.

#### **Example**:

```jsx
import React, { useState, useCallback } from "react";

function ChildComponent({ onClick }) {
  console.log("Child render");
  return <button onClick={onClick}>Click Me</button>;
}

function ParentComponent() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []); // `increment` function will not be re-created unless dependencies change

  return (
    <div>
      <ChildComponent onClick={increment} />
      <p>Count: {count}</p>
    </div>
  );
}

export default ParentComponent;
```

### **8. `useLayoutEffect`**

The `useLayoutEffect` hook works similarly to `useEffect`, but it is fired synchronously after all DOM mutations. It’s used to read layout from the DOM and re-render synchronously.

#### **When to use**:

- Use `useLayoutEffect` when you need to perform DOM mutations or measure layout before the browser has a chance to paint (e.g., measuring element dimensions or position).

#### **Example**:

```jsx
import React, { useLayoutEffect, useRef } from "react";

function MeasureWidth() {
  const divRef = useRef(null);

  useLayoutEffect(() => {
    console.log("Width of div:", divRef.current.offsetWidth);
  }, []);

  return <div ref={divRef}>Hello, World!</div>;
}

export default MeasureWidth;
```

### **9. `useImperativeHandle`**

The `useImperativeHandle` hook customizes the instance value that is exposed when using `ref`. It is usually used in conjunction with `forwardRef`.

#### **When to use**:

- Use `useImperativeHandle` to expose only specific methods to the parent component when using refs.

#### **Example**:

```jsx
import React, { useState, useImperativeHandle, forwardRef } from "react";

const Child = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({
    increment: () => setCount(count + 1),
  }));

  return <p>Count: {count}</p>;
});

function Parent() {
  const childRef = React.useRef();

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={() => childRef.current.increment()}>
        Increment from Parent
      </button>
    </div>
  );
}

export default Parent;
```

### **Summary of When to Use React Hooks**

| **Hook**              | **When to Use**                                                 |
| --------------------- | --------------------------------------------------------------- |
| `useState`            | To manage simple component state.                               |
| `useEffect`           | To handle side effects (e.g., data fetching, timers).           |
| `useContext`          | To access values from a React context without prop drilling.    |
| `useReducer`          | For complex state management logic.                             |
| `useRef`              | For accessing DOM elements or persisting values across renders. |
| `useMemo`             | To optimize performance by memoizing expensive calculations.    |
| `useCallback`         | To memoize functions and avoid unnecessary re-renders.          |
| `useLayoutEffect`     | To read layout and modify DOM before the paint (synchronously). |
| `useImperativeHandle` | To customize the instance value exposed via `ref`.              |

By understanding and using the right hooks in the appropriate situations, you can create efficient and clean React components.

Sure! Below is an explanation of the additional React hooks you requested, along with examples of when and how to use them.

### **1. `useDeferredValue`**

The `useDeferredValue` hook is used to defer the re-rendering of a component when its state or props are changing frequently. It helps improve performance by delaying updates until the browser is idle.

#### **When to use**:

- Use `useDeferredValue` when you have a value (like input or search) that updates frequently but does not need to update immediately in the UI. This is useful for improving performance during intensive rendering operations like typing in search bars or filtering large datasets.

#### **Example**:

```jsx
import React, { useState, useDeferredValue } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <p>Deferred Value: {deferredQuery}</p>
    </div>
  );
}

export default Search;
```

In this example, the `deferredQuery` will only be updated once the UI rendering settles, improving performance when typing in the search box.

### **2. `useId`**

The `useId` hook generates a unique ID that can be used for accessibility or to ensure uniqueness of DOM element IDs. It avoids conflicts, especially when rendering components multiple times or on the server.

#### **When to use**:

- Use `useId` when you need to generate a stable and unique ID for elements like form controls or components in your React app (especially in SSR scenarios).

#### **Example**:

```jsx
import React, { useId } from "react";

function Form() {
  const id = useId();

  return (
    <form>
      <label htmlFor={`${id}-input`}>Name</label>
      <input id={`${id}-input`} type="text" />
    </form>
  );
}

export default Form;
```

Here, `useId` ensures that each instance of the `Form` component gets a unique ID for its input element.

### **3. `useInsertionEffect`**

The `useInsertionEffect` hook is used to perform DOM mutations before the DOM is painted. This is useful for inserting styles or making changes to the DOM that need to occur before any visual updates happen.

#### **When to use**:

- Use `useInsertionEffect` when you need to modify or insert styles into the DOM before the render cycle is committed. This is especially helpful for libraries that dynamically inject styles (e.g., styled-components, CSS-in-JS).

#### **Example**:

```jsx
import React, { useInsertionEffect } from "react";

function DynamicStyleComponent() {
  useInsertionEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = ".dynamic { color: red; }";
    document.head.appendChild(style);
  }, []);

  return <div className="dynamic">This will be red!</div>;
}

export default DynamicStyleComponent;
```

In this example, the `useInsertionEffect` hook inserts a `<style>` tag before the DOM is painted to ensure styles are applied immediately.

### **4. `useSyncExternalStore`**

The `useSyncExternalStore` hook is used for subscribing to an external store, such as a Redux store or any other external state management system. It guarantees that the component will always render with the latest state from the external store.

#### **When to use**:

- Use `useSyncExternalStore` when integrating with an external store and need to synchronize the component with an external state, ensuring consistency and proper updates in concurrent rendering.

#### **Example**:

```jsx
import React, { useSyncExternalStore } from "react";

// Mock external store
const store = {
  state: { count: 0 },
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
  getState() {
    return this.state;
  },
  setState(state) {
    this.state = state;
    this.listeners.forEach((listener) => listener());
  },
};

function Counter() {
  const state = useSyncExternalStore(store.subscribe, store.getState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => store.setState({ count: state.count + 1 })}>
        Increment
      </button>
    </div>
  );
}

export default Counter;
```

In this example, `useSyncExternalStore` ensures that the component is always in sync with the external store’s state.

### **5. `useTransition`**

The `useTransition` hook is used to mark certain updates as non-urgent, allowing React to defer them if there are more urgent updates, like typing or clicking. It helps in making user interactions more responsive by rendering urgent updates immediately and deferring non-urgent ones.

#### **When to use**:

- Use `useTransition` when you have UI elements that require expensive computations (like filtering or sorting large datasets), but you don’t want to block user interactions while those updates are being computed.

#### **Example**:

```jsx
import React, { useState, useTransition } from "react";

function List() {
  const [items, setItems] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleFilter = (filter) => {
    startTransition(() => {
      const filteredItems = allItems.filter((item) => item.includes(filter));
      setItems(filteredItems);
    });
  };

  return (
    <div>
      <input type="text" onChange={(e) => handleFilter(e.target.value)} />
      {isPending ? <p>Loading...</p> : null}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const allItems = ["Apple", "Banana", "Orange", "Mango", "Grape"];

export default List;
```

In this example, `useTransition` allows the filtering operation to be deferred and only updated once React is done with more urgent UI updates, such as typing in the search box.

### **Summary of New Hooks**

| **Hook**               | **When to Use**                                                                             | **Example**                                             |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `useDeferredValue`     | To defer updates of frequently changing values (e.g., search input) to improve performance  | `useDeferredValue(query)`                               |
| `useId`                | To generate unique IDs for components, especially in SSR scenarios                          | `const id = useId()`                                    |
| `useInsertionEffect`   | To perform DOM mutations or inject styles before the paint                                  | `useInsertionEffect(() => {...})`                       |
| `useSyncExternalStore` | To subscribe to an external store (e.g., Redux or custom stores) and synchronize with state | `useSyncExternalStore(store.subscribe, store.getState)` |
| `useTransition`        | To defer non-urgent updates like rendering large lists or performing expensive calculations | `const [isPending, startTransition] = useTransition()`  |

These hooks provide advanced capabilities to handle asynchronous tasks, optimize performance, and manage external state in a React app, making it easier to build highly interactive and performant user interfaces.
