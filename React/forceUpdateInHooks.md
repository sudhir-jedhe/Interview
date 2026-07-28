In React Hooks, there is **no built-in `forceUpdate()`** like class components had. However, you can force a component to re-render by updating state.

### Method 1: Dummy State Update (Most Common)

```jsx id="y5qrzc"
import { useState } from "react";

function MyComponent() {
  const [, forceRender] = useState(0);

  const handleClick = () => {
    forceRender((prev) => prev + 1);
  };

  return <button onClick={handleClick}>Force Re-render</button>;
}
```

Every time the state changes, React re-renders the component.

---

### Method 2: Using `useReducer`

Many developers prefer this pattern:

```jsx id="3b5ohx"
import { useReducer } from "react";

function MyComponent() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return <button onClick={forceUpdate}>Force Re-render</button>;
}
```

---

### Real-World Scenario

Suppose you're integrating a third-party library that mutates data outside React:

```jsx id="7r1wut"
const [, forceUpdate] = useReducer((x) => x + 1, 0);

const refreshData = () => {
  externalLibrary.updateData();
  forceUpdate();
};
```

This forces React to refresh the UI.

---

### Better Approach

In most cases, if you feel the need to force a re-render, it indicates that some data is not being managed through React state.

Instead of:

```jsx id="9l4m6k"
user.name = "John";
forceUpdate();
```

Prefer:

```jsx id="fufv4m"
setUser({
  ...user,
  name: "John",
});
```

React will automatically re-render when state changes.

---

### Interview Answer

> React Hooks do not provide a `forceUpdate()` API. To force a re-render, you can update a dummy state using `useState` or `useReducer`. However, in production applications, forcing re-renders is usually a code smell. The preferred approach is to keep data in React state and update it through state setters so React can re-render naturally.
