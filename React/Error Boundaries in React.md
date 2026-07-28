### **Error Boundaries in React**

In React, an **Error Boundary** is a component that allows you to handle JavaScript errors anywhere in a component tree, log those errors, and display a fallback UI instead of crashing the entire application. This feature helps prevent your entire React app from breaking when an error occurs, improving the user experience by providing graceful error handling.

#### **Key Points about Error Boundaries:**

- **Error Boundaries** catch runtime JavaScript errors in their **child components**.
- They can **log the error** to an external service (e.g., Sentry, LogRocket) for further debugging.
- They can **display a fallback UI** to the user while the error is being handled.
- Error Boundaries only catch errors in **render**, **lifecycle methods**, and **constructor**. They do not catch errors inside **event handlers**, **asynchronous code (e.g., `setTimeout` or `fetch`)**, or **server-side rendering** (SSR).

---

### **How Error Boundaries Work**

To implement an error boundary, you create a class component that implements the following lifecycle methods:

1. **`static getDerivedStateFromError(error)`**: This method allows you to update the state based on the error, so you can display an error UI.
2. **`componentDidCatch(error, info)`**: This method is called after an error is thrown. It allows you to log error details or report the error to an external service.

Here's an example of how to create an **Error Boundary** component:

---

### **Creating an Error Boundary in React**

#### **Step 1: Create the Error Boundary Component**

```js
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  // This lifecycle method is called when an error is thrown in a child component
  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true, error };
  }

  // This lifecycle method is called with the error and the error info
  componentDidCatch(error, info) {
    // Log error information or send it to an external service
    console.error("Error caught by ErrorBoundary: ", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{this.state.error ? this.state.error.toString() : null}</p>
        </div>
      );
    }

    // Render the children components if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### **Explanation:**

- **`getDerivedStateFromError`**: This method updates the state to indicate an error has occurred. It returns an object that contains `hasError: true`, which can be used to conditionally render the fallback UI.
- **`componentDidCatch`**: This method is called after an error is caught. It receives two arguments: `error` (the error thrown) and `info` (an object with the component stack trace). You can use this to log the error, send it to an external service, or perform other actions.

---

### **Step 2: Using the Error Boundary in Your Application**

To use the error boundary, you can wrap your components with it:

```js
import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import MyComponent from "./MyComponent";

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}

export default App;
```

In this example:

- If any error occurs in the `MyComponent` component (or any of its children), it will be caught by the `ErrorBoundary`, and the fallback UI will be displayed.

---

### **Handling Errors in Specific Parts of the App**

If you want to handle errors in specific parts of the app (instead of wrapping the entire app in a single error boundary), you can wrap individual components or sections:

```js
import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import ComponentA from "./ComponentA";
import ComponentB from "./ComponentB";

function App() {
  return (
    <div>
      <ErrorBoundary>
        <ComponentA />
      </ErrorBoundary>
      <ErrorBoundary>
        <ComponentB />
      </ErrorBoundary>
    </div>
  );
}

export default App;
```

Here:

- Errors in `ComponentA` will be caught by its own error boundary, while errors in `ComponentB` will be handled by a separate error boundary.

---

### **Best Practices for Using Error Boundaries**

1. **Use Multiple Boundaries**: It’s a good practice to place error boundaries at different levels of your component tree. For example, you can wrap small sections or isolated features of the app with individual error boundaries to prevent errors in one part of the app from affecting the entire app.

2. **Display Meaningful Fallback UI**: The fallback UI should inform the user that something went wrong while providing a way to recover or try again. For example, you could include a button that reloads the component or allows the user to navigate to a safe area of the app.

3. **Log Errors**: Use `componentDidCatch` to log errors to an external service like Sentry, LogRocket, or even a custom logging system. This is helpful for tracking errors in production and getting detailed error reports.

4. **Don’t Overuse Error Boundaries**: Error boundaries should be used for catching exceptions that occur during rendering or lifecycle methods. They aren’t a replacement for handling errors in asynchronous code (like promises or API calls). For asynchronous error handling, use `try-catch` in combination with promises or async functions.

5. **Graceful Degradation**: When an error is caught, consider showing users a fallback UI that doesn’t break their experience. For example, show a generic error message with an option to retry or go back to the previous page.

---

### **Common Use Cases for Error Boundaries**

1. **Third-party components**: If you’re using third-party components that may throw errors, wrap them in error boundaries to prevent them from crashing your entire app.

2. **Complex parts of your app**: For example, if you have a complex component that performs a lot of logic (like a dynamic form or dashboard), wrap it in an error boundary to ensure other parts of your app continue to work even if this part fails.

3. **External APIs**: When interacting with external APIs, network requests may fail. Though error boundaries don't catch errors from `fetch` or async functions directly, you can handle errors locally within those components and wrap them in error boundaries.

---

### **Limitations of Error Boundaries**

- **Does not catch errors in event handlers**: Error boundaries do not catch errors thrown inside event handlers. For example, if an error occurs inside a button click handler, you will need to use a `try-catch` block to handle it.

  Example:

  ```js
  const handleClick = () => {
    try {
      // Some code that might throw an error
    } catch (error) {
      console.error("Error during click handler:", error);
    }
  };
  ```

- **Does not catch errors in asynchronous code**: Error boundaries also do not catch errors thrown in asynchronous code like `setTimeout`, `fetch`, or promises. You must handle such errors manually with `try-catch` or `.catch` in promises.

- **Does not catch errors during server-side rendering (SSR)**: Error boundaries do not catch errors that occur during SSR (e.g., in Next.js or Gatsby). You will need to implement a different error handling strategy for SSR.

---

### **Conclusion**

Error boundaries are a powerful feature in React for catching errors in your app’s component tree and preventing the entire app from crashing. They provide a way to show fallback UI and log errors to an external service for better error tracking and debugging.

To use error boundaries:

- Create a class component with `getDerivedStateFromError` and `componentDidCatch` methods.
- Wrap components or sections of your app with the error boundary to gracefully handle errors.

By using error boundaries effectively, you can ensure your React app is more resilient and user-friendly, even when errors occur.

Here’s a table summarizing the key differences between **`React.memo()`**, **`useMemo()`**, and **`useCallback()`** in React:

| Feature                   | `React.memo()`                                                       | `useMemo()`                                                                          | `useCallback()`                                                                                                          |
| ------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Type of Component**     | Works with **function components**                                   | Works inside **function components**                                                 | Works inside **function components**                                                                                     |
| **Purpose**               | Memoizes a function component to avoid unnecessary re-renders        | Memoizes the result of an expensive computation                                      | Memoizes a callback function to avoid unnecessary re-creations                                                           |
| **Use Case**              | Prevents re-rendering of function components when props don’t change | Optimizes expensive computations by recalculating them only when dependencies change | Prevents the re-creation of a function on each render, useful when passing functions as props                            |
| **When to Use**           | When you want to prevent unnecessary re-renders of a component       | When performing an expensive computation or transformation                           | When passing a function as a prop to memoized child components or handling callbacks that depend on specific state/props |
| **How It Works**          | Memoizes the component’s rendered output                             | Memoizes a computed value (e.g., calculation or transformation)                      | Memoizes a function itself to ensure it isn’t re-created unless dependencies change                                      |
| **Dependencies**          | No direct dependency tracking, based on props change                 | Requires dependencies array to track changes and re-compute value                    | Requires dependencies array to track changes in state or props used in the function                                      |
| **Recalculation Trigger** | Re-renders only if props change                                      | Recalculates only if dependencies change                                             | Recreates the function only if dependencies change                                                                       |
| **Example**               | `const MemoizedComponent = React.memo(MyComponent);`                 | `const expensiveValue = useMemo(() => calculateExpensiveValue(), [dependency]);`     | `const memoizedCallback = useCallback(() => { /* logic */ }, [dependency]);`                                             |

---

### Key Points:

- **`React.memo()`**: Primarily used for optimizing re-renders of function components based on props.
- **`useMemo()`**: Memoizes a **value** (or result of a computation), useful for expensive operations.
- **`useCallback()`**: Memoizes a **function**, especially useful when passing functions as props to child components or in cases where the function’s identity matters.

### **Error Boundaries in React**

An **Error Boundary** is a React component that catches JavaScript errors in its child components and prevents them from crashing the entire application. Error boundaries provide a way to gracefully handle runtime errors by rendering a fallback UI instead of the component tree that caused the error.

React only supports error boundaries in **class components** directly. However, you can create an equivalent functionality using **Error Boundary Hooks** in functional components by using `ErrorBoundary` from a third-party library like **React Error Boundary** or by using a combination of `componentDidCatch` in class components and `useState`/`useEffect` in functional components.

---

### **1. Error Boundary in Class Component**

In a **class component**, you can create an error boundary by implementing the `componentDidCatch` lifecycle method.

#### **Example: Error Boundary in Class Component**

```javascript
import React from "react";

// Error Boundary Component in Class
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  // This lifecycle method is called when an error is thrown
  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  // This method is called after an error has been caught
  componentDidCatch(error, errorInfo) {
    // Log the error or send it to an external service
    console.error("Error caught in boundary:", error);
    console.error("Error Info:", errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong!</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children; // Render the children if no error
  }
}

// A component that throws an error for demonstration
const BrokenComponent = () => {
  throw new Error("This is a deliberate error!");
  return <div>This will never be rendered.</div>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrokenComponent />
    </ErrorBoundary>
  );
};

export default App;
```

**Explanation**:

- The `ErrorBoundary` class component has two main methods: `getDerivedStateFromError` (which sets the state to indicate an error has occurred) and `componentDidCatch` (which logs the error or sends it to an external service).
- In case of an error, the fallback UI is rendered with the error message and component stack trace.
- If there is no error, the child components (like `BrokenComponent`) are rendered as usual.

---

### **2. Error Boundary in Functional Component (using Hooks)**

React does not support error boundaries directly in functional components, but you can implement them by using hooks. One popular way is to use a third-party library like **React Error Boundary**.

Alternatively, you can combine **`useState`**, **`useEffect`**, and **`try-catch`** blocks to achieve a similar effect.

#### **Example: Error Boundary in Functional Component (using `useState` and `useEffect`)**

```javascript
import React, { useState, useEffect } from "react";

// Error Boundary using React Hooks
const useErrorBoundary = () => {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  const resetErrorBoundary = () => {
    setHasError(false);
    setErrorInfo(null);
  };

  const catchError = (error, errorInfo) => {
    setHasError(true);
    setErrorInfo(errorInfo);
    console.error("Error caught in boundary:", error);
  };

  return {
    hasError,
    errorInfo,
    catchError,
    resetErrorBoundary,
  };
};

// Functional component to demonstrate error boundary
const ErrorBoundaryFunctional = ({ children }) => {
  const { hasError, errorInfo, catchError, resetErrorBoundary } =
    useErrorBoundary();

  if (hasError) {
    return (
      <div>
        <h1>Something went wrong!</h1>
        <details style={{ whiteSpace: "pre-wrap" }}>
          {errorInfo && errorInfo.componentStack}
        </details>
        <button onClick={resetErrorBoundary}>Try Again</button>
      </div>
    );
  }

  return children;
};

// A component that throws an error for demonstration
const BrokenComponent = () => {
  throw new Error("This is a deliberate error!");
  return <div>Nothing to see here.</div>;
};

const App = () => {
  return (
    <ErrorBoundaryFunctional>
      <BrokenComponent />
    </ErrorBoundaryFunctional>
  );
};

export default App;
```

**Explanation**:

- We use `useState` and `useEffect` hooks inside a custom hook (`useErrorBoundary`) to manage the error state and provide a method to catch errors.
- The `ErrorBoundaryFunctional` component is a wrapper that checks for errors and renders fallback UI if an error occurs.
- If an error happens, the `catchError` function is invoked, and a fallback UI is shown with an option to "Try Again" (which resets the error state).

---

### **3. Using Third-Party Libraries for Error Boundaries in Functional Components**

Another approach is to use third-party libraries like **`react-error-boundary`** to simplify error handling in functional components. This library provides a more declarative and reusable API for error boundaries.

#### **Example: Using `react-error-boundary` Library**

1. First, install the library:

```bash
npm install react-error-boundary
```

2. Use the library in your components:

```javascript
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

// A component that throws an error for demonstration
const BrokenComponent = () => {
  throw new Error("This is a deliberate error!");
  return <div>Nothing to see here.</div>;
};

// Error Fallback UI
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div>
    <h1>Something went wrong: {error.message}</h1>
    <button onClick={resetErrorBoundary}>Try Again</button>
  </div>
);

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <BrokenComponent />
  </ErrorBoundary>
);

export default App;
```

**Explanation**:

- The `react-error-boundary` library provides a declarative way to handle errors in functional components.
- The `ErrorBoundary` component accepts a `FallbackComponent` prop that defines how to render fallback UI when an error occurs.
- If an error is caught, the fallback UI is rendered, and you can use the `resetErrorBoundary` function to reset the error state.

---

### **When to Use Error Boundaries?**

- **Class Components**: Use class-based error boundaries when working with legacy codebases or when you need to catch errors in the component tree.
- **Functional Components**: While React does not support native error boundaries in functional components, you can use **third-party libraries** or create your own error boundary using `useState` and `useEffect` hooks for a more flexible solution.
- **Error Handling in UI**: They are useful when you need to prevent the entire application from crashing due to an error in a child component and display a fallback UI instead.

---

### **Conclusion**

- **Class Components**: React provides native error boundary support via `componentDidCatch` and `getDerivedStateFromError` lifecycle methods in class components.
- **Functional Components**: While React does not natively support error boundaries for functional components, you can use third-party libraries like **`react-error-boundary`** or create custom solutions using hooks (`useState`, `useEffect`, etc.).
