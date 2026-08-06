Here are comprehensive, interview-ready answers with clear code examples for the React questions visible in your screenshots.

---

### **Q9: How would you write an inline style in React?**

In React, inline styles are written as JavaScript objects rather than raw CSS strings. CSS property names are written in camelCase (e.g., `backgroundColor` instead of `background-color`).

```jsx
function StyledButton() {
  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
  };

  return <button style={buttonStyle}>Click Me</button>;
}
```

---

### **Q10: What are inline conditional expressions in ReactJS?**

Inline conditional expressions allow you to render UI elements dynamically inside JSX using JavaScript operators:

1. **Ternary Operator (`condition ? trueJSX : falseJSX`):** For if-else rendering.
2. **Logical AND Operator (`condition && trueJSX`):** For conditional rendering when there is no "else" branch.

```jsx
function UserStatus({ isLoggedIn, userRole }) {
  return (
    <div>
      {/* Ternary Operator */}
      {isLoggedIn ? <h2>Welcome back!</h2> : <h2>Please log in.</h2>}

      {/* Logical AND */}
      {userRole === "admin" && <p>Admin Dashboard Access Granted</p>}
    </div>
  );
}
```

---

### **Q11: What are Stateful components in React?**

A **Stateful component** is a component that manages, retains, and updates its own local state over time. In modern React, functional components become stateful using the `useState` or `useReducer` hooks.

```jsx
import { useState } from "react";

function Counter() {
  // Local state managed inside the component
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

---

### **Q12 & Q91: What is Reconciliation and Virtual DOM in ReactJS?**

- **Virtual DOM:** A lightweight, in-memory representation of the real DOM tree.
- **Reconciliation:** The process React uses to update the browser DOM efficiently:

1. When state or props change, React generates a new Virtual DOM tree.
2. React compares the new Virtual DOM tree with the previous Virtual DOM tree using a fast diffing algorithm (**Diffing Algorithm**).
3. React computes the minimal set of changes required and updates only those specific nodes in the real browser DOM (Batch DOM updates).

---

### **Q13, Q95 & Q101: What is the purpose of using `super(props)` constructor argument in React?**

In Class components, calling `super(props)` inside the constructor passes `props` to the base `React.Component` class constructor. This allows `this.props` to be initialized and accessible directly inside the constructor body.

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props); // Initializes this.props
    console.log(this.props.title); // Accessible here!
  }

  render() {
    return <h1>{this.props.title}</h1>;
  }
}
```

---

### **Q14, Q120: What happens when you call `setState` / How does React renderer work?**

When `setState` (or a `useState` setter function) is invoked:

1. React schedules a state update and marks the component and its children as needing a re-render.
2. React re-executes the component function/render method to create a new Virtual DOM.
3. React performs diffing against the previous Virtual DOM tree.
4. React updates the actual browser DOM with only the modified elements during the Commit phase.

---

### **Q15 & Q63: What is the difference between Element and Component in ReactJS?**

| Feature        | React Element                                                                            | React Component                                                                     |
| -------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Definition** | A plain JS object describing a DOM node or component (`{ type: 'h1', props: { ... } }`). | A function or class that optionally accepts props and returns a React element tree. |
| **Mutability** | Immutable (cannot be changed once created).                                              | Dynamic; re-renders when state or props change.                                     |
| **Example**    | `const elem = <h1>Hello</h1>;`                                                           | `function App() { return <h1>Hello</h1>; }`                                         |

---

### **Q16: What are Higher-Order Components (HOC) in React?**

A **Higher-Order Component** is an advanced pattern in React for reusing component logic. An HOC is a pure function that takes a component as an argument and returns a new enhanced component.

```jsx
// HOC Definition
function withLogger(WrappedComponent) {
  return function EnhancedComponent(props) {
    console.log("Rendering component with props:", props);
    return <WrappedComponent {...props} />;
  };
}

// Usage
const UserProfileWithLogger = withLogger(UserProfile);
```

---

### **Q17: What are the advantages of using React?**

1. **Virtual DOM:** Efficient diffing algorithm minimizes costly browser DOM updates.
2. **Component-Based Architecture:** High reusability, maintainability, and separation of concerns.
3. **Declarative UI:** Predictable state-driven rendering.
4. **Rich Ecosystem & Hooks:** Clean asynchronous data fetching, state management, and custom reusable logic.
5. **Cross-Platform:** Learn once, write anywhere (Web, React Native for mobile).

---

### **Q28: What is the difference between `state` and `props`?**

| Feature        | State                                                  | Props (Properties)                                        |
| -------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| **Ownership**  | Managed internally within the component.               | Passed down from a parent component.                      |
| **Mutability** | Mutable via updater functions (`setState`/`useState`). | **Immutable** within the child component.                 |
| **Purpose**    | Holds dynamic local data that changes over time.       | Configures a component or passes callback functions down. |

---

### **Q29: What are the differences between a Class component and Functional component?**

| Feature            | Functional Component               | Class Component (Legacy)                                |
| ------------------ | ---------------------------------- | ------------------------------------------------------- |
| **Syntax**         | Plain JavaScript function.         | ES6 class extending `React.Component`.                  |
| **State Handling** | `useState` / `useReducer` hooks.   | `this.state` and `this.setState()`.                     |
| **Lifecycle**      | `useEffect` hook.                  | Explicit lifecycle methods (`componentDidMount`, etc.). |
| **Boilerplate**    | Clean, concise, easy to read/test. | Requires verbose class declarations and `this` binding. |

---

### **Q30: What does it mean for a component to be mounted in React?**

**Mounting** is the phase in a React component's lifecycle when it is instantiated, converted into Virtual DOM, and inserted into the real browser DOM tree for the very first time.

---

### **Q31: What are `refs` used for in React?**

`refs` (References) provide a way to access real DOM nodes or persist mutable values across renders without triggering a component re-render when the value changes.

**Common Use Cases:**

1. Managing focus, text selection, or media playback.
2. Triggering imperative animations.
3. Integrating third-party non-React DOM libraries.

```jsx
import { useRef } from "react";

function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  const onButtonClick = () => {
    // Directly focus the input DOM node
    inputEl.current.focus();
  };

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

---

### **Q32 & Q18: What is the difference between Presentational and Container components?**

_(Refer to Section I for detailed comparison)._

---

### **Q33 & Q62: What's the difference between a Controlled component and an Uncontrolled component?**

- **Controlled Component:** Form inputs whose value is driven by React local state (`useState`). React is the single source of truth.

```jsx
const [val, setVal] = useState("");
<input value={val} onChange={(e) => setVal(e.target.value)} />;
```

- **Uncontrolled Component:** Form inputs whose data is handled directly by the browser DOM itself. Values are read on-demand using `useRef`.

```jsx
const inputRef = useRef();
<input ref={inputRef} defaultValue="John" />;
```

---

### **Q34: What is `useState()` in React?**

`useState` is a basic React Hook that allows functional components to hold local state. It accepts an initial state value and returns an array with two elements: the current state value and an updater function.

```jsx
const [count, setCount] = useState(0);
```

---

### **Q47, Q112: What is `StrictMode` in React?**

`<React.StrictMode>` is a development tool component that checks for potential problems in an application. It does not render any visible UI and only runs in **development mode**.

**What it does:**

- Intentionally double-invokes component renders and effects to catch unsafe side effects.
- Warns about legacy string refs, deprecated class lifecycle methods, or unexpected side effects.

---

### **Q48: What's the difference between `useRef` and `createRef`?**

| Aspect             | `useRef`                                                      | `createRef`                                          |
| ------------------ | ------------------------------------------------------------- | ---------------------------------------------------- |
| **Component Type** | Used in Functional Components.                                | Used primarily in Class Components.                  |
| **Persistence**    | Returns the **same memoized ref object** across every render. | Creates a **new ref object on every single render**. |

---

### **Q49: How would you pass data from child to parent component in React?**

Pass a **callback function** as a prop from the Parent component to the Child component. The Child component then calls this callback function with the data as an argument.

```jsx
// Parent
function Parent() {
  const handleDataFromChild = (data) => console.log("Data received:", data);
  return <Child sendData={handleDataFromChild} />;
}

// Child
function Child({ sendData }) {
  return <button onClick={() => sendData("Hello Parent!")}>Send Data</button>;
}
```

---

### **Q50: What would be the common mistake of function being called every time the component renders?**

Passing an inline function call with parentheses `()` directly into an event handler prop instead of passing a function reference.

```jsx
// BAD: Invokes handleDelete() immediately on every render!
<button onClick={handleDelete(id)}>Delete</button>

// GOOD: Passes an inline arrow function reference
<button onClick={() => handleDelete(id)}>Delete</button>

```

---

### **Q51 & Q58: What are Error Boundaries in React and functional components?**

An **Error Boundary** is a component that catches JavaScript errors anywhere in its child component tree, logs those errors, and displays a fallback UI instead of crashing the entire application tree.

- **Class implementation:** Must implement `componentDidCatch` or `static getDerivedStateFromError`.
- **Functional Component usage:** Functional components cannot act as Error Boundaries natively; you must use a class component wrapper or community libraries like `react-error-boundary`.

```jsx
import { ErrorBoundary } from "react-error-boundary";

function Fallback({ error }) {
  return <div>Something went wrong: {error.message}</div>;
}

<ErrorBoundary FallbackComponent={Fallback}>
  <MyWidget />
</ErrorBoundary>;
```

---

### **Q52: Why should we not update `state` directly?**

1. Modifying state directly (`state.value = 5`) does not trigger a re-render because React checks object references.
2. It breaks immutability, causing state inconsistencies, broken memoized selectors (`useMemo`, `React.memo`), and unpredictable UI behavior.

---

### **Q54, Q94: Compare `useState` and `useReducer` implementations**

- **`useState`:** Best for simple, independent primitive state values (strings, booleans, numbers).
- **`useReducer`:** Best for complex state objects, nested data, or when the next state depends heavily on the previous state via defined actions.

```jsx
// useReducer Example
const initialState = { count: 0 };
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <button onClick={() => dispatch({ type: "increment" })}>
      {state.count}
    </button>
  );
}
```

---

### **Q56, Q59: What is Automatic Batching in ReactJS?**

**Batching** is when React groups multiple state updates into a single re-render pass for better performance. In **React 18+**, Automatic Batching batches all updates regardless of where they originate (promises, `setTimeout`, native event handlers).

---

### **Q60: What is Components Composition in React?**

Component Composition is the design pattern of building complex UIs by nesting smaller components together using props or the `children` prop, favoring composition over OOP inheritance.

```jsx
function Card({ children }) {
  return <div className="card-wrapper">{children}</div>;
}

// Composition Usage
<Card>
  <h2>Title</h2>
  <p>Body content goes here</p>
</Card>;
```

---

### **Q61: What's wrong with using `Context` in React?**

1. **Performance Bottlenecks:** Every component consuming a Context re-renders whenever any value in the context object changes, regardless of whether that specific component cares about the modified property.
2. **Reduced Reusability:** Hard-codes components to a specific provider parent.

---

### **Q64: What do these three dots (`...`) in React do?**

The ES6 Spread Operator (`...`) is used in React for:

1. **Passing dynamic props cleanly:** `<Child {...props}/>`
2. **Immutable state updates:** `setFormState(prev => ({ ...prev, name: 'Alice' }))`

---

### **Q65: What's the typical flow of data like in a React + Redux app?**

Unidirectional Data Flow:

$$\text{UI Interaction} \xrightarrow{\text{Dispatch}} \text{Action} \xrightarrow{\text{Processes}} \text{Reducer} \xrightarrow{\text{Updates}} \text{Redux Store} \xrightarrow{\text{Triggers Re-render}} \text{React UI}$$

---

### **Q67: What is Lifting State Up in ReactJS?**

Lifting State Up means moving shared state up to the **closest common ancestor component** so that multiple sibling components can access and synchronize that data via props.

---

### **Q68, Q119: What are Pure Components & `React.memo()`?**

- **Pure Component (Class):** Implements a shallow props and state comparison in `shouldComponentUpdate`.
- **`React.memo()` (Functional):** A Higher-Order Component that memoizes a functional component, preventing re-renders if its props have not changed.

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>;
});
```

---

### **Q78, Q80: What is `{this.props.children}` / `children` prop?**

The `children` prop allows components to pass arbitrary JSX elements directly into their output markup, enabling component nesting and slot-like layouts.

---

### **Q81: Why React uses `className` over `class` attribute?**

JSX transfiles directly into standard JavaScript (`React.createElement`). Since `class` is a reserved keyword in JavaScript, React uses `className` to specify HTML CSS classes.

---

### **Q86, Q105: What's the difference between `useCallback`, `useMemo` and `useEffect` in practice?**

- **`useEffect`:** Executes side effects (data fetching, subscriptions, DOM mutations) **after rendering**.
- **`useMemo`:** Memoizes the **result of a calculation** to avoid recalculating on every render:

```javascript
const expensiveValue = useMemo(() => computeHeavyValue(a, b), [a, b]);
```

- **`useCallback`:** Memoizes a **function instance** to prevent re-creating inline callback functions on every render (useful when passing callbacks to `React.memo` child components):

```javascript
const handleClick = useCallback(() => console.log("Clicked"), []);
```

---

### **Q87: Can you do Components Inheritance in React?**

While possible via JavaScript class extension, **React strongly discourages component inheritance**. Facebook recommends using **Composition** and props instead.

---

### **Q96: How would you store non-state/instance variables in functional React components?**

Use the **`useRef()`** hook. Mutating `.current` on a ref object persists data across component renders without triggering a re-render pass.

```jsx
const timerId = useRef(null); // Stores instance reference
```

---

### **Q97: Does React re-render all components and sub components every time `setState` is called?**

React re-renders the component where `setState` was called and recursively re-renders **all of its child components** by default, unless child components are optimized using `React.memo()`, `useMemo()`, or `PureComponent`.

---

### **Q107: How would you go about investigating slow React application rendering?**

1. Use **React Developer Tools Profiler** tab to record render passes and identify components taking long render times or rendering frequently.
2. Use **`why-did-you-render`** library to catch unexpected re-renders.
3. Check for unstable object references, inline function definitions passed down to child components, or missing `key` props.
4. Implement `React.memo`, `useCallback`, and `useMemo` where expensive recalculations occur.

---

### **Q108: Why does React use `SyntheticEvents`?**

A **`SyntheticEvent`** is React's cross-browser wrapper around the browser's native DOM event.

- **Benefits:** Provides a completely consistent event interface across all browsers and operating systems, handling cross-browser quirks under the hood.

---

### **Q113: What is the order of `useInsertionEffect`, `useLayoutEffect`, and `useEffect` hooks at component rendering?**

Execution Order after Render:

1. **`useInsertionEffect`:** Fires **before** any DOM mutations are written (primarily used by CSS-in-JS libraries like Emotion/Styled-Components to inject styles early).
2. **`useLayoutEffect`:** Fires synchronously **after DOM mutations**, but **before the browser paints** the screen (used for measuring DOM dimensions).
3. **`useEffect`:** Fires asynchronously **after the browser has painted** the screen (ideal for data fetching and side effects).

---

### **Q117: How to avoid the need for binding in React?**

1. **Use Functional Components:** Functional components don't use `this`, eliminating binding issues entirely.
2. **Use ES6 Arrow Functions in Class Components:**

```javascript
// Arrow functions automatically bind `this` lexically:
handleClick = () => {
  console.log(this.state);
};
```

---

### **Q118: What is a Pure Function?**

A **Pure Function** is a function that:

1. Always returns the exact same output when given the same inputs.
2. Has **no side effects** (does not mutate external variables, make network calls, or write to local storage).
