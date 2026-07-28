In React, the `useContext` API is used to access the value of a **Context** directly within a functional component. Context provides a way to share values like global state or theme across components without having to manually pass props at every level of the component tree.

### Steps to Use `useContext`:

1. **Create the Context**: First, create a context using `React.createContext()`.
2. **Provide a Value**: Use the `Context.Provider` to pass the value to all components that need access to this context.
3. **Consume the Context**: Use the `useContext` hook inside a functional component to access the current context value.

---

### Example: Using `useContext` in React

#### Step 1: Create a Context

You can create a context using `React.createContext()`. This will allow you to share data across components.

```javascript
import React, { createContext, useState } from "react";

// Create a Context
const ThemeContext = createContext();

export default ThemeContext;
```

#### Step 2: Provide the Context Value

In a higher-level component (like `App.js`), use the `Context.Provider` to wrap the components that need access to the context and pass down the value to be shared.

```javascript
import React, { useState } from "react";
import ThemeContext from "./ThemeContext";
import ThemedComponent from "./ThemedComponent";

function App() {
  const [theme, setTheme] = useState("light"); // Example: light or dark theme

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        <h1>Theme Context Example</h1>
        <ThemedComponent />
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
```

- Here, `ThemeContext.Provider` is used to wrap the components (`ThemedComponent`) and pass down the current `theme` and `toggleTheme` function.
- The `value` of `Provider` can be any JavaScript object, in this case, we pass an object with `theme` and `toggleTheme`.

#### Step 3: Consume the Context Value with `useContext`

Inside a child component, you can use the `useContext` hook to access the context value.

```javascript
import React, { useContext } from "react";
import ThemeContext from "./ThemeContext";

function ThemedComponent() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div>
      <p>The current theme is: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

export default ThemedComponent;
```

- `useContext(ThemeContext)` is used here to access the current `theme` and `toggleTheme` function from the context. It returns the context value (which we passed as `{ theme, toggleTheme }`).

---

### Explanation of Key Parts:

- **`createContext()`**: Creates a new context object. This context will hold the data (e.g., the current theme).
- **`useContext()`**: Retrieves the context value. This hook takes a context object (like `ThemeContext`) and returns the current value of that context.
- **`Context.Provider`**: This component provides the context value to all child components that consume it. It is used at a higher level in the component tree.

### Example of Full Code:

```javascript
// ThemeContext.js
import React, { createContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
```

```javascript
// App.js
import React from "react";
import { ThemeProvider } from "./ThemeContext";
import ThemedComponent from "./ThemedComponent";

function App() {
  return (
    <ThemeProvider>
      <ThemedComponent />
    </ThemeProvider>
  );
}

export default App;
```

```javascript
// ThemedComponent.js
import React, { useContext } from "react";
import ThemeContext from "./ThemeContext";

function ThemedComponent() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div>
      <p>The current theme is: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

export default ThemedComponent;
```

### Key Points:

- `useContext` only works in **functional components**.
- You can consume any context by passing the context object (created by `createContext()`) to the `useContext()` hook.
- Context allows for shared state without the need to manually pass props through multiple layers of components, making it perfect for things like themes, authentication status, or global settings.

### Performance Considerations:

- **Re-rendering**: When the value of the context changes, every component that consumes the context will re-render. This is usually not an issue for small apps, but for larger applications, you may need to optimize the context usage or avoid placing large data in context.
