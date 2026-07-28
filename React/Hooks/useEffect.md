### What is `useEffect` in React?

`useEffect` is a **React Hook** that allows you to perform side effects in your functional components. Side effects are operations that can affect other parts of the application or the outside world, such as:

- Fetching data from an API
- Setting up subscriptions (e.g., WebSockets or Event listeners)
- Manually changing the DOM (e.g., using third-party libraries)
- Setting timers (e.g., `setTimeout` or `setInterval`)

In class components, similar effects are handled using lifecycle methods like `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. With `useEffect`, you can manage all these side effects in functional components.

### Basic Syntax of `useEffect`

```jsx
useEffect(() => {
  // Side effect logic goes here

  return () => {
    // Clean-up logic (optional)
  };
}, [dependencies]);
```

- The first argument is the **effect function** where you perform side-effect logic.
- The second argument is an **array of dependencies**. If this array is not empty, the effect will run whenever any of the dependencies change.
- The optional **clean-up function** allows you to clean up the side effect, such as unsubscribing from an event or clearing timers.

### When to Use `useEffect`?

1. **Fetching Data**:
   If you need to fetch data from an API or a database when a component mounts, `useEffect` is ideal.

   Example:

   ```jsx
   useEffect(() => {
     const fetchData = async () => {
       const response = await fetch("https://api.example.com/data");
       const data = await response.json();
       setData(data);
     };
     fetchData();
   }, []); // Empty dependency array means it runs once when the component mounts
   ```

2. **Updating the DOM**:
   If you need to manipulate the DOM after the render (e.g., focusing an input field), you can use `useEffect`.

   Example:

   ```jsx
   useEffect(() => {
     document.title = `You clicked ${count} times`;
   }, [count]); // Runs after every render when 'count' changes
   ```

3. **Event Listeners or Subscriptions**:
   When you need to set up event listeners (like window resize, key presses, or other external events), `useEffect` can handle these and clean up afterward.

   Example:

   ```jsx
   useEffect(() => {
     const handleResize = () => {
       console.log("Window resized");
     };
     window.addEventListener("resize", handleResize);

     return () => {
       window.removeEventListener("resize", handleResize); // Clean-up
     };
   }, []); // Runs once on mount and cleans up on unmount
   ```

4. **Timers (e.g., `setTimeout`, `setInterval`)**:
   For setting up timers like `setTimeout` or `setInterval`, `useEffect` is useful to clear them when the component unmounts or when dependencies change.

   Example:

   ```jsx
   useEffect(() => {
     const timer = setTimeout(() => {
       console.log("This will run after 3 seconds");
     }, 3000);

     return () => clearTimeout(timer); // Clean-up the timer
   }, []); // Runs once when the component mounts
   ```

5. **Form Validation or Side Effects on Input Change**:
   You may need to perform validation or call an API when an input field changes. This is also a good use case for `useEffect`.

   Example:

   ```jsx
   useEffect(() => {
     if (email) {
       // Perform email validation or API call
       console.log("Validating email:", email);
     }
   }, [email]); // Runs every time 'email' changes
   ```

### Dependency Array in `useEffect`

The second argument to `useEffect` (the **dependency array**) controls when the effect should be triggered:

- **Empty Array (`[]`)**: The effect will run only once when the component mounts (similar to `componentDidMount`).
- **No Dependency Array**: The effect will run after every render (like `componentDidUpdate`).
- **With Dependencies (`[dep1, dep2, ...]`)**: The effect will run when any of the dependencies change. If the dependencies are unchanged between renders, React skips the effect.

### Example with Dependency Array:

```jsx
import React, { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  // This effect runs whenever 'count' changes
  useEffect(() => {
    console.log(`You clicked ${count} times`);

    // Optionally return a clean-up function
    return () => {
      console.log("Cleanup on count change");
    };
  }, [count]); // Effect depends on 'count'

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### Clean-up Function

If your effect involves side effects like event listeners, subscriptions, or timers, you should clean up the effect to prevent memory leaks. This is done by returning a function inside `useEffect`.

Example:

```jsx
useEffect(() => {
  const intervalId = setInterval(() => {
    console.log("Interval running...");
  }, 1000);

  // Cleanup function to clear the interval when the component unmounts
  return () => {
    clearInterval(intervalId);
    console.log("Interval cleared");
  };
}, []); // The effect runs once, and the interval is cleaned up on unmount
```

### Common Use Cases of `useEffect`:

- **Fetching data** from APIs or databases on mount or on dependency change.
- **Setting up subscriptions or event listeners** (e.g., listening to window resizing, mouse movement).
- **Modifying the DOM** after a render (e.g., focusing an element, setting document titles).
- **Running side effects** like animations or logging.
- **Cleaning up resources** (e.g., clearing timers, removing event listeners).

### Summary

- `useEffect` is a powerful hook used for handling side effects in functional React components.
- It runs after the component renders and can be configured to run on component mount, unmount, or whenever certain dependencies change.
- It is ideal for data fetching, event handling, timers, subscriptions, and cleanup tasks.
