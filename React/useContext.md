Here is a curated list of interview questions focused on the **`useContext`** hook, ranging from basic mechanics to advanced performance optimization.

### Junior / Entry-Level

**1. What is `useContext` and what primary problem does it solve?**

* **What they are looking for:** You should explain that `useContext` is a hook used to consume global or shared data across a React component tree. The primary problem it solves is **prop drilling**—the cumbersome process of passing props down through multiple layers of intermediate components that don't actually need the data themselves.

**2. What are the three steps required to implement Context in React?**

* **What they are looking for:** Knowledge of the API surface.

1. **Create:** Use `createContext(defaultValue)` to instantiate the context.
2. **Provide:** Wrap the parent component tree with `<MyContext.Provider value="{data}">`.
3. **Consume:** Call `useContext(MyContext)` inside a child component to read the data.

**3. What happens if a component consumes a context, but there is no Provider above it in the component tree?**

* **What they are looking for:** Understanding of default values. The component will not crash; instead, `useContext` will return the exact `defaultValue` that was passed to `createContext()` when it was initially declared.

---

### Mid-Level

**4. How does `useContext` affect component re-rendering?**

* **What they are looking for:** This is a crucial concept. Whenever the `value` prop of a `<Context.Provider>` changes, **all** components consuming that context via `useContext` will be forced to re-render. However, intermediate components sitting between the Provider and the Consumer *will not* re-render (unless their own props or state changed).

**5. Why is it a best practice to create a custom hook for your context (e.g., `useAuth`) instead of exporting the Context object directly?**

* **What they are looking for:** Encapsulation and developer experience. By creating a custom hook, you hide the implementation details. More importantly, it allows you to add error handling. You can check if the context value is `undefined` (meaning the hook was called outside of its Provider) and throw a descriptive error immediately, rather than failing silently later.

**6. Can a component consume multiple contexts at the same time?**

* **What they are looking for:** Yes. A single component can call `useContext` multiple times with different context objects. (e.g., `const theme = useContext(ThemeContext); const user = useContext(AuthContext);`).

---

### Senior / Advanced Level

**7. What is the "Context Object Reference" problem, and how do you fix it?**

* **What they are looking for:** Deep understanding of React's reconciliation. If you pass an inline object to a provider, like `<Provider logout user, value="{{" }}>`, React creates a brand-new object reference on *every single render* of the parent. This forces every consuming child to re-render, even if the actual data hasn't changed.
* **The Fix:** You must wrap the value in a `useMemo` hook so the object reference remains stable across renders unless the underlying dependencies change.

**8. How can you prevent unnecessary re-renders in a large application heavily relying on Context?**

* **What they are looking for:** Architectural optimization strategies. A senior candidate should mention:

1. **Splitting Contexts:** Don't put everything in one giant "AppState" context. Split them by domain (e.g., `ThemeContext`, `AuthContext`) so a theme change doesn't re-render components that only care about auth.
2. **Splitting State and Dispatch:** Separate the data from the functions that update it into two different contexts (e.g., `TasksContext` and `TasksDispatchContext`). Components that only need to trigger updates can consume the dispatch context without re-rendering when the data changes.

**9. When should you use Context vs. a state management library like Redux or Zustand?**

* **What they are looking for:** Knowing the right tool for the job. Context is technically **Dependency Injection**, not a state manager. It is perfect for low-frequency updates (themes, authentication, user language). For high-frequency updates (typing in a complex form, dragging UI elements, real-time data), Context causes massive render bottlenecks. Redux and Zustand use **selectors** to subscribe components to specific slices of state, preventing unnecessary re-renders in a way native Context cannot.

**`useContext`** is a React Hook that lets you read and subscribe to context from your component. It is the primary solution for bypassing "prop drilling"—the tedious process of passing data down through multiple layers of components that don't actually need it.

Here is a comprehensive guide to its API, usage patterns, and how to troubleshoot common issues.

---

## 1. Reference

### `const value = useContext(SomeContext)`

* **`SomeContext`**: The context object you previously created using `createContext`. The context itself does not hold the information; it only represents the *type* of information you can provide or read from components.

**Returns:**
The hook returns the context value for the calling component. This value is determined by the `value` prop passed to the closest `<SomeContext.Provider>` above the calling component in the tree. If there is no such provider, the returned value will be the `defaultValue` passed to `createContext`.

---

## 2. Usage Scenarios

### Passing data deeply into the tree

Instead of passing props through every intermediate component, you can wrap a parent component in a Provider and read it anywhere underneath.

```jsx
import { createContext, useContext } from 'react';

// 1. Create the context
const ThemeContext = createContext('light');

function App() {
  // 2. Wrap the tree in a Provider and supply a value
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <Button />; // No need to pass 'theme' down!
}

function Button() {
  // 3. Consume the value deep in the tree
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}

```

### Updating data passed via context

Context is not static. If you want the context to change over time, you can pass a piece of React state (and its updater function) into the context value.

```jsx
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <Header />
    </CurrentUserContext.Provider>
  );
}

function Header() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  if (currentUser) {
    return <p>Hello, {currentUser.name}</p>;
  }

  return (
    <button onClick={() => setCurrentUser({ name: 'Jane' })}>
      Log in
    </button>
  );
}

```

### Specifying a fallback default value

When you call `createContext(defaultValue)`, the `defaultValue` is used **only** if the component calling `useContext` does not have a matching Provider above it in the tree. This is useful for testing components in isolation without wrapping them in a Provider.

```jsx
// If no Provider is found, useContext will return 'light'
const ThemeContext = createContext('light'); 

```

### Overriding context for a part of the tree

You can nest Providers to override the context value for a specific part of your component tree. `useContext` always looks for the **closest** Provider above it.

```jsx
<ThemeContext.Provider value="dark">
  <Sidebar /> {/* Reads "dark" */}
  
  <ThemeContext.Provider value="light">
    <Content /> {/* Reads "light" (overrides the parent provider) */}
  </ThemeContext.Provider>
</ThemeContext.Provider>

```

### Optimizing re-renders when passing objects and functions

When the `value` prop of a Provider changes, **every** component consuming that context will re-render. If you pass a new object literal directly into the `value` prop, it creates a new memory reference on every render, causing massive performance issues.

**The Fix:** Wrap the object in `useMemo` and functions in `useCallback`.

```jsx
// ❌ BAD: Creates a new object reference every render
<AuthContext.Provider value={{ user, login }}> 

// ✅ GOOD: Caches the object so the reference stays stable
const contextValue = useMemo(() => {
  return { user, login };
}, [user, login]);

<AuthContext.Provider value={contextValue}>

```

---

## 3. Troubleshooting

### My component doesn’t see the value from my provider

**Cause:** This almost always means the component calling `useContext` is not actually a child of the Provider. `useContext` looks *up* the tree, not at the current component or below it.
**Fix:** Ensure the Provider wraps the parent component, not the component itself.

```jsx
// ❌ BAD: The Provider is in the same component as useContext
function BadComponent() {
  const value = useContext(MyContext); // Will not see "dark"
  return <MyContext.Provider value="dark">...</MyContext.Provider>;
}

// ✅ GOOD: The Provider wraps the component consuming the context
function Parent() {
  return <MyContext.Provider value="dark"><Child /></MyContext.Provider>;
}

```

### I am always getting undefined from my context although the default value is different

**Cause:** If your context is returning `undefined`, it means you *do* have a Provider in the tree, but you forgot to pass the `value` prop to it, or you explicitly passed `value={undefined}`.
React's fallback `defaultValue` (from `createContext`) is **only** used if there is absolutely no Provider in the tree. If a Provider exists but is missing the `value` prop, React treats it as `value={undefined}`.

**Fix:** Ensure your Provider explicitly declares the `value` prop.

```jsx
// ❌ BAD: Missing the 'value' prop. useContext will return undefined.
<ThemeContext.Provider>
  <App />
</ThemeContext.Provider>

// ✅ GOOD: Explicitly providing the value.
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

```
