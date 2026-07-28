### **Higher-Order Components (HOCs) in React**

A **Higher-Order Component (HOC)** is a pattern in React used to enhance or modify the functionality of a component by **wrapping** it inside another component. The main purpose of HOCs is to share logic between components in a reusable and composable manner.

An HOC is a function that takes a component as an argument and returns a new component with additional props or behavior.

#### **Key Characteristics of HOCs:**

- They don’t modify the original component, but return a new component with added functionality.
- HOCs are commonly used for cross-cutting concerns like authentication, logging, data fetching, or injecting additional state into components.
- HOCs are used to **reusable logic** across different components, thus promoting code reuse.

#### **Basic Syntax:**

```javascript
const MyHOC = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      // Add any additional logic or behavior here
      return <WrappedComponent {...this.props} />;
    }
  };
};
```

Here are some **examples** of how HOCs can be used in a React application.

---

### **1. Simple HOC Example: Logging Props**

Let's start with a simple HOC that logs the props passed to the wrapped component.

#### **Example: `withLogging` HOC**

```javascript
import React from "react";

// Higher-Order Component to log props
const withLogging = (WrappedComponent) => {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log("Previous Props:", prevProps);
      console.log("Current Props:", this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Regular component
const MyComponent = (props) => {
  return <div>{props.message}</div>;
};

// Wrap the component with the HOC
const MyComponentWithLogging = withLogging(MyComponent);

export default MyComponentWithLogging;
```

#### **Usage:**

```javascript
<MyComponentWithLogging message="Hello, World!" />
```

**Explanation:**

- `withLogging` logs the previous and current props whenever the component receives new props.
- `MyComponent` is wrapped by `withLogging` to add logging functionality.

---

### **2. HOC for Authentication (`withAuth`)**

A more practical use case is creating a Higher-Order Component for authentication. The HOC can check whether a user is authenticated and render a protected component accordingly.

#### **Example: `withAuth` HOC**

```javascript
import React from "react";

// Higher-Order Component for checking authentication
const withAuth = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const isAuthenticated = localStorage.getItem("auth_token");
      if (!isAuthenticated) {
        return <div>Please log in to view this content</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Protected Component
const Dashboard = () => {
  return <div>Welcome to your Dashboard!</div>;
};

// Wrap Dashboard component with withAuth
const DashboardWithAuth = withAuth(Dashboard);

export default DashboardWithAuth;
```

#### **Usage:**

```javascript
<DashboardWithAuth />
```

**Explanation:**

- `withAuth` checks whether a user is authenticated by checking if the `auth_token` exists in `localStorage`.
- If the user is not authenticated, it shows a message asking them to log in. Otherwise, it renders the wrapped `Dashboard` component.

---

### **3. HOC for Data Fetching (`withDataFetching`)**

Another common use case is for fetching data from an API. You can create an HOC that handles data fetching logic and injects the fetched data as props into the wrapped component.

#### **Example: `withDataFetching` HOC**

```javascript
import React from "react";

// Higher-Order Component for data fetching
const withDataFetching = (WrappedComponent, dataSource) => {
  return class extends React.Component {
    state = {
      data: null,
      loading: true,
      error: null,
    };

    async componentDidMount() {
      try {
        const response = await fetch(dataSource);
        const data = await response.json();
        this.setState({ data, loading: false });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }

    render() {
      const { data, loading, error } = this.state;

      if (loading) {
        return <div>Loading...</div>;
      }

      if (error) {
        return <div>Error: {error.message}</div>;
      }

      return <WrappedComponent {...this.props} data={data} />;
    }
  };
};

// Component that uses fetched data
const UserList = ({ data }) => {
  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// Wrap UserList component with HOC for data fetching
const UserListWithData = withDataFetching(
  UserList,
  "https://jsonplaceholder.typicode.com/users",
);

export default UserListWithData;
```

#### **Usage:**

```javascript
<UserListWithData />
```

**Explanation:**

- `withDataFetching` handles the logic for fetching data from an API (`dataSource`).
- The `UserList` component is wrapped by the HOC to receive fetched data via props.

---

### **4. HOC for State Management (`withState`)**

HOCs can also be used to inject state management logic into components, similar to how you might use `useState` or `useReducer` directly in a functional component.

#### **Example: `withState` HOC**

```javascript
import React from "react";

// Higher-Order Component to add local state
const withState = (WrappedComponent, initialState) => {
  return class extends React.Component {
    state = initialState;

    setStateValue = (key, value) => {
      this.setState({ [key]: value });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          state={this.state}
          setStateValue={this.setStateValue}
        />
      );
    }
  };
};

// Component using the injected state and setState function
const Counter = ({ state, setStateValue }) => {
  return (
    <div>
      <h1>Counter: {state.count}</h1>
      <button onClick={() => setStateValue("count", state.count + 1)}>
        Increment
      </button>
    </div>
  );
};

// Wrap Counter component with HOC for state management
const CounterWithState = withState(Counter, { count: 0 });

export default CounterWithState;
```

#### **Usage:**

```javascript
<CounterWithState />
```

**Explanation:**

- `withState` HOC manages local state for the wrapped component (`Counter` in this case).
- The `Counter` component receives the state and a `setStateValue` function via props, which allows it to update the `count` state.

---

### **5. HOC for Conditional Rendering (`withConditionalRendering`)**

You can use an HOC to conditionally render different UI elements based on certain conditions, like showing a loading spinner, error message, or the actual content.

#### **Example: `withConditionalRendering` HOC**

```javascript
import React from "react";

// Higher-Order Component for conditional rendering
const withConditionalRendering = (WrappedComponent, condition) => {
  return class extends React.Component {
    render() {
      if (condition) {
        return <div>Loading...</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Regular component
const Content = () => {
  return <div>Content has been loaded!</div>;
};

// Wrap Content component with the HOC
const ContentWithLoading = withConditionalRendering(Content, true); // condition is true for loading state

export default ContentWithLoading;
```

#### **Usage:**

```javascript
<ContentWithLoading />
```

**Explanation:**

- `withConditionalRendering` takes a `condition` and shows a loading message or the wrapped component (`Content`) based on that condition.

---

### **Conclusion**

Higher-Order Components (HOCs) are an essential pattern in React for code reuse and abstraction. They allow you to enhance components with additional behavior, such as logging, authentication, data fetching, state management, and conditional rendering. Some key takeaways:

- **Code reuse**: HOCs allow you to reuse logic across multiple components.
- **Composability**: Multiple HOCs can be composed together to add multiple behaviors to a component.
- **Avoiding code duplication**: Common logic can be abstracted into HOCs and shared across components.

HOCs are a powerful tool in React, especially when building complex applications with common behaviors that need to be shared between different components.

Sure! Here's a complete example of how **Higher-Order Components (HOCs)** work in React, with multiple real-world examples that you can try in your React project.

---

### **1. Logging Props with an HOC**

This HOC logs the props passed to the component whenever it re-renders.

#### **Example: `withLogging` HOC**

```javascript
import React from "react";

// Higher-Order Component that logs props
const withLogging = (WrappedComponent) => {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log("Previous Props:", prevProps);
      console.log("Current Props:", this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

// A simple component
const MyComponent = ({ message }) => {
  return <div>{message}</div>;
};

// Wrap MyComponent with the withLogging HOC
const MyComponentWithLogging = withLogging(MyComponent);

export default MyComponentWithLogging;
```

#### **Usage:**

```javascript
<MyComponentWithLogging message="Hello, world!" />
```

**Explanation**:

- `withLogging` is a Higher-Order Component that wraps `MyComponent`.
- Whenever `MyComponent` receives new props, it logs the previous and current props to the console.

---

### **2. Authentication HOC (`withAuth`)**

This HOC checks if the user is authenticated and either allows access to a protected component or redirects the user to the login page.

#### **Example: `withAuth` HOC**

```javascript
import React from "react";

// Higher-Order Component for authentication
const withAuth = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const isAuthenticated = localStorage.getItem("auth_token");

      // If not authenticated, show login prompt
      if (!isAuthenticated) {
        return <div>Please log in to view this content.</div>;
      }

      // If authenticated, render the wrapped component
      return <WrappedComponent {...this.props} />;
    }
  };
};

// A protected component
const Dashboard = () => {
  return <div>Welcome to your Dashboard!</div>;
};

// Wrap the Dashboard component with the authentication HOC
const ProtectedDashboard = withAuth(Dashboard);

export default ProtectedDashboard;
```

#### **Usage:**

```javascript
<ProtectedDashboard />
```

**Explanation**:

- `withAuth` checks if a user is authenticated by checking for an `auth_token` in `localStorage`.
- If not authenticated, it displays a message prompting the user to log in. If authenticated, it renders the `Dashboard` component.

---

### **3. Data Fetching HOC (`withDataFetching`)**

This HOC handles data fetching and passes the fetched data as props to the wrapped component.

#### **Example: `withDataFetching` HOC**

```javascript
import React from "react";

// Higher-Order Component for data fetching
const withDataFetching = (WrappedComponent, dataSource) => {
  return class extends React.Component {
    state = {
      data: null,
      loading: true,
      error: null,
    };

    async componentDidMount() {
      try {
        const response = await fetch(dataSource);
        const data = await response.json();
        this.setState({ data, loading: false });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }

    render() {
      const { data, loading, error } = this.state;

      if (loading) {
        return <div>Loading...</div>;
      }

      if (error) {
        return <div>Error: {error.message}</div>;
      }

      return <WrappedComponent {...this.props} data={data} />;
    }
  };
};

// A component that uses fetched data
const UserList = ({ data }) => {
  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// Wrap UserList with data fetching HOC
const UserListWithData = withDataFetching(
  UserList,
  "https://jsonplaceholder.typicode.com/users",
);

export default UserListWithData;
```

#### **Usage:**

```javascript
<UserListWithData />
```

**Explanation**:

- `withDataFetching` is an HOC that fetches data from an API (in this case, a list of users) and passes the fetched data to the `UserList` component.
- The `UserList` component renders the list of user names once the data is successfully fetched.

---

### **4. State Management HOC (`withState`)**

This HOC injects local state management into a wrapped component.

#### **Example: `withState` HOC**

```javascript
import React from "react";

// Higher-Order Component to manage state
const withState = (WrappedComponent, initialState) => {
  return class extends React.Component {
    state = initialState;

    setStateValue = (key, value) => {
      this.setState({ [key]: value });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          state={this.state}
          setStateValue={this.setStateValue}
        />
      );
    }
  };
};

// A counter component
const Counter = ({ state, setStateValue }) => {
  return (
    <div>
      <h1>Counter: {state.count}</h1>
      <button onClick={() => setStateValue("count", state.count + 1)}>
        Increment
      </button>
    </div>
  );
};

// Wrap Counter with state management
const CounterWithState = withState(Counter, { count: 0 });

export default CounterWithState;
```

#### **Usage:**

```javascript
<CounterWithState />
```

**Explanation**:

- `withState` is an HOC that manages the local state (`count`) for the wrapped component (`Counter`).
- The `Counter` component receives the state and a `setStateValue` function via props to update the state.

---

### **5. Conditional Rendering HOC (`withConditionalRendering`)**

This HOC conditionally renders either a loading spinner or the wrapped component based on a condition.

#### **Example: `withConditionalRendering` HOC**

```javascript
import React from "react";

// Higher-Order Component for conditional rendering
const withConditionalRendering = (WrappedComponent, condition) => {
  return class extends React.Component {
    render() {
      if (condition) {
        return <div>Loading...</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Regular component
const Content = () => {
  return <div>Content has been loaded!</div>;
};

// Wrap Content with the HOC
const ContentWithLoading = withConditionalRendering(Content, true); // condition is true for loading state

export default ContentWithLoading;
```

#### **Usage:**

```javascript
<ContentWithLoading />
```

**Explanation**:

- `withConditionalRendering` checks a `condition` and displays a loading message if `condition` is true, otherwise it renders the wrapped `Content` component.

---

### **Key Takeaways:**

- **Code Reusability**: HOCs allow you to share common logic and behaviors across components without modifying the components themselves.
- **Composable**: You can combine multiple HOCs to enhance components with multiple functionalities.
- **Abstraction**: HOCs allow you to abstract out complex logic such as data fetching, authentication, or state management, making your components cleaner and more focused on rendering UI.

These examples show how HOCs can be used to wrap your components with additional functionality in a reusable and composable manner. You can modify the logic in each HOC as per your needs to handle different concerns in your application.

### Higher-Order Components (HOCs) in React

A **Higher-Order Component (HOC)** is a function that takes a component and returns a new component with enhanced functionality or additional props. HOCs are used to **reuse component logic** and can be applied to components to add functionality such as authentication, error boundaries, logging, and more.

Here's a breakdown of multiple **examples of Higher-Order Components**:

---

### 1. **Logging HOC**

This HOC logs component lifecycle events (rendering, mounting, unmounting) and logs the props.

```jsx
import React from "react";

// HOC that logs props and component lifecycle
function withLogging(WrappedComponent) {
  return class extends React.Component {
    componentDidMount() {
      console.log("Component mounted:", WrappedComponent.name);
    }

    componentWillUnmount() {
      console.log("Component will unmount:", WrappedComponent.name);
    }

    render() {
      console.log("Current props:", this.props);
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withLogging;
```

**Usage**:

```jsx
import React from "react";
import withLogging from "./withLogging";

function HelloWorld({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default withLogging(HelloWorld);
```

- **Explanation**: The `withLogging` HOC logs props and lifecycle events for the `HelloWorld` component when it's rendered or unmounted.

---

### 2. **Authorization HOC (Authentication)**

This HOC can be used to wrap a component and check if the user is authenticated before rendering the wrapped component.

```jsx
import React from "react";
import { Redirect } from "react-router-dom";

function withAuthProtection(WrappedComponent) {
  return function (props) {
    const isAuthenticated = localStorage.getItem("authToken"); // Example check

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuthProtection;
```

**Usage**:

```jsx
import React from "react";
import withAuthProtection from "./withAuthProtection";

function Dashboard() {
  return <h1>Welcome to the Dashboard</h1>;
}

export default withAuthProtection(Dashboard);
```

- **Explanation**: The `withAuthProtection` HOC checks if the user is authenticated by checking the presence of a token. If not, it redirects the user to the login page. Otherwise, it renders the `Dashboard` component.

---

### 3. **With Error Handling (Error Boundary)**

This HOC wraps a component and catches any errors during rendering, in lifecycle methods, or in constructors of the wrapped component tree.

```jsx
import React from "react";

function withErrorBoundary(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error, info) {
      console.error("Error caught:", error, info);
    }

    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong. Please try again later.</h1>;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withErrorBoundary;
```

**Usage**:

```jsx
import React from "react";
import withErrorBoundary from "./withErrorBoundary";

function BrokenComponent() {
  throw new Error("This is a broken component!");
  return <h1>Normal Component</h1>;
}

export default withErrorBoundary(BrokenComponent);
```

- **Explanation**: The `withErrorBoundary` HOC adds error handling by wrapping the `BrokenComponent`. If an error is thrown in the `BrokenComponent`, it will show a fallback UI instead of crashing the entire app.

---

### 4. **With Data Fetching**

A HOC that adds data fetching logic to a component. It can take a URL or an API call and inject the data into the wrapped component as props.

```jsx
import React, { useEffect, useState } from "react";

function withDataFetching(WrappedComponent, dataSource) {
  return function (props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetch(dataSource)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }, [dataSource]);

    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>Error: {error.message}</h1>;

    return <WrappedComponent {...props} data={data} />;
  };
}

export default withDataFetching;
```

**Usage**:

```jsx
import React from "react";
import withDataFetching from "./withDataFetching";

function UserList({ data }) {
  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default withDataFetching(
  UserList,
  "https://jsonplaceholder.typicode.com/users",
);
```

- **Explanation**: The `withDataFetching` HOC fetches data from the provided URL and passes it as a `data` prop to the `UserList` component. If the data is still loading, it shows a loading message, and if there’s an error, it displays the error.

---

### 5. **With Theme (Styling)**

This HOC provides theme-related styling or class names to the wrapped component, based on the current theme.

```jsx
import React from "react";

function withTheme(WrappedComponent) {
  return function (props) {
    const theme = "dark"; // Example theme logic

    return (
      <div className={theme}>
        <WrappedComponent {...props} theme={theme} />
      </div>
    );
  };
}

export default withTheme;
```

**Usage**:

```jsx
import React from "react";
import withTheme from "./withTheme";

function ThemedButton({ theme }) {
  return <button className={`btn-${theme}`}>Click me</button>;
}

export default withTheme(ThemedButton);
```

- **Explanation**: The `withTheme` HOC applies a `theme` class to the component, allowing it to render according to the current theme. It injects the `theme` as a prop into the wrapped component.

---

### 6. **With Timer (HOC for Timer Functionality)**

This HOC adds a timer functionality to the wrapped component and injects time as a prop.

```jsx
import React, { useState, useEffect } from "react";

function withTimer(WrappedComponent) {
  return function (props) {
    const [time, setTime] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    return <WrappedComponent {...props} time={time} />;
  };
}

export default withTimer;
```

**Usage**:

```jsx
import React from "react";
import withTimer from "./withTimer";

function TimerDisplay({ time }) {
  return <h1>Time passed: {time}s</h1>;
}

export default withTimer(TimerDisplay);
```

- **Explanation**: The `withTimer` HOC adds a timer that tracks the time elapsed since the component mounted. It then injects this time as a prop to the `TimerDisplay` component.

---

### Summary of Benefits of HOCs:

- **Code Reusability**: HOCs allow you to reuse logic across multiple components without duplicating code.
- **Separation of Concerns**: They help separate the concerns of components (e.g., authentication, error handling) from the core functionality.
- **Enhancement of Components**: You can add additional functionality to existing components without modifying their internal code.

---

### Conclusion:

Higher-Order Components (HOCs) are a powerful way to enhance React components by adding reusable logic and behaviors. From logging and data fetching to authentication and error handling, HOCs allow you to add cross-cutting concerns to your components in a clean, reusable way.
