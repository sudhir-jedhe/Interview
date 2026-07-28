### **Custom Hooks in React**

A **custom hook** is a JavaScript function that allows you to reuse stateful logic across multiple components. Custom hooks provide a way to encapsulate logic that can be shared between different components without the need for higher-order components or render props.

Custom hooks leverage **React hooks** (like `useState`, `useEffect`, `useContext`, etc.) to extract logic and make it reusable, making your component code cleaner, more modular, and easier to maintain.

#### **Key Characteristics of Custom Hooks:**

1. **Starts with `use`**: Custom hooks must follow the naming convention of starting with the word `use` (e.g., `useFetch`, `useForm`), as React expects hooks to follow this convention to ensure proper validation of hooks rules.
2. **Encapsulates logic**: They are used to encapsulate complex logic or state management, which can be reused across different components.

3. **Returns state or functions**: Custom hooks can return any combination of state, functions, or other hooks, which can then be consumed by components.

### **Benefits of Using Custom Hooks:**

1. **Reusability**: Custom hooks help you share logic across multiple components without duplicating code.
2. **Separation of concerns**: By isolating specific functionality into hooks, you can separate concerns and make your components easier to read.
3. **Maintainability**: Custom hooks can help you maintain large applications by centralizing logic into small, manageable pieces.

---

### **Example of a Custom Hook**

Let’s consider an example where you want to create a custom hook for **fetching data from an API**.

#### **1. Custom Hook to Fetch Data (useFetch)**

```javascript
import { useState, useEffect } from "react";

// Custom Hook: useFetch
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // Re-fetch when the URL changes

  return { data, loading, error };
};

export default useFetch;
```

#### **How it Works:**

- **State**: The hook manages three states: `data`, `loading`, and `error`.
- **Effect**: It uses `useEffect` to fetch data asynchronously when the component using the hook mounts (or when the `url` changes).
- **Return**: It returns the state (`data`, `loading`, and `error`), which the component can use to render the UI.

#### **Using the Custom Hook in a Component**

Now, you can use the `useFetch` hook in a component:

```javascript
import React from "react";
import useFetch from "./useFetch"; // Import the custom hook

const DataFetchingComponent = () => {
  const { data, loading, error } = useFetch("https://api.example.com/data");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Fetched Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DataFetchingComponent;
```

In this example:

- The component **uses** the `useFetch` hook to fetch data.
- It **displays** loading text while waiting for the data, and an error message if the fetch fails.
- Once the data is fetched, it displays the result.

### **Another Example: Custom Hook for Form Handling (useForm)**

A custom hook can be used to manage the state of a form input.

#### **2. Custom Hook for Form Handling (useForm)**

```javascript
import { useState } from "react";

// Custom Hook: useForm
const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (event, callback) => {
    event.preventDefault();
    callback(values); // Pass form data to callback
  };

  return {
    values,
    handleChange,
    handleSubmit,
  };
};

export default useForm;
```

#### **Using the Custom Hook in a Component**

```javascript
import React from "react";
import useForm from "./useForm";

const MyForm = () => {
  const { values, handleChange, handleSubmit } = useForm({
    name: "",
    email: "",
  });

  const submitForm = (formData) => {
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, submitForm)}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```

#### **How it Works:**

- **useForm** initializes form values (`name` and `email`).
- The `handleChange` function updates the state whenever an input changes.
- The `handleSubmit` function calls the passed `callback` with form data when the form is submitted.

---

### **When to Use Custom Hooks**

- **Shared Logic**: Use custom hooks when you have logic that is used in multiple components and needs to be reused (e.g., fetching data, form management, event listeners).
- **State Management**: If you need to manage complex state logic that doesn’t belong directly inside a component.
- **Effect Handling**: To handle side effects like data fetching, subscriptions, or timers in a reusable way.

### **Common Use Cases for Custom Hooks**

1. **Data Fetching**: A custom hook like `useFetch` to encapsulate the logic of making API requests and handling responses.
2. **Form Management**: A custom hook like `useForm` to manage form state and validation.
3. **Local Storage**: A custom hook to manage storing and retrieving data from `localStorage` or `sessionStorage`.
4. **Media Queries**: A custom hook like `useMediaQuery` to handle different screen sizes and update the UI based on window width.
5. **Event Listeners**: A custom hook to manage adding/removing event listeners, like `useWindowWidth`.

---

### **Summary**

- **Custom Hooks** allow you to extract and reuse component logic in a clean and modular way.
- They are just JavaScript functions that use other hooks like `useState`, `useEffect`, `useContext`, etc.
- Custom hooks help reduce redundancy and improve the maintainability of your codebase.
