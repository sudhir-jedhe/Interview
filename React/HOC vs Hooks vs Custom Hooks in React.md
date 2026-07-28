### **HOC vs Hooks vs Custom Hooks in React**

In React, there are different patterns and mechanisms for handling reusability and sharing logic across components. **Higher-Order Components (HOCs)**, **Hooks**, and **Custom Hooks** are the three most common approaches. Each has its strengths and weaknesses, and they address different use cases in React development.

Let’s compare **HOCs**, **Hooks**, and **Custom Hooks** to help you understand when to use each of them.

---

### **1. Higher-Order Components (HOCs)**

#### **Definition**:

A **Higher-Order Component (HOC)** is a function that takes a component and returns a new component with additional props or behavior. HOCs are a pattern in React that helps in code reuse by adding logic or state to components without modifying the original component.

#### **Characteristics**:

- **Function** that takes a component as an argument and returns a new component with extra functionality.
- Commonly used for **cross-cutting concerns** like authentication, data fetching, logging, or theme management.
- Used in class components (though it works fine with functional components too).

#### **Pros**:

- **Reusability**: Can easily reuse logic across multiple components.
- **Code Splitting**: Can be used for lazy loading and wrapping components with error boundaries or suspense.
- **Separation of Concerns**: Encapsulates logic (like data fetching or authentication) separate from the UI component.

#### **Cons**:

- **Wrapper Hell**: Overusing HOCs can lead to a deep nesting of components, making the component tree harder to manage.
- **Props Manipulation**: Can lead to prop conflicts as HOCs inject props into the wrapped component.
- **Difficult to Debug**: The added layers can make debugging difficult, as you need to trace through multiple layers of wrapping.

#### **Example: `withAuth` HOC**

```javascript
import React from "react";

// Higher-Order Component for authentication
const withAuth = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const isAuthenticated = localStorage.getItem("auth_token");
      if (!isAuthenticated) {
        return <div>Please log in to view this content.</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Wrapped component
const Dashboard = () => {
  return <div>Welcome to your Dashboard!</div>;
};

// Wrap the component
const ProtectedDashboard = withAuth(Dashboard);

export default ProtectedDashboard;
```

---

### **2. Hooks (useState, useEffect, etc.)**

#### **Definition**:

**Hooks** are functions introduced in React 16.8 that allow you to use **state**, **side effects**, **context**, and other React features in functional components. They replace the need for class components for most cases.

#### **Characteristics**:

- **Built-in Functions**: React provides a set of hooks like `useState`, `useEffect`, `useContext`, `useReducer`, etc.
- **Used in Functional Components**: Hooks are the primary way to manage state and side effects in functional components.
- **Declarative**: Hooks allow you to manage state and side effects in a more declarative manner within the component itself.

#### **Pros**:

- **Simpler**: Functional components with hooks are simpler and cleaner than class components.
- **No Wrapper Hell**: Unlike HOCs, hooks don’t require wrapping components, making the code more readable and maintainable.
- **State and Effects in One Place**: Hooks let you manage component state and lifecycle methods in the same place, making it easier to reason about.

#### **Cons**:

- **Limited to Functional Components**: Hooks can only be used inside functional components.
- **Hard to Manage Complex Logic**: Complex side effects can sometimes result in messy code, although custom hooks can help organize this.
- **Learning Curve**: New developers might find hooks challenging at first due to their functional nature and the concept of closures.

#### **Example: `useState` and `useEffect` Hook**

```javascript
import React, { useState, useEffect } from "react";

const FetchDataComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []); // Empty array means this effect runs only once (like componentDidMount)

  if (loading) return <div>Loading...</div>;
  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default FetchDataComponent;
```

---

### **3. Custom Hooks**

#### **Definition**:

A **Custom Hook** is a JavaScript function that starts with `use` and allows you to reuse **stateful logic** across different components. It’s a way to extract reusable logic that you would otherwise include directly in your components using hooks.

#### **Characteristics**:

- **Encapsulates Logic**: Custom hooks allow you to abstract logic from your components in a reusable way.
- **Reusability**: Custom hooks are functions that can be shared across different components.
- **Stateful and Effectful**: Custom hooks can use other hooks like `useState`, `useEffect`, etc., to manage state and side effects.

#### **Pros**:

- **Logic Reusability**: Custom hooks allow you to share logic in a way that avoids duplication.
- **Organized Code**: They help keep components focused on UI rendering while extracting side effects, state management, and other logic into reusable functions.
- **Avoids Wrapper Hell**: Unlike HOCs, custom hooks don't require wrapping components, thus keeping the component tree flat.

#### **Cons**:

- **Not a Substitute for Components**: Custom hooks can only share logic, not UI. They are not an alternative to components themselves.
- **State Management**: If not carefully written, custom hooks can make state management harder to understand, especially for large apps with many hooks.

#### **Example: `useFetch` Custom Hook**

```javascript
import { useState, useEffect } from "react";

// Custom Hook for data fetching
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
};

// Component using the custom hook
const UserList = () => {
  const { data, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users",
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default UserList;
```

---

### **Comparison Table**

| Feature                | **Higher-Order Component (HOC)**                    | **Hooks**                                                     | **Custom Hooks**                                                    |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Type**               | Function that wraps a component                     | Function used in functional components                        | Custom function that uses built-in hooks                            |
| **Usage**              | Add cross-cutting logic (e.g., authentication)      | Manage state, effects, context, etc.                          | Share reusable logic across components                              |
| **State Management**   | Through props, state is injected                    | Directly inside components via `useState`, `useReducer`, etc. | Internal state management, shared logic                             |
| **Code Reusability**   | High (for cross-cutting concerns)                   | Moderate (reusable across components but not shared logic)    | Very high (logic can be reused in multiple places)                  |
| **Complexity**         | Can create "wrapper hell" with many HOCs            | Simple but can be complex with large codebases                | Simple, but custom hooks can become complex if not well-structured  |
| **Performance Impact** | May cause unnecessary renders if not used carefully | Minimal performance impact                                    | Minimal, but excessive use of custom hooks could introduce overhead |
| **Component Tree**     | Can lead to deep nested components                  | Flat and easier to maintain                                   | Flat and maintainable                                               |

---

### **When to Use Each?**

- **HOCs**:
  - When you need to **add cross-cutting logic** (authentication, theming, error boundaries, etc.) across multiple components without modifying them.
  - When you need to **inject additional props** into components or manipulate them.
- **Hooks**:
  - When working with **functional components** and you need to manage **state**, **side effects**, or **context** in a declarative manner.
  - Use **built-in hooks** like `useState`, `useEffect`, `useReducer`, etc., to handle common stateful logic directly within components.

- **Custom Hooks**:
  - When you need to **extract reusable logic** (e.g., data fetching, form handling, subscriptions) that you want to share between
